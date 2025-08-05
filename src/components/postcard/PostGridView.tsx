import React, { useState } from "react";
import { motion } from "framer-motion";
import PostCardGrid from "./PostCardGrid";
import { cardActivityInfo, cardPostInfo, cardUserInfo } from "../../types/PostcardDto";

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
    // 4개씩 페이지 단위로 묶기
    const pages = chunkArray(posts, 4);
    const [currentPage, setCurrentPage] = useState(0);

    // 만약 전체 페이지가 1개이고, 그 페이지의 포스트 수가 4개 미만이면 container 높이를 컨텐츠에 맞게 "auto"로 설정
    const containerHeight =
        pages.length === 1 && pages[0].length < 4 ? "auto" : "80vh";

    // 드래그 종료 시 일정 오프셋 이상이면 페이지 전환 (containerHeight가 "auto"일 경우 페이지 전환이 필요 없으므로 animate y는 0)
    const handleDragEnd = (_: any, info: { offset: { y: number } }) => {
        const threshold = 50;
        if (info.offset.y < -threshold && currentPage < pages.length - 1) {
            setCurrentPage(currentPage + 1);
        } else if (info.offset.y > threshold && currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="relative overflow-hidden" style={{ height: containerHeight }}>
            <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                onDragEnd={handleDragEnd}
                animate={{
                    y:
                        containerHeight === "80vh"
                            ? -currentPage * (window.innerHeight * 0.8)
                            : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                {pages.map((page, pageIndex) => (
                    <div
                        key={pageIndex}
                        className="grid grid-cols-2 gap-4 p-4"
                        style={{ height: containerHeight }}
                    >
                        {page.map(({ postInfo, userInfo, postActivity }: any) => (
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
        </div>
    );
};

export default PostGridView;
