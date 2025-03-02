// src/services/UserService.ts
import { UserInfoDto } from "../types/UserInfoDto";
import { UserProfileDto } from "../types/UserProfileDto";
import { FollowUser } from "../types/FollowUser";
import apiHandler from "../utils/ApiHandler";

export const UserService = {
    // 사용자 정보 가져오기
    async getUserInfo(userId: string): Promise<UserInfoDto> {
        const response = await apiHandler.get(`/user_relation/info/${userId}`);
        return response.data.userInformationDto;
    },

    // 사용자 프로필 가져오기
    async getUserProfile(userId: string): Promise<UserProfileDto> {
        const response = await apiHandler.get(`/user_relation/info/${userId}`);
        return response.data.data;
    },

    // 사용자 팔로우/언팔로우 토글
    async followUser(followingId: string): Promise<string> {
        const response = await apiHandler.post(`/user_relation/follow/${followingId}`);
        return response.data;
    },

    // 특정 사용자의 팔로워 목록 가져오기
    async getFollowers(userId: string): Promise<FollowUser[]> {
        const response = await apiHandler.get(`/user_relation/${userId}/followers`);
        return response.data.data.users;
    },

    // 특정 사용자의 팔로잉 목록 가져오기
    async getFollowing(userId: string): Promise<FollowUser[]> {
        const response = await apiHandler.get(`/user_relation/${userId}/following`);
        return response.data.data.users;
    },

    // src/services/UserService.ts
    async updateUserProfile(updateProfileDto: { name?: string; introduce?: string; profileImageUrl?: string }): Promise<string> {
        const response = await apiHandler.put(`/user_log/updateprofile`, updateProfileDto);
        return response.data;
    }
};
