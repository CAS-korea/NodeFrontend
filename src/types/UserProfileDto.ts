import {UserRole} from "./UserEntity.ts";

export enum PostVisibility {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
    FOLLOWERS_ONLY = "FOLLOWERS_ONLY",
}

export interface FollowActivityDto {
    isFollowing: boolean;
}

export interface UserInformationDto {
    profileImageUrl: string;
    name: string;
    userId: string;
    role: UserRole;
    followersCount: number;
    followingCount: number;
    postNumber: number;
    introduce: string;
}

export interface PostCardPostDto {
    postId: string;
    title: string;
    summary: string;
    userTag: string[];
    likesCount: number;
    scrapsCount: number;
    commentsCount: number;
    reportsCount: number;
    createAt: string; // LocalDateTime은 ISO string으로 변환되어 전달됨
    thumbNailImage: string;
}

export interface PostActivityDto {
    liked: boolean;
    reported: boolean;
    scraped: boolean;
}

export interface AuthorInfoDto {
    name: string;
    profileImageUrl: string;
    userId: string;
    role: UserRole;
}

export interface PostCardDto {
    postVisibility: PostVisibility;
    postInfo: PostCardPostDto;
    postActivity: PostActivityDto;
    userInfo: AuthorInfoDto;
}

export interface UserProfileDto {
    followActivityDto: FollowActivityDto;
    userInformationDto: UserInformationDto;
    postCardDtoList: PostCardDto[];
}
