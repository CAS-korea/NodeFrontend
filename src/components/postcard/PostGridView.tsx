import React, { useState } from "react";
import { motion } from "framer-motion";
import PostCardGrid from "./PostCardGrid";
import { cardActivityInfo, cardPostInfo, cardUserInfo } from "../../types/PostcardDto";
import SideArrows from "./SideArrows"; // Import the Sidebar arrows component

interface PagedPostGridProps {
    posts: { postInfo: cardPostInfo; userInfo: cardUserInfo; postActivity: cardActivityInfo }[];
    isLiking: boolean;
    isScrapping: boolean;
    onLike: (postId: string) => void;
    onScrap: (postId: string) => void;
}

const chunkArray = (array: any[], chunkSize: number) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
};

const PostGridView: React.FC<PagedPostGridProps> = ({
                                                        posts,
                                                        isLiking,
                                                        isScrapping,
                                                        onLike,
                                                        onScrap,
                                                    }) => {
    const pages = chunkArray(posts, 4);
    const [currentPage, setCurrentPage] = useState(0);

    const containerHeight =
        posts.length > 2 ? "80vh" : "auto"; // Dynamically adjust container height

    const goToNextPage = () => {
        if (currentPage < pages.length - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div
            className="relative overflow-hidden"
            style={{ height: containerHeight }}
        >
            {/* Content */}
            <motion.div
                animate={{
                    y: containerHeight === "80vh" ? -currentPage * (window.innerHeight * 0.8) : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                {pages.map((page, pageIndex) => (
                    <div
                        key={pageIndex}
                        className="grid grid-cols-2 gap-4 p-4"
                        style={{ height: containerHeight }}
                    >
                        {page.map(({ postInfo, userInfo, postActivity }) => (
                            <PostCardGrid
                                key={postInfo.postId}
                                postInfo={postInfo}
                                userInfo={userInfo}
                                postActivity={postActivity}
                                onLike={() => onLike(postInfo.postId)}
                                isLiking={isLiking}
                                onScrap={() => onScrap(postInfo.postId)}
                                isScrapping={isScrapping}
                            />
                        ))}
                    </div>
                ))}
            </motion.div>

            {/* Arrow buttons for navigation */}
            <SideArrows
                onNext={goToNextPage}
                onPrevious={goToPreviousPage}
                canGoPrevious={currentPage > 0}
                canGoNext={currentPage < pages.length - 1}
            />
        </div>
    );
};

export default PostGridView;
