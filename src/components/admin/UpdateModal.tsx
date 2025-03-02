"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { UserEntity } from "../../types/UserEntity";

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
};

interface UpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserEntity;
    onSave: (updatedUser: UserEntity) => void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({ isOpen, onClose, user, onSave }) => {
    const [editedUser, setEditedUser] = useState<UserEntity>(user);

    useEffect(() => {
        setEditedUser(user);
    }, [user]);

    if (!isOpen) return null;

    return (
        <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6">
                {/* 모달 헤더 */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">사용자 정보 수정</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>
                {/* 수정 폼 */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">이름</label>
                        <input
                            type="text"
                            value={editedUser.name}
                            onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">전화번호</label>
                        <input
                            type="tel"
                            value={editedUser.phoneNumber || ""}
                            onChange={(e) => setEditedUser({ ...editedUser, phoneNumber: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">학번</label>
                        <input
                            type="text"
                            value={editedUser.studentNumber || ""}
                            onChange={(e) => setEditedUser({ ...editedUser, studentNumber: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">이메일</label>
                        <input
                            type="email"
                            value={editedUser.email || ""}
                            onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                        />
                    </div>
                </div>
                {/* 모달 액션 버튼 */}
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        onClick={() => onSave(editedUser)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        저장
                    </button>
                    <button onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">
                        취소
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default UpdateModal;
