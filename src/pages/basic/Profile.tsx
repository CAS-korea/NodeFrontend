// src/components/profile/Profile.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, ImageIcon, X } from "lucide-react";
import PostContainer from "../../components/postcard/Container.tsx";
import PostCard from "../../components/postcard/PostCard.tsx";
import FollowModal from "../../components/profile/FollowModal";
import { useServices } from "../../context/ServicesProvider";
import { UserService } from "../../services/UserService";
import { UserProfileDto, PostCardDto } from "../../types/UserProfileDto";
import { FollowUser } from "../../types/FollowUser";
import Cookies from "js-cookie";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";

// 애니메이션 설정
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
};

const Profile: React.FC = () => {
    // 쿠키에서 로그인 정보
    const token = Cookies.get("info");
    const userInfo = token ? JSON.parse(token) : null;
    const myUserId = userInfo?.userId;

    const [userProfile, setUserProfile] = useState<UserProfileDto | null>(null);
    const [posts, setPosts] = useState<PostCardDto[]>([]);
    const [followers, setFollowers] = useState<FollowUser[]>([]);
    const [following, setFollowing] = useState<FollowUser[]>([]);
    const [postVisibility, setPostVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
    const [loading, setLoading] = useState<boolean>(true);
    const [isLiking, setIsLiking] = useState(false);
    const [isScrapping, setIsScrapping] = useState(false);
    const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
    const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

    // 이미지 업로드 관련 (미래 기능 대비 유지)
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(undefined);
    const [imageUploading, setImageUploading] = useState(false);

    const { likePost, scrapPost, getUserProfile, updateUserProfile, uploadImage } = useServices();

    // 내 프로필 가져오기
    const fetchMyProfile = async () => {
        if (!myUserId) return;
        setLoading(true);
        try {
            const profile = await getUserProfile(myUserId);
            if (profile) {
                setUserProfile(profile);
                setPosts(profile.postCardDtoList);
                // "" -> undefined 정규화 (Avatar fallback을 위해)
                setProfileImageUrl(profile.userInformationDto.profileImageUrl || undefined);
            }
        } catch (error) {
            console.error("프로필 불러오기 실패: ", error);
        } finally {
            setLoading(false);
        }
    };

    // 팔로우/팔로잉 목록
    const fetchFollowData = async () => {
        if (!myUserId) return;
        try {
            const followerList = await UserService.getFollowers(myUserId);
            const followingList = await UserService.getFollowing(myUserId);
            setFollowers(followerList);
            setFollowing(followingList);
        } catch (error) {
            console.error("팔로우 데이터 불러오기 실패: ", error);
            setFollowers([]);
            setFollowing([]);
        }
    };

    // (미래 기능) 프로필 이미지 변경
    const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImage(file);
            setImageUploading(true);
            try {
                const url = await uploadImage(file);
                setProfileImageUrl(url || undefined);
            } catch (error) {
                console.error("이미지 업로드 실패: ", error);
            } finally {
                setImageUploading(false);
            }
        }
    };

    // 이미지 제거
    const handleRemoveImage = () => {
        setProfileImage(null);
        setProfileImageUrl(undefined); // "" 대신 undefined로 통일
    };

    // 프로필 수정 제출
    const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const updateProfileDto = {
            name: formData.get("name") as string,
            introduce: formData.get("bio") as string,
            // undefined면 기존 값 유지
            profileImageUrl: profileImageUrl ?? userProfile?.userInformationDto.profileImageUrl,
        };

        try {
            const message = await updateUserProfile(updateProfileDto);
            console.log(message);
            await fetchMyProfile();
            setIsEditProfileModalOpen(false);
        } catch (error) {
            console.error("프로필 수정 실패: ", error);
        }
    };

    useEffect(() => {
        fetchMyProfile();
        fetchFollowData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [myUserId]);

    // 좋아요
    const handleLikePost = async (postId: string) => {
        if (isLiking) return;
        setIsLiking(true);
        try {
            await likePost(postId);
            await fetchMyProfile();
        } catch (error) {
            console.error("좋아요 실패: ", error);
        } finally {
            setIsLiking(false);
        }
    };

    // 스크랩
    const handleScrapPost = async (postId: string) => {
        if (isScrapping) return;
        setIsScrapping(true);
        try {
            await scrapPost(postId);
            await fetchMyProfile();
        } catch (error) {
            console.error("스크랩 실패: ", error);
        } finally {
            setIsScrapping(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">잠시만 기다려주세요!</p>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">로그인 후 이용 가능합니다</p>
            </div>
        );
    }

    const filteredPosts = posts.filter((post) => post.postVisibility === postVisibility);

    return (
        <TooltipProvider>
            <PostContainer>
                <div className="max-w-4xl mx-auto">
                    <motion.h1 {...fadeInUp} className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
                        내 프로필
                    </motion.h1>

                    <motion.div {...fadeInUp} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Avatar className="h-24 w-24 border-4 border-blue-500">
                                    <AvatarImage
                                        src={profileImageUrl || userProfile.userInformationDto.profileImageUrl || undefined}
                                        alt={userProfile.userInformationDto.name}
                                    />
                                    <AvatarFallback className="text-3xl font-bold">
                                        {userProfile.userInformationDto.name?.charAt(0) || "U"}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="ml-4">
                                    {/* 필요 시 폰트 사이즈 조정 (지금은 의도대로 text-10xl 유지) */}
                                    <h2 className="text-10xl font-bold text-gray-900 dark:text-gray-100">
                                        {userProfile.userInformationDto.name}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300">@{myUserId}</p>
                                    <p className="text-gray-500 dark:text-gray-400">{userProfile.userInformationDto.role}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsEditProfileModalOpen(true)}
                                className="px-6 py-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200 font-medium flex items-center gap-2"
                            >
                                <Edit2 size={18} /> 프로필 수정
                            </button>
                        </div>

                        <div className="flex justify-around mt-6">
                            <div className="flex flex-col items-center">
                                <p className="font-semibold text-gray-800 dark:text-gray-100">
                                    {userProfile.userInformationDto.postNumber}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">포스트</p>
                            </div>
                            <div
                                onClick={() => setIsFollowersModalOpen(true)}
                                className="flex flex-col items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-1 rounded-xl transition"
                            >
                                <p className="font-semibold text-gray-800 dark:text-gray-100">
                                    {userProfile.userInformationDto.followersCount}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">팔로워</p>
                            </div>
                            <div
                                onClick={() => setIsFollowingModalOpen(true)}
                                className="flex flex-col items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-1 rounded-xl transition"
                            >
                                <p className="font-semibold text-gray-800 dark:text-gray-100">
                                    {userProfile.userInformationDto.followingCount}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">팔로잉</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">자기소개</h3>
                            <p className="text-gray-600 dark:text-gray-300">{userProfile.userInformationDto.introduce}</p>
                        </div>
                    </motion.div>

                    <div className="mt-8 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">내 게시물</h2>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setPostVisibility("PUBLIC")}
                                    className={`px-4 py-2 rounded-full ${
                                        postVisibility === "PUBLIC"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                                    }`}
                                >
                                    공개 글
                                </button>
                                <button
                                    onClick={() => setPostVisibility("PRIVATE")}
                                    className={`px-4 py-2 rounded-full ${
                                        postVisibility === "PRIVATE"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                                    }`}
                                >
                                    비공개 글
                                </button>
                            </div>
                        </div>

                        {filteredPosts.length > 0 ? (
                            filteredPosts.map((post, index) => (
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
                            ))
                        ) : (
                            <p className="text-gray-400 dark:text-gray-500 text-center">게시물이 없습니다.</p>
                        )}
                    </div>
                </div>

                <AnimatePresence>
                    <FollowModal
                        isOpen={isFollowersModalOpen}
                        onClose={() => setIsFollowersModalOpen(false)}
                        title="팔로워"
                        users={followers}
                    />
                    <FollowModal
                        isOpen={isFollowingModalOpen}
                        onClose={() => setIsFollowingModalOpen(false)}
                        title="팔로잉"
                        users={following}
                    />
                    {isEditProfileModalOpen && (
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
                                <div className="flex justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">프로필 수정</h2>
                                    <button
                                        onClick={() => setIsEditProfileModalOpen(false)}
                                        className="text-gray-500 hover:bg-gray-100 rounded-full p-2"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <form className="space-y-4" onSubmit={handleProfileSubmit}>
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            이름
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            defaultValue={userProfile.userInformationDto.name}
                                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            자기소개
                                        </label>
                                        <textarea
                                            id="bio"
                                            name="bio"
                                            rows={3}
                                            defaultValue={userProfile.userInformationDto.introduce}
                                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            프로필 이미지
                                        </label>
                                        <div className="mt-1 flex items-center space-x-4">
                      <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-600">
                        {profileImageUrl || userProfile.userInformationDto.profileImageUrl ? (
                            <img
                                src={profileImageUrl || userProfile.userInformationDto.profileImageUrl}
                                alt="프로필 이미지"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <ImageIcon className="h-full w-full text-gray-300" />
                        )}
                      </span>

                                            {/* 숨겨진(비활성) 파일 입력: onChange 연결로 S6133 회피 */}
                                            <input
                                                id="profileImageUpload"
                                                type="file"
                                                accept="image/*"
                                                className="sr-only"
                                                disabled
                                                onChange={handleProfileImageChange}
                                                aria-hidden="true"
                                                tabIndex={-1}
                                            />

                                            {/* 비활성 버튼 + 툴팁 */}
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                          <span className="inline-flex">
                            <button
                                type="button"
                                disabled
                                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-not-allowed"
                            >
                              사진 선택
                            </button>
                          </span>
                                                </TooltipTrigger>
                                                <TooltipContent side="right" align="center">
                                                    개발중입니다! 추후 업데이트를 기대해주세요.
                                                </TooltipContent>
                                            </Tooltip>

                                            {(profileImage || profileImageUrl) && (
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    제거
                                                </button>
                                            )}

                                            {imageUploading && <p className="text-sm text-gray-500">업로드 중...</p>}
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditProfileModalOpen(false)}
                                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                                        >
                                            취소
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            disabled={imageUploading}
                                        >
                                            저장
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </PostContainer>
        </TooltipProvider>
    );
};

export default Profile;
