"use client"

// import React, {useMemo} from "react"
import {Link} from "react-router-dom"
import {motion, AnimatePresence} from "framer-motion"
import {Bookmark, Heart, MessageSquare} from 'lucide-react'
import {ClientUrl} from "../constants/ClientUrl.ts"
import {cardPostInfo, cardUserInfo} from "../types/PostcardDto.ts";
import {postActivity} from "../types/PostDetailDto.ts";

interface PostCardProps {
    postInfo: cardPostInfo;
    userInfo: cardUserInfo;
    postActivity: postActivity;
    onLike: () => void;
    onScrap: () => void;
    isLiking: boolean;
    isScrapping: boolean;
}

// const pastelColors = [
//     "#0c00ff", "#ff2d00", "#23ff00",
// ]

// seed에 기본값을 부여하여 seed가 없을 경우에도 오류가 발생하지 않도록 함
// const getFixedBackgroundColor = (seed: string = ""): string => {
//     if (!seed) return pastelColors[0];
//     let hash = 0;
//     for (let i = 0; i < seed.length; i++) {
//         hash = seed.charCodeAt(i) + ((hash << 5) - hash);
//     }
//     const index = Math.abs(hash) % pastelColors.length;
//     return pastelColors[index];
// }

const PostCard: React.FC<PostCardProps> = ({
                                               postInfo,
                                               userInfo,
                                               postActivity,
                                               onLike,
                                               onScrap,
                                               isLiking,
                                               isScrapping
                                           }) => {
    // const fixedBgColor = useMemo(() => getFixedBackgroundColor(postInfo.postId), [postInfo.postId]);

    if (postActivity.reported) return null;

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.3, ease: "easeOut"}}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden w-full max-w-4xl mx-auto"
        >
            <Link to={`${ClientUrl.SPECIFICPOST}/${postInfo.postId}`} className="block">
            {/* Header - Author Info */}
                <div className="px-6 pt-6 pb-4">
                    <div className="flex items-center justify-between mb-4">
                        <Link
                            to={`${ClientUrl.OTHERSPROFILE}/${userInfo.userId}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center space-x-3 group"
                        >
                            <img
                                src={userInfo.profileImageUrl || "/placeholder.svg"}
                                alt="Profile"
                                className="w-12 h-12 rounded-full object-cover shadow-sm group-hover:shadow-md transition-shadow duration-200"
                            />
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {userInfo.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{userInfo.role}</p>
                            </div>
                        </Link>
                        <span
                            className="text-xs text-gray-400">{new Date(postInfo.createAt).toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Thumbnail with Bookmark */}
                {postInfo.thumbNailImage && postInfo.thumbNailImage.trim() !== "" && (
                    <div className="relative h-64 bg-gray-100 dark:bg-gray-700">
                        <img
                            src={postInfo.thumbNailImage || "/placeholder.svg"}
                            alt={postInfo.title}
                            className="w-full h-full object-cover"
                        />

                        {/* Container for fixed positioning */}
                        <div className="absolute bottom-[220px] left-[505px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={postActivity.scraped ? "bookmarked" : "unbookmarked"}
                                    onClick={onScrap}
                                    className="cursor-pointer"
                                    initial={{scale: 0.8, opacity: 0}}
                                    animate={{scale: 1, opacity: 1}}
                                    exit={{scale: 0.8, opacity: 0}}
                                    transition={{duration: 0.15}}
                                    whileHover={{scale: 1.2}}
                                    whileTap={{scale: 0.95}}
                                >
                                    {/* 스크랩 버튼 */}
                                    <div
                                        className={`cursor-pointer ${isScrapping ? "pointer-events-none opacity-50" : ""}`}
                                        onClick={(e) => {
                                            e.preventDefault();  // 기본 링크 이동 방지
                                            e.stopPropagation(); // 부모 요소로의 이벤트 전파 방지
                                            if (!isScrapping) onScrap();
                                        }}
                                    >
                                        <Bookmark
                                            className={`transition-colors ${
                                                postActivity.scraped
                                                    ? "fill-current text-blue-500 dark:text-blue-400"
                                                    : "stroke-current text-gray-600 dark:text-gray-300"
                                            } w-10 h-10`}
                                        />
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="px-6 py-6">
                    <motion.h2
                        className="text-xl font-semibold text-gray-900 dark:text-gray-100 leading-tight mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        whileHover={{x: 5}}
                        transition={{type: "spring", stiffness: 300}}
                    >
                        {postInfo.title}
                    </motion.h2>
                    <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">{postInfo.summary}</p>
                </div>

                {/* Footer - Interactions */}
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center justify-between space-x-2">
                        {/* 태그 (왼쪽 정렬) */}
                        <div className="flex items-center space-x-1 overflow-hidden max-w-[60%]">
                            {postInfo.userTag.map((tag, index) => (
                                <span
                                    key={index}
                                    className="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 whitespace-nowrap overflow-hidden text-ellipsis"
                                >
                    {tag}
                </span>
                            ))}
                        </div>

                        {/* 좋아요 & 댓글 (오른쪽 정렬) */}
                        <div className="flex items-center space-x-4">
                            {/* 좋아요 버튼 */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onLike();
                                }}
                                className="flex items-center space-x-1"
                                disabled={isLiking}
                            >
                                <Heart
                                    className={`w-4 h-4 ${postActivity.liked ? "fill-current text-red-500" : "stroke-current text-gray-500 dark:text-gray-400"}`}
                                />
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{postInfo.likesCount}</span>
                            </button>

                            {/* 댓글 */}
                            <div className="flex items-center space-x-1">
                                <MessageSquare className="w-4 h-4 text-gray-500 dark:text-gray-400"/>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{postInfo.commentsCount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

export default PostCard;
