"use client";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Heart, MessageSquare } from "lucide-react";
import Cookies from "js-cookie";
import { ClientUrl } from "../../constants/ClientUrl.ts";
import { cardPostInfo, cardUserInfo } from "../../types/PostcardDto.ts";
import { postActivity } from "../../types/PostDetailDto.ts";
import { useServices } from "../../context/ServicesProvider.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";

interface PostCardProps {
    postInfo: cardPostInfo;
    userInfo: cardUserInfo;
    postActivity: postActivity;
    onLike: () => void;
    onScrap: () => void;
    isLiking: boolean;
    isScrapping: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
                                               postInfo,
                                               userInfo,
                                               postActivity,
                                               onLike,
                                               onScrap,
                                               isLiking,
                                               isScrapping,
                                           }) => {
    const { getUserInfo } = useServices();
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
    }, [getUserInfo]);

    const profileLink =
        userInfo.userId === currentUserId
            ? ClientUrl.PROFILE
            : `${ClientUrl.OTHERSPROFILE}/${userInfo.userId}`;

    if (postActivity.reported) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden w-full max-w-4xl mx-auto"
        >
            <Link to={`${ClientUrl.SPECIFICPOST}/${postInfo.postId}`} className="block">
                {/* Header - Author Info */}
                <div className="px-6 pt-6 pb-4">
                    <div className="flex items-center justify-between mb-4">
                        <Link
                            to={profileLink}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center space-x-3 group"
                        >
                            <Avatar className="h-12 w-12 border-2 border-white shadow-sm dark:text-white">
                                <AvatarImage src={userInfo?.profileImageUrl || "/placeholder.svg"} alt={userInfo?.name || "Author"} />
                                <AvatarFallback>{userInfo?.name?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {userInfo.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{userInfo.role}</p>
                            </div>
                        </Link>
                        <span className="text-xs text-gray-400">
                            {new Date(postInfo.createAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Thumbnail with Bookmark */}
                {postInfo.thumbNailImage && postInfo.thumbNailImage.trim() !== "" ? (
                    <div className="relative h-64 bg-gray-100 dark:bg-gray-700">
                        <img
                            src={postInfo.thumbNailImage}
                            alt={postInfo.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-[220px] left-[505px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={postActivity.scraped ? "bookmarked" : "unbookmarked"}
                                    onClick={onScrap}
                                    className="cursor-pointer"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div
                                        className={`cursor-pointer ${isScrapping ? "pointer-events-none opacity-50" : ""}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
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
                ) : null}

                {/* Content */}
                <div className="px-6 py-6">
                    <motion.h2
                        className="text-xl font-semibold text-gray-900 dark:text-gray-100 leading-tight mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        {postInfo.title}
                    </motion.h2>
                    <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                        {postInfo.summary}
                    </p>
                </div>

                {/* Footer - Interactions */}
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center justify-between space-x-2">
                        <div className="flex items-center space-x-1 overflow-hidden max-w-[60%]">
                            {(postInfo.userTag ?? []).map((tag, index) => (
                                <span
                                    key={index}
                                    className="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 whitespace-nowrap overflow-hidden text-ellipsis"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>



                        <div className="flex items-center space-x-4">
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
                                    className={`w-4 h-4 ${
                                        postActivity.liked
                                            ? "fill-current text-red-500"
                                            : "stroke-current text-gray-500 dark:text-gray-400"
                                    }`}
                                />
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {postInfo.likesCount}
                                </span>
                            </button>

                            <div className="flex items-center space-x-1">
                                <MessageSquare className="w-4 h-4 text-gray-500 dark:text-gray-400"/>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {postInfo.commentsCount}
                                </span>
                            </div>

                            {(!postInfo.thumbNailImage || postInfo.thumbNailImage.trim() === "") && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onScrap();
                                    }}
                                    disabled={isScrapping}
                                    className="flex items-center space-x-1"
                                >
                                    <Bookmark
                                        className={`w-6 h-6 transition-colors ${
                                            postActivity.scraped
                                                ? "fill-current text-blue-500 dark:text-blue-400"
                                                : "stroke-current text-gray-600 dark:text-gray-300"
                                        }`}
                                    />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default PostCard;
