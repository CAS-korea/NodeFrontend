"use client";

import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    Moon,
    Sun,
    Bell,
} from "lucide-react";
import Header from "../components/HeaderMain";
import AdminSidebar from "../components/AdminSidebar";
import CheerOverlay from "../components/secretfile/CheerOverlay";

// 알림 데이터 타입
interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
}

const AdminLayout: React.FC = ({ children }) => {
    const location = useLocation();
    const shouldReduceMotion = useReducedMotion();

    // 사이드바 접힘 상태 (true이면 최소화)
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    // 다크모드 상태 (문서 클래스 기반)
    const [isDark, setIsDark] = useState(false);
    // 알림 데이터 (임시 데이터; 실제 API 연동 시 변경)
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: "1",
            title: "새로운 신고",
            message: "게시물이 신고되었습니다.",
            time: "방금 전",
            read: false,
        },
        {
            id: "2",
            title: "시스템 알림",
            message: "서버 점검이 예정되어 있습니다.",
            time: "1시간 전",
            read: false,
        },
    ]);
    const [showNotifications, setShowNotifications] = useState(false);

    // 다크모드 토글 함수 (document.documentElement의 클래스 토글)
    const toggleDarkMode = () => {
        document.documentElement.classList.toggle("dark");
        setIsDark(!isDark);
    };

    // 알림을 읽음 처리하는 함수
    const markNotificationAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((notif) =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    };

    // 읽지 않은 알림 개수 계산
    const unreadCount = notifications.filter((n) => !n.read).length;

    // 메인 콘텐츠 영역의 왼쪽 마진 조정 (사이드바 상태에 따라)
    const mainContentVariants = {
        expanded: { marginLeft: "16rem", transition: { duration: 0.3 } },
        collapsed: { marginLeft: "4rem", transition: { duration: 0.3 } },
    };

    // 문서의 다크모드 상태를 감시하는 MutationObserver
    useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains("dark");
        setIsDark(isDarkMode);

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === "class") {
                    setIsDark(document.documentElement.classList.contains("dark"));
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* 배경 그라데이션 효과 */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

            <div className="relative flex min-h-screen">
                {/* 사이드바 영역 */}
                <motion.div
                    className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg z-20 transition-all ${
                        isSidebarCollapsed ? "w-16" : "w-64"
                    }`}
                    animate={{ width: isSidebarCollapsed ? 64 : 256 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        {/* 사이드바 제목 (접힘 상태에 따라 표시) */}
                        <motion.div
                            initial={false}
                            animate={{ opacity: isSidebarCollapsed ? 0 : 1 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center space-x-3"
                        >
                            {!isSidebarCollapsed && (
                                <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Admin Panel
                </span>
                            )}
                        </motion.div>
                        {/* 사이드바 접힘/펼침 토글 버튼 */}
                        <button
                            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            {isSidebarCollapsed ? (
                                <ChevronRight className="w-5 h-5 text-gray-500" />
                            ) : (
                                <ChevronLeft className="w-5 h-5 text-gray-500" />
                            )}
                        </button>
                    </div>
                    <AdminSidebar />
                </motion.div>

                {/* 메인 콘텐츠 영역 */}
                <motion.div
                    className="flex-1"
                    variants={mainContentVariants}
                    animate={isSidebarCollapsed ? "collapsed" : "expanded"}
                    initial={false}
                >
                    {/* 상단 네비게이션 바 */}
                    <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center justify-between px-6 py-4">
                            <Header />
                            <div className="flex items-center space-x-4">
                                {/* 알림 버튼 */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                                    >
                                        <Bell className="w-5 h-5 text-gray-500" />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                                        )}
                                    </button>
                                    <AnimatePresence>
                                        {showNotifications && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                                            >
                                                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                                        알림
                                                    </h3>
                                                </div>
                                                <div className="max-h-96 overflow-y-auto">
                                                    {notifications.map((notif) => (
                                                        <motion.div
                                                            key={notif.id}
                                                            layoutId={notif.id}
                                                            onClick={() => markNotificationAsRead(notif.id)}
                                                            className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                                                !notif.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
                                                            }`}
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                                        {notif.title}
                                                                    </h4>
                                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                        {notif.message}
                                                                    </p>
                                                                </div>
                                                                <span className="text-xs text-gray-400">
                                  {notif.time}
                                </span>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                {/* 다크모드 토글 버튼 */}
                                <button
                                    onClick={toggleDarkMode}
                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={isDark ? "dark" : "light"}
                                            initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
                                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                            exit={{ scale: 0.5, opacity: 0, rotate: 180 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {isDark ? (
                                                <Moon className="w-5 h-5 text-gray-500" />
                                            ) : (
                                                <Sun className="w-5 h-5 text-gray-500" />
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 페이지 콘텐츠 영역 */}
                    <main className="p-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, ...(shouldReduceMotion ? {} : { x: 20 }) }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, ...(shouldReduceMotion ? {} : { x: -20 }) }}
                                transition={{ duration: 0.3 }}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                            >
                                <div className="p-6">{children || <Outlet />}</div>
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </motion.div>
            </div>
            <CheerOverlay />
        </div>
    );
};

export default AdminLayout;
