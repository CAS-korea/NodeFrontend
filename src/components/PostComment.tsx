import type React from "react";
import {motion} from "framer-motion";
import {Heart, Flag} from "lucide-react";
import {CommentActivity, CommentContent, CommentUserInfo} from "../types/CommentDetailDto.ts";
import {ClientUrl} from "../constants/ClientUrl.ts";
import {Link} from "react-router-dom";

interface PostCommentProps {
    commentContent: CommentContent;
    commentActivity: CommentActivity;
    commentUserInfo: CommentUserInfo;
    onLikeComment: () => void;
    onReportComment: () => void;
}

const PostComment: React.FC<PostCommentProps> = ({
                                                     commentContent,
                                                     commentActivity,
                                                     commentUserInfo,
                                                     onLikeComment,
                                                     onReportComment
                                                 }) => {
    return (
        <motion.div
            className="flex items-start space-x-4 p-4 border-b border-gray-200 dark:border-gray-700"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.3}}
        >
            {/* 프로필 이미지 */}
            <img
                src={commentUserInfo.profileImageUrl || "/placeholder-avatar.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600"
            />

            {/* 댓글 내용 */}
            <div className="flex-grow">
                <div className="flex items-center justify-between">
                    <div>
                        {/* 작성자 정보 */}
                        <Link to={`${ClientUrl.OTHERSPROFILE}/${commentUserInfo.userId}`}
                              className="text-sm font-medium text-black dark:text-white hover:underline">
                            {commentUserInfo.userId} ({commentUserInfo.name})
                        </Link>
                        <span className="ml-2 text-xs text-gray-500">{commentUserInfo.role}</span>
                    </div>
                    {/* 작성 일자 */}
                    <span className="text-xs text-gray-400">
                        {new Date().toLocaleDateString()}
                    </span>
                </div>
                {/* 댓글 본문 */}
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{commentContent.comment}</p>

                {/* 좋아요 & 신고 */}
                <div className="mt-2 flex items-center justify-between">
                    <button onClick={onLikeComment}
                            className={`flex items-center space-x-1 text-xs ${commentActivity.liked ? "text-red-500" : "text-gray-500 hover:text-gray-700"}`}>
                        <Heart
                            className={`h-4 w-4 ${commentActivity.liked ? "fill-current text-red-500" : "stroke-current"}`}/>
                        <span>좋아요</span>
                        <span className="ml-1">({commentContent.likesCount})</span>
                    </button>
                    <button onClick={onReportComment}
                            className={`flex items-center space-x-1 text-xs ${commentActivity.reported ? "text-red-500" : "text-gray-500 hover:text-gray-700"}`}>
                        <Flag
                            className={`h-4 w-4 ${commentActivity.reported ? "fill-current text-red-500" : "stroke-current"}`}/>
                        <span>신고</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default PostComment
