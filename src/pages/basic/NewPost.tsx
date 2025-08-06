"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import type { NewPostDto, postVisibility } from "../../types/NewPostDto.ts"
import { useServices } from "../../context/ServicesProvider"
import { X, Tag, Save, Send, LogOut } from "lucide-react"
import { FileService } from "../../services/FileService"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import { ClientUrl } from "../../constants/ClientUrl"
import VisibilitySelector from "../../components/addpost/VisibilitySelector"
import DraftModal, { type Draft } from "../../components/addpost/DraftModal"
import ImageModal from "../../components/addpost/ImageModal"
import EmojiLibrary from "../../components/addpost/EmojiLibrary"
import MarkdownToolbar from "../../components/addpost/MarkdownToolbar"
import MarkdownProcessor from "../../components/addpost/MarkdownProcessor"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip"
import ExtractFirstImageUrl from "../../utils/ExtractFirstImage"

const NewPost: React.FC = () => {
    // 서비스 및 상태 관리
    const { createPost } = useServices()
    const [title, setTitle] = useState<string>("")
    const [content, setContent] = useState<string>("")
    const [userTag, setUserTag] = useState<string[]>([])
    const [tagInput, setTagInput] = useState<string>("")
    const [postVis, setPostVis] = useState<postVisibility>("PUBLIC")
    const [thumbNailImage, setThumbNailImage] = useState<string>("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [drafts, setDrafts] = useState<Draft[]>([])
    const [showDraftModal, setShowDraftModal] = useState(false)
    const [showImageModal, setShowImageModal] = useState(false)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const contentRef = useRef<HTMLTextAreaElement>(null)
    const emojiButtonRef = useRef<HTMLButtonElement>(null)

    // 마크다운에서 첫 이미지 URL 추출 함수
    useEffect(() => {
        const url = ExtractFirstImageUrl(content);
        if (url) setThumbNailImage(url);
    }, [content]);

    // 클립보드 이미지 붙여넣기 처리
    const handlePaste = async (event: ClipboardEvent) => {
        const clipboardItems = event.clipboardData?.items
        if (!clipboardItems) return
        const textarea = document.activeElement as HTMLTextAreaElement
        if (!textarea) return
        const startPos = textarea.selectionStart
        const endPos = textarea.selectionEnd
        for (const item of clipboardItems) {
            if (item.type.startsWith("image/")) {
                const file = item.getAsFile()
                if (!file) return
                const imageUrl = await FileService.uploadImage(file)
                setContent((prev) => prev.substring(0, startPos) + `\n![](${imageUrl})\n` + prev.substring(endPos))
                if (!thumbNailImage) setThumbNailImage(imageUrl)
                setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd = startPos + `\n![](${imageUrl})\n`.length
                }, 0)
            }
        }
    }

    useEffect(() => {
        document.addEventListener("paste", handlePaste)
        return () => document.removeEventListener("paste", handlePaste)
    }, [thumbNailImage])

    // 태그 관리 함수
    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter" || tagInput.trim() === "") return
        e.preventDefault()
        const newTag = tagInput.trim()
        setUserTag((prev) => (!prev.includes(newTag) ? [...prev, newTag] : prev))
        setTimeout(() => setTagInput(""), 0)
    }

    const handleRemoveTag = (tag: string) => {
        setUserTag(userTag.filter((t) => t !== tag))
    }

    // 마크다운 툴바 액션 처리 함수
    const handleMarkdownAction = (action: string, selectedText: string, color?: string) => {
        if (!contentRef.current) return
        const textarea = contentRef.current
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const before = content.substring(0, start)
        const after = content.substring(end)

        // 선택된 텍스트 (없으면 기본값 사용)
        const selection = start !== end ? content.substring(start, end) : selectedText || getDefaultTextForAction(action)

        let toInsert = ""

        switch (action) {
            case "h1":
                toInsert = `# ${selection}`
                break
            case "h2":
                toInsert = `## ${selection}`
                break
            case "bold":
                toInsert = `**${selection}**`
                break
            case "italic":
                toInsert = `_${selection}_`
                break
            case "ul":
                // 선택된 텍스트가 있으면 각 줄에 목록 기호 추가
                if (start !== end) {
                    const lines = selection.split("\n")
                    toInsert = lines.map((line) => `- ${line}`).join("\n")
                } else {
                    toInsert = `- ${selection}`
                }
                break
            case "code":
                // 여러 줄이면 코드 블록, 한 줄이면 인라인 코드
                if (selection.includes("\n")) {
                    toInsert = `\`\`\`\n${selection}\n\`\`\``
                } else {
                    toInsert = `\`${selection}\``
                }
                break
            case "color":
                if (color) {
                    toInsert = `<span style="color: ${color};">${selection}</span>`
                }
                break
            case "table":
                toInsert = `| 제목 1 | 제목 2 |\n| --- | --- |\n| 내용 1 | 내용 2 |`
                break
            default:
                toInsert = selection
        }

        setContent(before + toInsert + after)

        // 커서 위치 조정
        setTimeout(() => {
            textarea.focus()
            if (start === end) {
                // 선택된 텍스트가 없었으면 삽입된 텍스트 내부에 커서 위치
                const cursorPosition = before.length + toInsert.length
                textarea.selectionStart = textarea.selectionEnd = cursorPosition
            } else {
                // 선택된 텍스트가 있었으면 삽입된 텍스트 전체 선택
                textarea.selectionStart = before.length
                textarea.selectionEnd = before.length + toInsert.length
            }
        }, 0)
    }

    // 액션별 기본 텍스트
    const getDefaultTextForAction = (action: string): string => {
        switch (action) {
            case "h1":
                return "큰 제목"
            case "h2":
                return "중간 제목"
            case "bold":
                return "굵은 텍스트"
            case "italic":
                return "기울임 텍스트"
            case "ul":
                return "목록 항목"
            case "code":
                return "코드"
            case "color":
                return "색상 텍스트"
            default:
                return ""
        }
    }

    // 이모지 삽입 함수
    const insertEmoji = (emoji: string) => {
        if (!contentRef.current) return
        const textarea = contentRef.current
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const before = content.substring(0, start)
        const after = content.substring(end)
        const toInsert = emoji
        setContent(before + toInsert + after)
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + toInsert.length
            textarea.focus()
        }, 0)
    }

    // 이미지 삽입 함수 (크기 조절 지원)
    const handleInsertImage = (url: string) => {
        if (!contentRef.current) return
        const textarea = contentRef.current
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const before = content.substring(0, start)
        const after = content.substring(end)

        // HTML 태그로 이미지 삽입 (크기 조절 지원)
        let toInsert = ""
        if (url.startsWith("<img")) {
            // 이미 HTML 형식으로 전달된 경우
            toInsert = `\n${url}\n`
        } else {
            // 일반 URL인 경우 마크다운 형식으로 삽입
            toInsert = `\n![](${url})\n`
        }

        setContent(before + toInsert + after)
        if (!thumbNailImage) setThumbNailImage(url)

        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + toInsert.length
            textarea.focus()
        }, 0)
    }

    // 임시저장 관련 함수
    const handleSaveDraft = () => {
        const newDraft: Draft = {
            id: Date.now(),
            title: title.trim() || "제목없음",
            createdAt: Date.now(),
        }
        setDrafts((prev) => {
            const updated = [newDraft, ...prev]
            return updated.slice(0, 5)
        })
        alert("임시저장 되었습니다!")
    }

    const handleDeleteDraft = (id: number) => {
        setDrafts((prev) => prev.filter((d) => d.id !== id))
    }

    // 게시물 제출 함수
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isSubmitting) return
        setIsSubmitting(true)
        const postDTO: NewPostDto = {
            title,
            content,
            userTag,
            postVisibility: postVis,
            thumbNailImage,
        }
        try {
            await createPost(postDTO)
            alert("게시물이 성공적으로 작성되었습니다!")
            setTitle("")
            setContent("")
            setUserTag([])
            setTagInput("")
            setThumbNailImage("")
        } catch (error) {
            console.error(error)
            alert("게시물 작성 중 오류가 발생했습니다.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* 헤더 섹션 */}
                <header className="mb-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <VisibilitySelector value={postVis} onChange={setPostVis} />
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setShowDraftModal(true)}
                                            className="bg-yellow-500 hover:bg-white hover:border-white text-gray-700 border-white dark:bg-indigo-900/30 dark:hover:bg-indigo-800/50 dark:text-indigo-400 dark:border-indigo-700"
                                        >
                                            <Save className="h-5 w-5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>임시저장 목록</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`px-6 py-2 rounded-lg transition flex items-center gap-2 ${
                                    isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
                                }`}
                            >
                                {isSubmitting ? (
                                    <motion.div
                                        className="w-6 h-6 border-t-4 border-b-2 border-gray-300 bg-white rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                    />
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        게시물 올리기
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                    <AnimatePresence>
                        {showDraftModal && (
                            <DraftModal
                                drafts={drafts}
                                onDelete={handleDeleteDraft}
                                onClose={() => setShowDraftModal(false)}
                                onSaveDraft={handleSaveDraft}
                            />
                        )}
                    </AnimatePresence>
                </header>

                {/* 메인 콘텐츠 */}
                <main>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">새 게시물 작성</h1>

                    {/* 에디터와 미리보기 분할 화면 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* 왼쪽 컬럼: 제목, 내용, 태그 */}
                        <div className="space-y-6">
                            {/* 제목 입력 */}
                            <div>
                                <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">제목</h2>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="제목을 입력하세요"
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 rounded-lg text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
                                />
                            </div>

                            {/* 내용 입력 */}
                            <div>
                                <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">내용 작성</h2>

                                {/* 마크다운 툴바 */}
                                <MarkdownToolbar
                                    onAction={handleMarkdownAction}
                                    onEmojiPickerToggle={() => setShowEmojiPicker(!showEmojiPicker)}
                                    onImageInsert={() => setShowImageModal(true)}
                                    emojiButtonRef={emojiButtonRef}
                                />

                                <Card className="border-0 shadow-md">
                                    <CardContent className="p-0">
                    <textarea
                        ref={contentRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="내용을 작성하세요. 마크다운 문법을 지원합니다."
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none transition resize-none min-h-[400px]"
                        rows={16}
                    />
                                    </CardContent>
                                </Card>
                            </div>

                            {/* 태그 입력 영역 */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">태그 추가</h3>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    <AnimatePresence>
                                        {userTag.map((tag, index) => (
                                            <motion.span
                                                key={tag}
                                                layout
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{
                                                    opacity: 0,
                                                    scale: 0.8,
                                                    transition: { duration: 0.2 },
                                                }}
                                                transition={{ delay: index * 0.05 }}
                                                className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm flex items-center"
                                            >
                                                <Tag size={14} className="mr-1.5 text-blue-600 dark:text-blue-400" />
                                                <span>{tag}</span>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleRemoveTag(tag)}
                                                    className="ml-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 focus:outline-none"
                                                >
                                                    <X size={14} />
                                                </motion.button>
                                            </motion.span>
                                        ))}
                                    </AnimatePresence>
                                </div>
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                    placeholder="태그 입력 후 Enter (예: 여행, 음식, 일상)"
                                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 rounded-lg text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
                                />
                            </div>
                        </div>

                        {/* 오른쪽 컬럼: 미리보기 */}
                        <div>
                            <Card className="border-0 shadow-md h-full">
                                <CardContent className="p-6 overflow-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
                                    {/* 제목 표시 */}
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 sticky top-0 bg-white dark:bg-gray-800 py-2 border-b border-gray-100 dark:border-gray-700">
                                        {title || "제목을 입력하시면 표기됩니다."}
                                    </h1>

                                    {/* 본문 내용 미리보기 */}
                                    {content ? (
                                        <MarkdownProcessor content={content} />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-gray-400 min-h-[300px]">
                                            <p>내용을 입력하면 미리보기가 표시됩니다.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* 하단 버튼 */}
                    <div className="flex justify-between items-center">
                        <Link
                            to={ClientUrl.HOME}
                            className="px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            나가기
                        </Link>
                        <Button
                            onClick={handleSaveDraft}
                            variant="outline"
                            className="bg-yellow-500 hover:bg-white hover:border-white text-gray-700 border-white dark:bg-indigo-900/30 dark:hover:bg-indigo-800/50 dark:text-indigo-400 dark:border-indigo-700"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            임시저장
                        </Button>
                    </div>
                </main>

                {/* 이미지 삽입 모달 */}
                <AnimatePresence>
                    {showImageModal && <ImageModal onClose={() => setShowImageModal(false)} onInsert={handleInsertImage} />}
                </AnimatePresence>

                {/* 이모지 선택기 */}
                <div>
                    {showEmojiPicker && <EmojiLibrary onSelectEmoji={insertEmoji} onClose={() => setShowEmojiPicker(false)} />}
                </div>
            </div>
        </div>
    )
}

export default NewPost

