import {UserRole} from "./UserEntity.ts";

export interface cardPostInfo {
    postId: string;
    title: string;
    summary: string;
    userTag: string[];
    likesCount: number;
    scrapsCount: number;
    commentsCount: number;
    createAt: string; // Date 대신 string으로 변경
    thumbNailImage?: string;
}

export interface cardUserInfo {
    name: string;
    profileImageUrl: string;
    userId: string;
    role: UserRole;
}

export interface cardActivityInfo {
    liked: boolean;
    reported: boolean;
    scraped: boolean;
}