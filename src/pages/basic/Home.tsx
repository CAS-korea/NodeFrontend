import React, { useEffect, useState } from "react";
import PostCard from "../../components/postcard/PostCard";
import PostContainer from "../../components/postcard/Container.tsx";
import PostGridView from "../../components/postcard/PostGridView";
import { useServices } from "../../context/ServicesProvider.tsx";
import { cardActivityInfo, cardPostInfo, cardUserInfo } from "../../types/PostcardDto";
import LayoutToggleButton from "../../components/postcard/HomeLayoutButton.tsx";

const Home: React.FC = () => {
    const [posts, setPosts] = useState<
        { postInfo: cardPostInfo; userInfo: cardUserInfo; postActivity: cardActivityInfo }[]
    >([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isLiking, setIsLiking] = useState(false);
    const [isScrapping, setIsScrapping] = useState(false);
    const [layoutMode, setLayoutMode] = useState<"scroll" | "grid">("scroll");

    const { getAllPosts, likePost, scrapPost } = useServices();

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const allPosts = await getAllPosts();
            if (Array.isArray(allPosts)) {
                setPosts(allPosts);
            } else {
                console.error("제대로 된 반환값이 아닙니다: ", allPosts);
                setPosts([]);
            }
        } catch (error) {
            console.error("게시물 불러오기 실패: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleLikePost = async (postId: string) => {
        setIsLiking(true);
        try {
            await likePost(postId);
            // Update the post state directly instead of refetching all posts
            setPosts(posts.map(post =>
                post.postInfo.postId === postId
                    ? { ...post, postActivity: { ...post.postActivity, liked: true, likesCount: post.postActivity.likesCount + 1 } }
                    : post
            ));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLiking(false);
        }
    };

    const handleScrapPost = async (postId: string) => {
        setIsScrapping(true);
        try {
            await scrapPost(postId);
            // Update the post state directly instead of refetching all posts
            setPosts(posts.map(post =>
                post.postInfo.postId === postId
                    ? { ...post, postActivity: { ...post.postActivity, scraped: true } }
                    : post
            ));
        } catch (error) {
            console.error(error);
        } finally {
            setIsScrapping(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900">
                <div className="w-16 h-16 border-4 border-blue-500 dark:border-blue-500 dark:border-t-transparent border-t-transparent rounded-full animate-spin"></div>
                <div className="w-30 h-16 px-3 py-5 text-gray-400 dark:text-gray-300">
                    잠시만 기다려주세요!
                </div>
            </div>
        );
    }

    return (
        <PostContainer>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">홈</h1>
                <LayoutToggleButton layoutMode={layoutMode} setLayoutMode={setLayoutMode} />
            </div>
            {layoutMode === "scroll" ? (
                <div className="space-y-4 mt-4">
                    {posts.length > 0 ? (
                        posts.map(({ postInfo, userInfo, postActivity }) => (
                            <PostCard
                                key={postInfo.postId}
                                postInfo={{
                                    ...postInfo,
                                    thumbNailImage: postInfo.thumbNailImage || undefined,
                                }}
                                userInfo={userInfo}
                                postActivity={postActivity}
                                onLike={() => handleLikePost(postInfo.postId)}
                                isLiking={isLiking}
                                onScrap={() => handleScrapPost(postInfo.postId)}
                                isScrapping={isScrapping}
                            />
                        ))
                    ) : (
                        <p className="text-gray-400 dark:text-gray-500 text-center">
                            게시물이 없습니다. 어떻게 이런 일이..
                        </p>
                    )}
                </div>
            ) : (
                <PostGridView
                    posts={posts}
                    isLiking={isLiking}
                    isScrapping={isScrapping}
                    onLike={handleLikePost}
                    onScrap={handleScrapPost}
                />
            )}
        </PostContainer>
    );
};

export default Home;
