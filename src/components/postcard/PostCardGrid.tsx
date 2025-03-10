import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bookmark, Heart } from "lucide-react";
import Cookies from "js-cookie";
import { ClientUrl } from "../../constants/ClientUrl";
import { cardPostInfo, cardUserInfo } from "../../types/PostcardDto";
import { postActivity } from "../../types/PostDetailDto";

interface PostCardGridProps {
    postInfo: cardPostInfo;
    userInfo: cardUserInfo;
    postActivity: postActivity;
    onLike: () => void;
    onScrap: () => void;
    isLiking: boolean;
    isScrapping: boolean;
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

    const profileLink =
        userInfo.userId === currentUserId
            ? ClientUrl.PROFILE
            : `${ClientUrl.OTHERSPROFILE}/${userInfo.userId}`;

    if (postActivity.reported) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden opacity-40 hover:opacity-100"
        >
            <Link to={`${ClientUrl.SPECIFICPOST}/${postInfo.postId}`} className="block">
                {/* Header: 작성자 정보 */}
                <div className="px-3 pt-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <Link
                            to={profileLink}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center space-x-2 group"
                        >
                            <img
                                src={userInfo.profileImageUrl || "/placeholder.svg"}
                                alt="Profile"
                                className="w-8 h-8 rounded-full object-cover shadow-sm group-hover:shadow-md transition-shadow duration-200"
                            />
                            <div>
                                <p className="text-xs font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
                                    {userInfo.name}
                                </p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                    {userInfo.role}
                                </p>
                            </div>
                        </Link>
                        <span className="text-[10px] text-gray-400">
                            {new Date(postInfo.createAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Thumbnail */}
                {postInfo.thumbNailImage && postInfo.thumbNailImage.trim() !== "" && (
                    <div className="relative h-32 bg-gray-100 dark:bg-gray-700">
                        <img
                            src={postInfo.thumbNailImage || "/placeholder.svg"}
                            alt={postInfo.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Content: 제목, 요약, 좋아요/스크랩 버튼 */}
                <div className="p-3">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {postInfo.title}
                    </h2>
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                        {postInfo.summary}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onLike();
                            }}
                            disabled={isLiking}
                            className="flex items-center space-x-1 text-[10px] text-gray-500 dark:text-gray-400"
                        >
                            <Heart
                                className={`w-3 h-3 ${
                                    postActivity.liked
                                        ? "fill-current text-red-500"
                                        : "stroke-current"
                                }`}
                            />
                            <span>{postInfo.likesCount}</span>
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onScrap();
                            }}
                            disabled={isScrapping}
                            className="flex items-center space-x-1 text-[10px] text-gray-500 dark:text-gray-400"
                        >
                            <Bookmark
                                className={`w-3 h-3 ${
                                    postActivity.scraped
                                        ? "fill-current text-blue-500"
                                        : "stroke-current"
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default PostCardGrid;
