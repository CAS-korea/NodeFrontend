"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Users, MessageSquare } from "lucide-react";
import PostContainer from "../../components/Container";
import PostCard from "../../components/PostCard";
import { useServices } from "../../context/ServicesProvider";
import { UserService } from "../../services/UserService";
import type { UserProfileDto, PostCardDto } from "../../types/UserProfileDto";
import FollowModal from "../../components/profile/FollowModal";
import {FollowUser} from "../../types/FollowUser.ts";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
};

const OthersProfile: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [userProfile, setUserProfile] = useState<UserProfileDto | null>(null);
    const [posts, setPosts] = useState<PostCardDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isLiking, setIsLiking] = useState(false);
    const [isScrapping, setIsScrapping] = useState(false);
    const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
    const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followers, setFollowers] = useState<FollowUser[]>([]);
    const [following, setFollowing] = useState<FollowUser[]>([]);

    const { likePost, scrapPost, getUserProfile } = useServices();

    // 사용자 프로필과 게시물을 가져오는 함수
    const fetchProfile = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const profile = await getUserProfile(userId);
            if (profile) {
                setUserProfile(profile);
                setPosts(profile.postCardDtoList);
                setIsFollowing(profile.followActivityDto.isFollowing);
            }
        } catch (error) {
            console.error("프로필 불러오기 실패: ", error);
        } finally {
            setLoading(false);
        }
    };

    // 팔로워 목록 가져오기 (실제 API 연동)
    const fetchFollowers = async () => {
        if (!userId) return;
        try {
            const data = await UserService.getFollowers(userId);
            setFollowers(data);
        } catch (error) {
            console.error("팔로워 데이터 불러오기 실패: ", error);
        }
    };

    // 팔로잉 목록 가져오기 (실제 API 연동)
    const fetchFollowing = async () => {
        if (!userId) return;
        try {
            const data = await UserService.getFollowing(userId);
            setFollowing(data);
        } catch (error) {
            console.error("팔로잉 데이터 불러오기 실패: ", error);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [userId]);

    // 팔로우/언팔로우 토글
    const handleFollowToggle = async () => {
        if (!userId) return;
        try {
            await UserService.followUser(userId);
            setIsFollowing(!isFollowing);
            await fetchProfile();
        } catch (error) {
            console.error("팔로우 실패: ", error);
        }
    };

    // 게시물 좋아요 처리
    const handleLikePost = async (postId: string) => {
        if (isLiking) return;
        setIsLiking(true);
        try {
            await likePost(postId);
            await fetchProfile();
        } catch (error) {
            console.error("좋아요 실패: ", error);
        } finally {
            setIsLiking(false);
        }
    };

    // 게시물 스크랩 처리
    const handleScrapPost = async (postId: string) => {
        if (isScrapping) return;
        setIsScrapping(true);
        try {
            await scrapPost(postId);
            await fetchProfile();
        } catch (error) {
            console.error("스크랩 실패: ", error);
        } finally {
            setIsScrapping(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">잠시만 기다려주세요!</p>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">사용자를 찾을 수 없습니다</p>
            </div>
        );
    }

    return (
        <PostContainer>
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* 프로필 제목 */}
                <motion.h1 {...fadeInUp} className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
                    프로필
                </motion.h1>

                {/* 프로필 정보 섹션 */}
                <motion.div {...fadeInUp} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <img
                                src={userProfile.userInformationDto.profileImageUrl || "/placeholder.svg"}
                                alt={userProfile.userInformationDto.name}
                                className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                            />
                            <div className="ml-4">
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    {userProfile.userInformationDto.name}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300">@{userProfile.userInformationDto.userId}</p>
                                <p className="text-gray-500 dark:text-gray-400">{userProfile.userInformationDto.role}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleFollowToggle}
                                className={`px-6 py-2.5 rounded-full transition-all duration-200 font-medium ${
                                    isFollowing
                                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                        : "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                                } flex items-center gap-2`}
                            >
                                {isFollowing ? (
                                    <>
                                        <Users size={18} /> 팔로잉
                                    </>
                                ) : (
                                    <>
                                        <Heart size={18} /> 팔로우
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    /* DM 기능 구현 필요 */
                                }}
                                className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-all duration-200 font-medium flex items-center gap-2"
                            >
                                <MessageSquare size={18} /> DM
                            </button>
                        </div>
                    </div>

                    {/* 통계 정보 */}
                    <div className="flex justify-around mt-6">
                        <div className="flex flex-col items-center">
                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                                {userProfile.userInformationDto.postNumber}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">포스트</p>
                        </div>
                        <button
                            onClick={async () => {
                                await fetchFollowers();
                                setIsFollowersModalOpen(true);
                            }}
                            className="flex flex-col items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-1 rounded-xl transition"
                        >
                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                                {userProfile.userInformationDto.followersCount}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">팔로워</p>
                        </button>
                        <button
                            onClick={async () => {
                                await fetchFollowing();
                                setIsFollowingModalOpen(true);
                            }}
                            className="flex flex-col items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-1 rounded-xl transition"
                        >
                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                                {userProfile.userInformationDto.followingCount}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">팔로잉</p>
                        </button>
                    </div>

                    {/* 자기소개 */}
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">자기소개</h3>
                        <p className="text-gray-600 dark:text-gray-300">{userProfile.userInformationDto.introduce}</p>
                    </div>
                </motion.div>

                {/* 게시물 섹션 */}
                <div className="mt-8 space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">게시물</h2>
                    {posts.map((post, index) => (
                        <motion.div
                            key={post.postInfo.postId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <PostCard
                                postInfo={post.postInfo}
                                userInfo={post.userInfo}
                                postActivity={post.postActivity}
                                onLike={() => handleLikePost(post.postInfo.postId)}
                                onScrap={() => handleScrapPost(post.postInfo.postId)}
                                isLiking={isLiking}
                                isScrapping={isScrapping}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* 모달 영역 */}
            <AnimatePresence>
                {isFollowersModalOpen && (
                    <FollowModal
                        isOpen={isFollowersModalOpen}
                        onClose={() => setIsFollowersModalOpen(false)}
                        title="팔로워"
                        users={followers}
                    />
                )}
                {isFollowingModalOpen && (
                    <FollowModal
                        isOpen={isFollowingModalOpen}
                        onClose={() => setIsFollowingModalOpen(false)}
                        title="팔로잉"
                        users={following}
                    />
                )}
            </AnimatePresence>
        </PostContainer>
    );
};

export default OthersProfile;
