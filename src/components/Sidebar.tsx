"use client"

import type React from "react"
import { Link, useLocation } from "react-router-dom"
import { ClientUrl } from "../constants/ClientUrl"
import { motion } from "framer-motion"
import { useServices } from "../context/ServicesProvider"
import {
    Home,
    Search,
    PlusCircle,
    MessageCircle,
    User,
    Bell,
    Settings,
    LogOut,
} from "lucide-react"
import Cookies from "js-cookie"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../components/ui/tooltip"

interface UserInfo {
    name: string
    email: string
    phoneNumber: string
    role: string
}

const Sidebar: React.FC = () => {
    const { logout } = useServices()
    const location = useLocation()
    const token = Cookies.get("info")
    const userInfo: UserInfo | null = token ? JSON.parse(token) : null

    const navItems: {
        path: string
        icon: React.ReactNode
        disabled?: boolean
    }[] = [
        { path: ClientUrl.HOME, icon: <Home size={24} /> },
        { path: ClientUrl.SEARCH, icon: <Search size={24} /> },
        { path: ClientUrl.NEWPOST, icon: <PlusCircle size={24} /> },
        // disabled items
        { path: ClientUrl.MESSAGE, icon: <MessageCircle size={24} opacity={0.2}/>, disabled: true },
        { path: ClientUrl.PROFILE, icon: <User size={24} /> },
        { path: ClientUrl.NOTIFICATION, icon: <Bell size={24} opacity={0.2}/>, disabled: true },
        { path: ClientUrl.SETTINGS, icon: <Settings size={24} /> },
    ]

    const itemBaseClasses =
        "relative p-3 rounded-xl transition-all duration-200"
    const itemActiveClasses =
        "bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE] dark:from-blue-400/20 dark:to-blue-300/20 text-gray-900 dark:text-gray-100"
    const itemIdleClasses =
        "text-[#2C323A] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"

    return (
        <TooltipProvider>
            <motion.aside
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="fixed w-20 h-screen bg-transparent dark:bg-transparent"
            >
                <div className="h-full flex flex-col items-center pt-10 pl-7">
                    <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1.2 }}
                        className="mb-8 text-center"
                    >
                        <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                            {userInfo?.name}
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{userInfo?.role}</p>
                    </motion.div>

                    <nav className="flex flex-col items-center gap-y-4 flex-1 space-y-1 overflow-y-auto">
                        {navItems.map(({ path, icon, disabled }, index) => {
                            const active = location.pathname === path
                            const classes = [
                                itemBaseClasses,
                                active ? itemActiveClasses : itemIdleClasses,
                                disabled ? "cursor-not-allowed opacity-60 hover:bg-transparent" : "",
                            ].join(" ")

                            const content = (
                                <motion.div
                                    whileHover={disabled ? undefined : { scale: 1.1 }}
                                    whileTap={disabled ? undefined : { scale: 0.95 }}
                                    initial={{ x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.2, delay: index * 0.08, bounce: 0.3 }}
                                    className={classes}
                                    aria-disabled={disabled || undefined}
                                >
                                    <span className="relative z-10">{icon}</span>
                                </motion.div>
                            )

                            if (disabled) {
                                // Render as a true non-interactive control with tooltip
                                return (
                                    <Tooltip key={path}>
                                        <TooltipTrigger asChild>
                                            <button
                                                type="button"
                                                disabled
                                                tabIndex={-1}
                                                className="outline-none"
                                                // block pointer events to ensure no accidental clicks
                                                style={{ pointerEvents: "auto" }}
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                {content}
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" align="center">
                                            개발중입니다! 추후 업데이트를 기대해주세요.
                                        </TooltipContent>
                                    </Tooltip>
                                )
                            }

                            // Normal navigable item
                            return (
                                <Link key={path} to={path}>
                                    {content}
                                </Link>
                            )
                        })}
                    </nav>

                    <motion.button
                        onClick={logout}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="mb-24 p-3 rounded-xl bg-gradient-to-r from-red-500/80 to-red-600/80 hover:from-red-600/80 hover:to-red-700/80 text-white transition-all duration-200"
                    >
                        <LogOut size={24} />
                    </motion.button>
                </div>
            </motion.aside>
        </TooltipProvider>
    )
}

export default Sidebar
