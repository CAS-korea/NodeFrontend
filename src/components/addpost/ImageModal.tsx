"use client"

// 이미지 모달 컴포넌트 - 이미지 업로드 및 URL 입력 기능 제공
import type React from "react"
import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { UploadCloud, X, LinkIcon } from "lucide-react"
import { FileService } from "../../services/FileService"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Slider } from "../../components/ui/slider"

interface ImageModalProps {
    onClose: () => void
    onInsert: (imageUrl: string) => void
}

const ImageModal: React.FC<ImageModalProps> = ({ onClose, onInsert }) => {
    const [imageUrl, setImageUrl] = useState("")
    const [dragActive, setDragActive] = useState(false)
    const [previewImage, setPreviewImage] = useState<string>("")
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("")
    const [imageSize, setImageSize] = useState<number>(100) // 기본 이미지 크기 100%
    const [isUploading, setIsUploading] = useState(false)
    const [, setActiveTab] = useState<"upload" | "url">("upload")

    // 파일 드래그 이벤트 핸들러
    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
    }, [])

    const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0]
            await handleFileUpload(file)
        }
    }, [])

    // 파일 업로드 처리
    const handleFileUpload = async (file: File) => {
        // 파일 미리보기 생성 (FileReader 사용)
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreviewImage(reader.result as string)
        }
        reader.readAsDataURL(file)

        setIsUploading(true)
        try {
            // 실제 업로드 진행
            const url = await FileService.uploadImage(file)
            setUploadedImageUrl(url)
        } catch (err) {
            console.error("Image upload failed", err)
            alert("이미지 업로드에 실패했습니다.")
        } finally {
            setIsUploading(false)
        }
    }

    // 파일 선택 처리
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            await handleFileUpload(file)
        }
    }

    // 이미지 삽입 처리
    const handleInsert = () => {
        // 업로드된 이미지 URL 우선, 없으면 입력된 URL 사용
        const finalUrl = uploadedImageUrl || imageUrl
        if (finalUrl.trim()) {
            // 이미지 크기가 100%가 아닌 경우 HTML 태그로 삽입
            if (imageSize !== 100) {
                onInsert(`<img src="${finalUrl}" width="${imageSize}%" alt="Uploaded image" />`)
            } else {
                // 기본 마크다운 이미지 문법 사용
                onInsert(finalUrl)
            }
            onClose()
        }
    }

    return (
        <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">이미지 추가</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X size={20} />
                    </button>
                </div>

                <Tabs defaultValue="upload" className="p-4" onValueChange={(value) => setActiveTab(value as "upload" | "url")}>
                    <TabsList className="grid grid-cols-2 mb-4">
                        <TabsTrigger value="upload" className="flex items-center gap-2">
                            <UploadCloud size={16} />
                            <span>업로드</span>
                        </TabsTrigger>
                        <TabsTrigger value="url" className="flex items-center gap-2">
                            <LinkIcon size={16} />
                            <span>URL</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="space-y-4">
                        {/* 드래그 앤 드롭 영역 */}
                        <div
                            className={`flex flex-col items-center justify-center border-2 ${
                                dragActive ? "border-blue-500" : "border-dashed border-gray-300 dark:border-gray-600"
                            } rounded-lg p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById("file-upload")?.click()}
                        >
                            {previewImage ? (
                                <div className="w-full">
                                    <img
                                        src={previewImage || "/placeholder.svg"}
                                        alt="Preview"
                                        className="mx-auto object-contain max-h-48"
                                        style={{ width: `${imageSize}%` }}
                                    />
                                </div>
                            ) : (
                                <>
                                    <UploadCloud size={32} className="text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                        클릭하거나 파일을 드래그하여 업로드
                                        <br />
                                        <span className="text-xs">JPG, PNG, GIF 지원</span>
                                    </p>
                                </>
                            )}
                            <input id="file-upload" type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                        </div>
                        {isUploading && (
                            <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-gray-100"></div>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="url" className="space-y-4">
                        <div>
                            <Label htmlFor="image-url">이미지 URL</Label>
                            <Input
                                id="image-url"
                                type="text"
                                placeholder="https://example.com/image.jpg"
                                value={imageUrl}
                                onChange={(e) => {
                                    setImageUrl(e.target.value)
                                    if (e.target.value.match(/\.(jpeg|jpg|gif|png)$/i)) {
                                        setPreviewImage(e.target.value)
                                    }
                                }}
                                className="mt-1"
                            />
                        </div>

                        {imageUrl && imageUrl.match(/\.(jpeg|jpg|gif|png)$/i) && (
                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden p-2">
                                <img
                                    src={imageUrl || "/placeholder.svg"}
                                    alt="Preview"
                                    className="mx-auto object-contain max-h-48"
                                    style={{ width: `${imageSize}%` }}
                                    onError={() => setPreviewImage("")}
                                />
                            </div>
                        )}
                    </TabsContent>

                    {/* 이미지 크기 조절 슬라이더 (미리보기가 있을 때만 표시) */}
                    {previewImage && (
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between">
                                <Label htmlFor="image-size">이미지 크기: {imageSize}%</Label>
                            </div>
                            <Slider
                                id="image-size"
                                min={10}
                                max={100}
                                step={5}
                                value={[imageSize]}
                                onValueChange={(value) => setImageSize(value[0])}
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" onClick={onClose}>
                            취소
                        </Button>
                        <Button onClick={handleInsert} disabled={(!uploadedImageUrl && !imageUrl) || isUploading}>
                            {isUploading ? "업로드 중..." : "삽입하기"}
                        </Button>
                    </div>
                </Tabs>
            </motion.div>
        </motion.div>
    )
}

export default ImageModal

