// src/layouts/BasicLayout.tsx
"use client";

import React, { ReactNode } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import Cookies from "js-cookie";
import AdminSidebar from "../components/AdminSidebar";
import Sidebar from "../components/Sidebar";
import Header from "../components/HeaderMain";
import { ClientUrl } from "../constants/ClientUrl";
import { useServices } from "../context/ServicesProvider";

// shadcn/ui + icons (hamburger + bottom nav)
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";
import { Button } from "../components/ui/button";
import { Menu, Bell, Settings, Monitor, LogOut, Home, Search, PlusCircle, MessageCircle, User } from "lucide-react";

interface BasicLayoutProps { children?: ReactNode }
interface UserInfo { name: string; email: string; phoneNumber: string; role: string }

// matches your HeaderMain visual height
const HEADER_H = 55;
const BOTTOM_NAV_H = 60;

const BasicLayout: React.FC<BasicLayoutProps> = ({ children }) => {
    const location = useLocation();
    const { logout } = useServices();

    // cookie -> role
    let userInfo: UserInfo | null = null;
    const token = Cookies.get("info");
    if (token) {
        try { userInfo = JSON.parse(token) } catch {}
    }
    const isAdmin = userInfo?.role === "CAS_CREATOR";

    // helpers
    const isActive = (to: string) => (to === "/" ? location.pathname === "/" : location.pathname.startsWith(to));

    // Mobile bottom tabs (keep to 5 for ergonomics)
    const tabs = [
        { to: ClientUrl.HOME, label: "홈", icon: Home },
        { to: ClientUrl.SEARCH, label: "검색", icon: Search },
        { to: ClientUrl.NEWPOST, label: "작성", icon: PlusCircle },
        { to: ClientUrl.MESSAGE, label: "메시지", icon: MessageCircle },
        { to: ClientUrl.PROFILE, label: "프로필", icon: User },
    ];

    // Sheet menu items (routes not in bottom nav; admin conditional)
    const sheetLinks = [
        ...(isAdmin ? [{ to: ClientUrl.ADMIN, label: "관리", icon: Monitor }] as const : []),
        { to: ClientUrl.NOTIFICATION, label: "알림", icon: Bell },
        { to: ClientUrl.SETTINGS, label: "설정", icon: Settings },
    ];

    return (
        <div className="min-h-dvh min-w-0 bg-white dark:bg-gray-900 dark:text-gray-200 overflow-x-hidden">
            {/* Fixed header */}
            <Header />

            {/* Desktop / large screens — keep your layout as-is, but prevent sideways scroll */}
            <div className="hidden md:flex" style={{ paddingTop: HEADER_H }}>
                <div className="w-48 xl:w-56 flex-shrink-0">
                    {isAdmin ? <AdminSidebar /> : <Sidebar />}
                </div>
                <div className="flex-1 min-w-0">
                    <main className="p-2 lg:p-4 bg-white dark:bg-transparent flex justify-center overflow-x-hidden">
                        {/* constrain inner width so big children don't overflow */}
                        <div className="w-full max-w-[1200px] min-w-0">{children || <Outlet />}</div>
                    </main>
                </div>
            </div>

            {/* Mobile — your layout + hamburger + bottom nav */}
            <div className="md:hidden relative" style={{ paddingTop: HEADER_H }}>
                {/* Top-right hamburger over the fixed Header */}
                <div className="fixed top-0 right-0 h-[55px] z-[50] flex items-center pr-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="메뉴 열기">
                                <Menu className="size-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[45vw] max-w-sm p-0 bg-white dark:bg-gray-900 border dark:text-white border-gray-200 dark:border-gray-800 rounded-lg shadow-lg overflow-hidden">
                            <SheetHeader className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                                <SheetTitle>메뉴</SheetTitle>
                            </SheetHeader>
                            <nav className="p-2">
                                <ul className="flex flex-col gap-1">
                                    {sheetLinks.map(({ to, label, icon: Icon }) => (
                                        <li key={to as string}>
                                            <Link
                                                to={to as string}
                                                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
                                            >
                                                <Icon className="size-5" />
                                                <span>{label}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                <div className="px-2 pt-3">
                                    <Button onClick={logout} className="w-full flex items-center gap-2 bg-red-500 text-white z-10" variant="destructive">
                                        <LogOut className="size-4 text-white" /> 로그아웃
                                    </Button>
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Content area: constrain width & avoid sideways scroll, so cards/profile shrink nicely */}
                <main className="min-h-[calc(100dvh-55px-60px)] px-3 pt-2 pb-[72px] overflow-x-hidden">
                    <div className="mx-auto w-full max-w-screen-sm min-w-0 space-y-4">
                        {children || <Outlet />}
                    </div>
                </main>

                {/* Bottom Nav */}
                <nav
                    className="fixed bottom-0 inset-x-0 z-40 border-t border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur"
                    style={{ height: BOTTOM_NAV_H }}
                >
                    <ul className="grid grid-cols-5 h-full">
                        {tabs.map(({ to, label, icon: Icon }) => {
                            const active = isActive(to);
                            return (
                                <li key={to as string} className="h-full">
                                    <Link
                                        to={to as string}
                                        className={`h-full flex flex-col items-center justify-center text-xs gap-1 ${
                                            active
                                                ? "text-blue-600 dark:text-blue-400"
                                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                        }`}
                                        aria-current={active ? "page" : undefined}
                                    >
                                        <Icon className="size-5" />
                                        <span>{label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default BasicLayout;
