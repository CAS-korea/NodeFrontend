/* This component is now simpler, as it no longer needs anchor logic */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { Bookmark, Heart } from 'lucide-react';
import { ClientUrl } from "../../constants/ClientUrl";
import { type cardPostInfo, type cardUserInfo, type cardActivityInfo } from "../../types/PostcardDto";
import { useServices } from "../../context/ServicesProvider";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface PostCardGridProps {
    postInfo: cardPostInfo;
    userInfo: cardUserInfo;
    postActivity: cardActivityInfo;
    onLike: () => void;
    onScrap: () => void;
    isLiking: boolean;
    isScrapping: boolean;
    // index prop is removed
}

const PostCardGrid: React.FC<PostCardGridProps> = ({
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
        userInfo.userId === currentUserId ? ClientUrl.PROFILE : `${ClientUrl.OTHERSPROFILE}/${userInfo.userId}`;

    if (postActivity.reported) return null;

    return (
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white dark:from-zinc-900 border border-zinc-200/70 dark:border-zinc-700/60 shadow-sm hover:shadow-xl transition-shadow duration-300">
            <div
                className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full blur-2xl opacity-20 dark:opacity-10"
                style={{
                    background: "radial-gradient(120px 120px at center, rgba(59,130,246,0.25), rgba(59,130,246,0))",
                }}
                aria-hidden="true"
            />
            <Link to={`${ClientUrl.SPECIFICPOST}/${postInfo.postId}`} className="block focus:outline-none h-full flex flex-col">
                <div className="px-3 pt-3 pb-2 border-b border-zinc-200/80 dark:border-zinc-700/70">
                    <div className="flex items-center justify-between">
                        <Link to={profileLink} onClick={(e) => e.stopPropagation()} className="flex items-center space-x-2 group/link">
                            <Avatar className="h-12 w-12 text-black border-2 border-white dark:border-zinc-800 dark:text-white shadow-sm">
                                <AvatarImage src={userInfo?.profileImageUrl || "/placeholder.svg?height=96&width=96&query=user-avatar"} alt={userInfo?.name || "Author"} />
                                <AvatarFallback>{userInfo?.name?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 group-hover/link:text-blue-600 dark:group-hover/link:text-blue-400 transition-colors">{userInfo.name}</p>
                                <p className="text-[10px] text-zinc-500 dark:text-zinc-400">{userInfo.role}</p>
                            </div>
                        </Link>
                        <span className="text-[10px] text-zinc-400">{new Date(postInfo.createAt).toLocaleDateString()}</span>
                    </div>
                </div>
                {postInfo.thumbNailImage && postInfo.thumbNailImage.trim() !== "" && (
                    <div className="relative h-32 bg-zinc-100 dark:bg-zinc-700">
                        <img src={postInfo.thumbNailImage || "/placeholder.svg?height=256&width=512&query=post-thumbnail"} alt={postInfo.title} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                )}
                <div className="p-3 flex-grow flex flex-col justify-between">
                    <div>
                        <motion.h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 truncate transition-colors hover:text-blue-600 dark:hover:text-blue-400" whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                            {postInfo.title}
                        </motion.h2>
                        <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2">{postInfo.summary}</p>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onLike(); }} disabled={isLiking} className="flex items-center space-x-1 text-[10px] text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors disabled:opacity-60">
                            <Heart className={`w-3 h-3 ${postActivity.liked ? "fill-current text-red-500" : "stroke-current"}`} />
                            <span>{postInfo.likesCount}</span>
                        </button>
                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onScrap(); }} disabled={isScrapping} className="flex items-center space-x-1 text-[10px] text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors disabled:opacity-60">
                            <Bookmark className={`w-3 h-3 ${postActivity.scraped ? "fill-current text-blue-500" : "stroke-current"}`} />
                        </button>
                    </div>
                </div>
            </Link>
            <span className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-blue-500/0 group-focus-within:ring-2 group-focus-within:ring-blue-500/30 transition" />
        </div>
    );
};

export default PostCardGrid;
