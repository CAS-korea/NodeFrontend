export type UserRole = 'STUDENT' | 'GRADUATE' | 'PROFESSOR' | 'CAS_CREATOR';

export interface CommentDetailDto {
    content: CommentContent;
    commentActivity: CommentActivity;
    specificPostCommentAuthor: CommentUserInfo;
}

export interface CommentContent {
    commentId: string;
    comment: string;
    likesCount: number;
}

export interface CommentActivity {
    liked: boolean;
    reported: boolean;
}

export interface CommentUserInfo {
    name: string;
    profileImageUrl: string;
    userId: string;
    role: UserRole;
}