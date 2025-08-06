// src/pages/auth/ResetPassword.tsx
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useServices } from "../../context/ServicesProvider";

const ResetPassword: React.FC = () => {
    const { resetPassword } = useServices();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") ?? "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        setLoading(true);
        setMessage("");

        if (!token) {
            setMessage("잘못된 접근입니다. 유효한 링크를 확인하세요.");
            setLoading(false);
            return;
        }
        if (newPassword !== confirmPassword) {
            setMessage("비밀번호가 일치하지 않습니다.");
            setLoading(false);
            return;
        }
        try {
            await resetPassword(token, newPassword);
            setMessage("비밀번호가 변경되었습니다.");
        } catch (error) {
            console.error(error);
            setMessage("오류가 발생했습니다.");
        } finally {
            setLoading(false);
            setTimeout(() => window.close(), 2000);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
                    비밀번호 재설정
                </h2>

                <div className="space-y-6">
                    <input
                        type="password"
                        placeholder="새 비밀번호"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    />

                    <input
                        type="password"
                        placeholder="비밀번호 확인"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    />

                    <button
                        onClick={handleResetPassword}
                        disabled={loading}
                        className={`w-full py-3 font-medium text-white rounded-full transition-colors ${
                            loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600"
                        }`}
                    >
                        {loading ? "처리 중..." : "비밀번호 변경"}
                    </button>
                </div>

                {message && (
                    <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
