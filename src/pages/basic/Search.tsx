"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchIcon, Bot, Tag, X } from "lucide-react";
import PostContainer from "../../components/Container";
import PostCard from "../../components/PostCard.tsx";
import { PostService } from "../../services/PostService.ts";
import { cardActivityInfo, cardPostInfo, cardUserInfo } from "../../types/PostcardDto.ts";

const SearchPage: React.FC = () => {
    const [searchMode, setSearchMode] = useState<"keyword" | "ai">("keyword");
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [recentKeywords, setRecentKeywords] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState("");
    const [showEmptyWarning, setShowEmptyWarning] = useState(false);
    const [searchResults, setSearchResults] = useState<
        { postInfo: cardPostInfo; userInfo: cardUserInfo; postActivity: cardActivityInfo }[]
    >([]);
    const [error, setError] = useState<string | null>(null); // 오류 상태 추가

    const handleDeleteKeyword = (keyword: string) => {
        setRecentKeywords((prev) => prev.filter((item) => item !== keyword));
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim() === "") {
            setShowEmptyWarning(true);
            setTimeout(() => setShowEmptyWarning(false), 3000);
            return;
        }

        setIsLoading(true);
        setError(null); // 이전 오류 초기화
        try {
            if (searchMode === "keyword") {
                const results = await PostService.searchPosts(query);
                const formattedResults = results.map((post) => ({
                    postInfo: {
                        postId: post.postInfo.postId,
                        title: post.postInfo.title,
                        summary: post.postInfo.summary,
                        userTag: post.postInfo.userTag,
                        likesCount: post.postInfo.likesCount,
                        scrapsCount: post.postInfo.scrapsCount,
                        commentsCount: post.postInfo.commentsCount,
                        createAt: post.postInfo.createAt,
                        thumbNailImage: post.postInfo.thumbNailImage,
                    },
                    userInfo: post.userInfo,
                    postActivity: post.postActivity,
                }));
                setSearchResults(formattedResults);
                setSearchPerformed(true);
                setRecentKeywords((prev) => [query, ...prev.filter((item) => item !== query)].slice(0, 5));
            } else {
                // AI 검색 모드 (미구현 상태 유지)
                setSearchPerformed(true);
                setRecentKeywords((prev) => [query, ...prev.filter((item) => item !== query)].slice(0, 5));
            }
        } catch (error) {
            console.error("검색 실패: ", error);
            setError("검색 중 오류가 발생했습니다. 다시 시도해주세요.");
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLikePost = async (postId: string) => {
        try {
            await PostService.likePost(postId);
            setSearchResults((prev) =>
                prev.map((post) =>
                    post.postInfo.postId === postId
                        ? {
                            ...post,
                            postActivity: { ...post.postActivity, liked: !post.postActivity.liked },
                            postInfo: {
                                ...post.postInfo,
                                likesCount: post.postActivity.liked
                                    ? post.postInfo.likesCount - 1
                                    : post.postInfo.likesCount + 1,
                            },
                        }
                        : post
                )
            );
        } catch (error) {
            console.error("좋아요 실패: ", error);
        }
    };

    const handleScrapPost = async (postId: string) => {
        try {
            await PostService.scrapPost(postId);
            setSearchResults((prev) =>
                prev.map((post) =>
                    post.postInfo.postId === postId
                        ? {
                            ...post,
                            postActivity: { ...post.postActivity, scraped: !post.postActivity.scraped },
                            postInfo: {
                                ...post.postInfo,
                                scrapsCount: post.postActivity.scraped
                                    ? post.postInfo.scrapsCount - 1
                                    : post.postInfo.scrapsCount + 1,
                            },
                        }
                        : post
                )
            );
        } catch (error) {
            console.error("스크랩 실패: ", error);
        }
    };

    return (
        <PostContainer>
            <AnimatePresence>
                {showEmptyWarning && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center"
                    >
                        검색하시려면 뭐라도 적으셔야죠..
                    </motion.div>
                )}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto p-6 font-sans"
            >
                <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">검색</h1>
                <p className="text-xl mb-6 text-gray-600 dark:text-gray-300">원하는 내용을 검색하세요!</p>

                <motion.div
                    className="flex space-x-4 mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <button
                        className={`px-4 py-2 rounded-full transition-colors duration-300 ${
                            searchMode === "keyword"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        }`}
                        onClick={() => setSearchMode("keyword")}
                    >
                        키워드 기반 검색
                    </button>
                    <button
                        className={`px-4 py-2 rounded-full transition-colors duration-300 ${
                            searchMode === "ai"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        }`}
                        onClick={() => setSearchMode("ai")}
                    >
                        AI 기반 검색
                    </button>
                </motion.div>

                <motion.form
                    onSubmit={handleSearch}
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <div className="relative">
                        <SearchIcon
                            size={22}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                        />
                        <input
                            type="search"
                            placeholder={searchMode === "ai" ? "AI에게 물어보세요" : "검색어를 입력하세요"}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 shadow-lg bg-white dark:bg-gray-800 rounded-full text-black dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                        <button
                            type="submit"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full hover:bg-blue-600 transition"
                        >
                            검색
                        </button>
                    </div>
                </motion.form>

                <AnimatePresence>
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="mb-4"
                        >
                            <motion.div
                                className="w-full bg-gray-200 dark:bg-gray-700 h-1 rounded-full overflow-hidden"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <motion.div
                                    className="bg-blue-500 h-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{
                                        duration: 2,
                                        ease: [0.4, 0.0, 0.2, 1],
                                    }}
                                />
                            </motion.div>
                        </motion.div>
                    )}

                    {!isLoading && !searchPerformed && searchMode === "keyword" && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-center"
                        >
                            <p className="text-xl mb-4 text-gray-700 dark:text-gray-300">
                                검색을 통해 알려드려요! 검색해보세요.
                            </p>
                            <img
                                src="/SearchImg.png"
                                alt="Search Encouragement"
                                width="300"
                                height="300"
                                className="mx-auto opacity-30"
                            />
                        </motion.div>
                    )}

                    {!isLoading && searchPerformed && searchMode === "keyword" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">검색 결과</h2>
                            {searchResults.length > 0 ? (
                                searchResults.map((post) => (
                                    <PostCard
                                        key={post.postInfo.postId}
                                        postInfo={post.postInfo}
                                        userInfo={post.userInfo}
                                        postActivity={post.postActivity}
                                        onLike={() => handleLikePost(post.postInfo.postId)}
                                        onScrap={() => handleScrapPost(post.postInfo.postId)}
                                        isLiking={false}
                                        isScrapping={false}
                                    />
                                ))
                            ) : (
                                <p className="text-gray-600 dark:text-gray-400 text-center">검색 결과가 없습니다.</p>
                            )}

                            {recentKeywords.length > 0 && (
                                <>
                                    <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800 dark:text-gray-100">최근 검색어</h2>
                                    <div className="flex flex-wrap gap-2">
                                        <AnimatePresence>
                                            {recentKeywords.map((keyword, index) => (
                                                <motion.span
                                                    key={keyword}
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm flex items-center"
                                                >
                                                    <Tag size={16} className="mr-2 text-gray-600 dark:text-white" />
                                                    {keyword && <span className="text-black dark:text-white">{keyword}</span>}
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleDeleteKeyword(keyword)}
                                                        className="ml-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 focus:outline-none"
                                                    >
                                                        <X size={14} />
                                                    </motion.button>
                                                </motion.span>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}

                    {!isLoading && searchMode === "ai" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center"
                        >
                            <p className="text-xl mb-4 text-gray-700 dark:text-gray-300">
                                AI가 검색을 도와드려요! 무엇을 검색하시겠어요?
                            </p>
                            <Bot size={100} className="mx-auto mb-4 text-blue-400" />
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                무엇이든 적어주시면 제가 최선을 다하겠습니다!
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </PostContainer>
    );
};

export default SearchPage;