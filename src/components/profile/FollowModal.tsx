"use client";

import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { FollowUser } from "../../types/FollowUser"; // FollowUser 타입 가져오기
import { Link } from "react-router-dom"; // react-router-dom에서 Link 가져오기
import { ClientUrl } from "../../constants/ClientUrl"; // URL 상수 가져오기

// 모달 애니메이션 설정: 등장 및 사라짐 효과
const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
};

// 모달 props 타입 정의
interface FollowModalProps {
    isOpen: boolean;           // 모달 열림/닫힘 상태
    onClose: () => void;       // 모달 닫기 함수
    title: string;             // 모달 제목 (예: "팔로워", "팔로잉")
    users: FollowUser[];       // 사용자 목록
}

const FollowModal: React.FC<FollowModalProps> = ({ isOpen, onClose, title, users }) => {
    if (!isOpen) return null; // 모달이 열리지 않았으면 null 반환

    // 사용자 클릭 시 이동하면서 모달 닫기
    const handleUserClick = () => {
        onClose(); // 모달 닫기
    };

    return (
        <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
                {/* 모달 헤더 */}
                <div className="flex justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:bg-gray-100 rounded-full p-2">
                        <X size={20} />
                    </button>
                </div>
                {/* 사용자 목록 */}
                <ul className="space-y-4">
                    {users.map((user) => (
                        <motion.li
                            key={user.userId} // userId를 키로 사용
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex items-center space-x-3"
                        >
                            {/* 클릭 시 OthersProfile로 이동하고 모달 닫기 */}
                            <Link
                                to={`${ClientUrl.OTHERSPROFILE}/${user.userId}`}
                                onClick={handleUserClick} // 클릭 시 모달 닫기 호출
                                className="flex items-center space-x-3 w-full hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition"
                            >
                                {/* 프로필 이미지 */}
                                <img
                                    src={user.profileImageUrl || "/placeholder.svg"}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                {/* 사용자 정보 */}
                                <div>
                                    <span className="text-gray-800 dark:text-gray-100">{user.name}</span>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.role}</p>
                                </div>
                            </Link>
                        </motion.li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
};

export default FollowModal;
