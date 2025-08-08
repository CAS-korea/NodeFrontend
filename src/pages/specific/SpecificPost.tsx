"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { marked } from "marked";

marked.setOptions({
    gfm: true,
    breaks: true // <- 핵심! single '\n' → <br>
});

import { motion, AnimatePresence } from "framer-motion";
import {
    Heart,
    Flag,
    MessageCircle,
    Bookmark,
    Send,
    ChevronLeft,
    Calendar,
} from "lucide-react";
import Cookies from "js-cookie";
import { useServices } from "../../context/ServicesProvider";
import PostReportModal from "../../components/postcard/PostReportModal";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { ClientUrl } from "../../constants/ClientUrl";
import type { postActivity, postInfo, userInfo } from "../../types/PostDetailDto";
import type { CommentDetailDto } from "../../types/CommentDetailDto";
import { NewCommentDto } from "../../types/NewCommentDto";
import PostComment from "../../components/postcard/PostComment";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";

const SpecificPost: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const {
        getPostById,
        likePost,
        scrapPost,
        reportPost,
        createComment,
        likeComment,
        reportComment,
    } = useServices();

    const [postInfo, setPostInfo] = useState<postInfo | null>(null);
    const [author, setAuthor] = useState<userInfo | null>(null);
    const [postActivity, setPostActivity] = useState<postActivity | null>(null);
    const [comments, setComments] = useState<CommentDetailDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [isLiking, setIsLiking] = useState(false);
    const [isScrapping, setIsScrapping] = useState(false);
    const [isReporting, setIsReporting] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);

    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [commentLength, setCommentLength] = useState(0);
    const maxLength = 500;

    // 현재 로그인한 유저 id를 쿠키에서 가져옵니다.
    const [currentUserId, setCurrentUserId] = useState<string>("");
    useEffect(() => {
        const cookieInfo = Cookies.get("info");
        if (cookieInfo) {
            try {
                const parsedInfo = JSON.parse(cookieInfo);
                setCurrentUserId(parsedInfo.userId);
            } catch (error) {
                console.error("쿠키 파싱 에러", error);
            }
        }
    }, []);

    // 게시글 데이터 불러오기
    const fetchPost = useCallback(async () => {
        if (!postId) return;
        try {
            const response = await getPostById(postId);
            setPostInfo(response.post);
            setAuthor(response.author);
            setPostActivity(response.postActivity);
            setComments(response.comment);
        } catch (error) {
            console.error("게시물 불러오기 실패: ", error);
        } finally {
            setLoading(false);
        }
    }, [postId, getPostById]);

    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

    const handleCommentSubmit = async () => {
        if (!postId || !newComment.trim()) return;
        setIsSubmitting(true);
        const newCommentDto: NewCommentDto = { comment: newComment };
        try {
            await createComment(postId, newCommentDto);
            setNewComment("");
            setCommentLength(0);
            fetchPost();
        } catch (error) {
            console.error("댓글 작성 실패:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length <= maxLength) {
            setNewComment(value);
            setCommentLength(value.length);
        }
    };

    const handleLikePost = async () => {
        if (!postId || isLiking || !postActivity) return;
        setIsLiking(true);
        try {
            await likePost(postId);
            fetchPost();
        } catch (error) {
            console.error("좋아요 처리 실패:", error);
        } finally {
            setIsLiking(false);
        }
    };

    const handleScrapPost = async () => {
        if (!postId || isScrapping || !postActivity) return;
        setIsScrapping(true);
        try {
            await scrapPost(postId);
            fetchPost();
        } catch (error) {
            console.error("스크랩 처리 실패:", error);
        } finally {
            setIsScrapping(false);
        }
    };

    const handleReportPost = async () => {
        if (!postId || isReporting || !postActivity) return;
        setIsReporting(true);
        try {
            await reportPost(postId);
            fetchPost();
        } catch (error) {
            console.error("신고 처리 실패:", error);
        } finally {
            setIsReporting(false);
        }
    };

    const handleLikeComment = async (commentId: string) => {
        if (!commentId || isLiking) return;
        setIsLiking(true);
        try {
            await likeComment(commentId);
            fetchPost();
        } catch (error) {
            console.error("댓글 좋아요 실패:", error);
        } finally {
            setIsLiking(false);
        }
    };

    const handleReportComment = async (commentId: string) => {
        if (!commentId || isReporting) return;
        setIsReporting(true);
        try {
            await reportComment(commentId);
            fetchPost();
        } catch (error) {
            console.error("댓글 신고 실패:", error);
        } finally {
            setIsReporting(false);
        }
    };

     const formatDate = (dateInput: string | Date) => {
           // string이면 Date로 변환, Date면 그대로 사용
               const date = typeof dateInput === "string"
             ? new Date(dateInput)
                 : dateInput;
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
        });
    };

    /**
     * DOMParser를 사용하여 마크다운 -> HTML -> DOM 변환 후,
     * "실제 텍스트 문단"을 찾아 첫 글자만 스타일링(span으로 감싸기).
     */
    const processContent = (markdown: string) => {
        if (!markdown) return "";
        // (1) marked.parse는 string | Promise<string> 반환 → 강제 단언
        const rawHtml = marked.parse(markdown) as string;

        const parser = new DOMParser();
        const doc = parser.parseFromString(rawHtml, "text/html");

        // 3) 모든 <p> 태그 찾기
        const paragraphs = Array.from(doc.querySelectorAll("p"));
        if (!paragraphs.length) {
            return rawHtml; // 문단이 없다면 그냥 반환
        }

        // 4) "이미지로만 구성된 문단"을 제외하고, 첫 번째로 텍스트가 있는 문단을 찾기
        //    (img 태그만 있거나, 비어있는 <p>는 건너뜀)
        let targetP: HTMLParagraphElement | null = null;
        for (const p of paragraphs) {
            // 자식 중 img 아닌 노드(텍스트나 다른 태그)가 있는지 검사
            const hasTextNode = Array.from(p.childNodes).some(
                (node) =>
                    node.nodeType === Node.TEXT_NODE && node.nodeValue?.trim() !== "" // 실제 텍스트가 있는지
            );
            if (hasTextNode) {
                targetP = p;
                break;
            }
        }

        if (!targetP) {
            // 전부 이미지나 빈 문단이라면 그대로 반환
            return rawHtml;
        }

        // 5) targetP에서 첫 번째 알파벳/숫자(또는 한글 등)를 찾아 span으로 감싸기
        //    (childNodes 순회하며 TEXT_NODE 찾기 → 첫 글자)
        for (const node of targetP.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.nodeValue || "";
                // 첫 알파벳/숫자/한글 등 원하는 범위를 정규식으로 지정
                const match = text.match(/[\p{L}\p{N}]/u); // \p{L} = 모든 유니코드 문자, \p{N} = 숫자 (unicode 정규식)
                if (match) {
                    const index = match.index || 0;
                    const firstChar = text[index];
                    // 텍스트 노드를 쪼갠다
                    const before = text.slice(0, index);
                    const after = text.slice(index + 1);

                    // 새 span 노드
                    const span = doc.createElement("span");
                    span.className = "float-left text-5xl font-serif leading-none mr-2 mt-1";
                    span.textContent = firstChar; // 한 글자만 삽입

                    // 기존 텍스트 노드 대체
                    const beforeNode = doc.createTextNode(before);
                    const afterNode = doc.createTextNode(after);

                    // 부모 p에 새 노드들을 삽입
                    targetP.insertBefore(beforeNode, node);
                    targetP.insertBefore(span, node);
                    targetP.insertBefore(afterNode, node);

                    // 원래 노드는 제거
                    targetP.removeChild(node);
                    break;
                }
            }
        }

        // 6) DOM → HTML 직렬화
        return doc.body.innerHTML;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 mb-4"></div>
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    if (!postInfo) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        게시물을 찾을 수 없습니다
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        요청하신 게시물이 존재하지 않거나 삭제되었습니다.
                    </p>
                    <Link
                        to="/"
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        홈으로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    // 작성자 프로필 링크
    const authorProfileLink =
        author?.userId === currentUserId
            ? ClientUrl.PROFILE
            : `${ClientUrl.OTHERSPROFILE}/${author?.userId}`;

    // DOMParser 방식으로 첫 글자만 래핑한 최종 HTML
    const finalHtml = processContent(postInfo.content ?? "");

    return (
        <div className="min-h-screen h-full w-full bg-white dark:bg-gray-950">
            <AnimatePresence>
                {showReportModal && (
                    <PostReportModal
                        onClose={() => setShowReportModal(false)}
                        onConfirm={handleReportPost}
                    />
                )}
            </AnimatePresence>

            {/* 썸네일 이미지가 있을 때만 Hero 섹션 표시 */}
            {postInfo.thumbNailImage && (
                <div className="relative w-full h-[50vh] overflow-hidden">
                    <div className="absolute inset-0 bg-white/5 z-10"></div>
                    <motion.img
                        src={postInfo.thumbNailImage}
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent z-10 dark:from-gray-950"></div>
                    <Link
                        to="/"
                        className="fixed top-6 left-6 z-20 bg-black backdrop-blur-md dark:bg-white text-white dark:text-black rounded-full p-2 hover:bg-white/20 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                </div>
            )}

            {/* 메인 콘텐츠 */}
            <div className={`max-w-3xl mx-auto px-4 ${postInfo.thumbNailImage ? "-mt-20" : "pt-8"} relative z-20`}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Card className="overflow-hidden shadow-xl border-0 dark:bg-gray-900">
                        <CardContent className="p-8">
                            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    <span> 작성날짜 : {formatDate(postInfo.createAt)}</span>
                                </div>
                            </div>
                            <motion.h1
                                className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                {postInfo.title}
                            </motion.h1>
                            <Link
                                to={authorProfileLink}
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center space-x-3 group mb-8"
                            >
                                <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                    <AvatarImage src={author?.profileImageUrl || "/placeholder.svg"} alt={author?.name || "Author"} />
                                    <AvatarFallback>{author?.name?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {author?.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{author?.role}</p>
                                </div>
                            </Link>
                            {/* DOMParser로 처리된 최종 HTML 렌더링 */}
                            <motion.div
                                className="prose dark:prose-invert prose-lg max-w-none mb-8"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                dangerouslySetInnerHTML={{ __html: finalHtml }}
                            />
                            <Separator className="my-8" />
                            <div className="flex justify-between items-center">
                                <div className="flex space-x-6">
                                    {/* 좋아요 버튼 */}
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleLikePost}
                                                    disabled={isLiking}
                                                    className={`rounded-full ${
                                                        postActivity?.liked ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-gray-600"
                                                    }`}
                                                >
                                                    <Heart className={`w-5 h-5 mr-1.5 ${postActivity?.liked ? "fill-current" : ""}`} />
                                                    <span>{postInfo.likesCount}</span>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{postActivity?.liked ? "좋아요 취소" : "좋아요"}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    {/* 스크랩 버튼 */}
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleScrapPost}
                                                    disabled={isScrapping}
                                                    className={`rounded-full ${
                                                        postActivity?.scraped
                                                            ? "text-yellow-500 hover:text-yellow-600"
                                                            : "text-gray-500 hover:text-gray-600"
                                                    }`}
                                                >
                                                    <Bookmark className={`w-5 h-5 mr-1.5 ${postActivity?.scraped ? "fill-current" : ""}`} />
                                                    <span>{postInfo.scrapsCount}</span>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{postActivity?.scraped ? "스크랩 취소" : "스크랩"}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    {/* 댓글 버튼 */}
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="rounded-full text-gray-500 hover:text-gray-600"
                                                    onClick={() =>
                                                        document.getElementById("comments-section")?.scrollIntoView({ behavior: "smooth" })
                                                    }
                                                >
                                                    <MessageCircle className="w-5 h-5 mr-1.5" />
                                                    <span>{postInfo.commentsCount}</span>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>댓글 보기</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>

                                {/* 신고 버튼 */}
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setShowReportModal(true)}
                                                disabled={isReporting || postActivity?.reported}
                                                className={`rounded-full ${
                                                    postActivity?.reported
                                                        ? "text-red-500 cursor-not-allowed opacity-70"
                                                        : "text-gray-500 hover:text-gray-600"
                                                }`}
                                            >
                                                <Flag className={`w-5 h-5 ${postActivity?.reported ? "fill-current" : ""}`} />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{postActivity?.reported ? "신고됨" : "신고하기"}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* 댓글 섹션 */}
                <motion.div
                    id="comments-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mt-8"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Comments ({comments.length})
                        </h2>
                        <div className="h-px flex-1 bg-gray-200 dark:bg-white-300 ml-4"></div>
                    </div>

                    <Card className="mb-8 overflow-hidden border-0 shadow-lg dark:bg-gray-900">
                        <CardContent className="p-6">
                            <div className="flex flex-col">
                                <div className="flex items-start space-x-4 mb-2">
                  <textarea
                      className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none min-h-[100px]"
                      placeholder="댓글을 입력하세요..."
                      value={newComment}
                      onChange={handleCommentChange}
                      maxLength={maxLength}
                  />
                                    <Button
                                        onClick={handleCommentSubmit}
                                        disabled={isSubmitting || !newComment.trim()}
                                        className="bg-blue-600 hover:bg-blue-700 text-white ml-4"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                <span>게시 중...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <Send className="w-4 h-4 mr-2" />
                                                <span>댓글 게시</span>
                                            </div>
                                        )}
                                    </Button>
                                </div>
                                <div className="text-gray-500 text-sm self-end">
                                    {commentLength}/{maxLength}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {comments.length > 0 ? (
                        <div className="bg-white dark:bg-gray-900 shadow-xl rounded-xl">
                            {comments.map((comment, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                                >
                                    <PostComment
                                        commentContent={comment.content}
                                        commentActivity={comment.commentActivity}
                                        commentUserInfo={comment.specificPostCommentAuthor}
                                        onLikeComment={() => handleLikeComment(comment.content.commentId)}
                                        onReportComment={() => handleReportComment(comment.content.commentId)}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <Card className="border-0 shadow-md dark:bg-gray-900">
                            <CardFooter className="p-8 flex flex-col items-center justify-center">
                                <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-3" />
                                <p className="text-gray-500 dark:text-gray-400 text-center">
                                    아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
                                </p>
                            </CardFooter>
                        </Card>
                    )}
                </motion.div>
            </div>

            {/* 썸네일 이미지가 없을 때 뒤로가기 버튼 */}
            {!postInfo.thumbNailImage && (
                <Link
                    to="/"
                    className="fixed top-6 left-6 z-20 bg-black backdrop-blur-md dark:bg-white text-white dark:text-black rounded-full p-2 hover:bg-white/20 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Link>
            )}
        </div>
    );
};

export default SpecificPost;
