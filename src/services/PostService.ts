import {NewPostDto} from "../types/NewPostDto.ts";
import apiHandler from "../utils/ApiHandler.ts";
import {PostEntity} from "../types/PostEntity.ts";
import {cardActivityInfo, cardPostInfo, cardUserInfo} from "../types/PostcardDto.ts";
import {postActivity, postInfo, userInfo} from "../types/PostDetailDto.ts";
import {CommentDetailDto} from "../types/CommentDetailDto.ts";
import {PostCardDto} from "../types/UserProfileDto.ts";

export const PostService = {
    async createPost(newPostDto: NewPostDto) {
        await apiHandler.post('/post_relation/create', newPostDto);
    },

    async getAllPosts(): Promise<{ postInfo: cardPostInfo, userInfo: cardUserInfo, postActivity: cardActivityInfo }> {
        const response = await apiHandler.get('/post_log/allposts');
        return response.data; // { postInfo: ..., userInfo: ... } 형태
    },

    async getUserPosts(userId: string): Promise<PostEntity[]> {
        const response = await apiHandler.get(`/post_log/${userId}`);
        return response.data;
    },

    async getPostById(postId: string): Promise<{
        post: postInfo,
        postActivity: postActivity,
        author: userInfo,
        comment: CommentDetailDto[]
    }> {
        const response = await apiHandler.get(`/post_log/${postId}`);
        return response.data.data; // { post: ..., comments: [...] } 형태
    },

    async likePost(postId: string) {
        await apiHandler.post(`/post_relation/likes/${postId}`, {});
    },

    async scrapPost(postId: string) {
        await apiHandler.post(`/post_relation/scraps/${postId}`, {});
    },

    async reportPost(postId: string) {
        await apiHandler.post(`/post_relation/reports/${postId}`, {});
    },

    async searchPosts(keywords: string): Promise<PostCardDto[]> {
        const response = await apiHandler.get(`/post_log/search/${keywords}`);
        return response.data; // Flux<PostCardDto>는 배열로 처리됨
    },
};
