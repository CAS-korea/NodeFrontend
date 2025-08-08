import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Outlet } from "react-router-dom"

// lucide-react 아이콘 예시
import { ChevronRight, Users, BookOpen, Share2 } from "lucide-react"

const AuthLayout: React.FC = () => {
    // quotes 인덱스
    const [currentQuote, setCurrentQuote] = useState(0)
    const [paneEntered, setPaneEntered] = useState(false);
    // Node 커뮤니티 관련 문구들
    const quotes = [
        "학술적 교류로 지식을 넓히는 Noders",
        "함께 배우고 성장하는 혁신의 장",
        "새로운 영감을 발견하는 창의적 아이디어 플랫폼",
        "노더들과 함께 나누는 끊임없는 소통과 협업",
    ]

    // 특징(Features): 아이콘, 제목, 설명
    const features = [
        {
            icon: <Users className="w-6 h-6 text-black mr-3" />,
            title: "Connect & Collaborate",
            desc: "다양한 분야의 Noders와 함께 성장하고 지식을 공유해보세요.",
        },
        {
            icon: <BookOpen className="w-6 h-6 text-black mr-3" />,
            title: "Academic Exchange",
            desc: "학술 교류를 통해 폭넓은 인사이트와 정보를 얻을 수 있습니다.",
        },
        {
            icon: <Share2 className="w-6 h-6 text-black mr-3" />,
            title: "Inspire & Innovate",
            desc: "창의적인 아이디어를 나누고, 새로운 프로젝트에 도전하세요.",
        },
    ]

    // 5초마다 다음 quote로 넘어가는 타이머
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuote((prev) => (prev + 1) % quotes.length)
        }, 7000)
        return () => clearInterval(interval)
    }, [quotes.length])

    return (
        <div className="h-screen flex items-center justify-center p-4 overflow-hidden">
            <motion.div
                className="absolute w-full flex rounded-3xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* 왼쪽 영역 (lg 이상에서만 표시) */}
                <motion.div
                    className="hidden lg:flex flex-1 flex-col items-center justify-center p-10 text-center relative overflow-hidden"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 2.0, delay: 0.5 }}
                >
                    {/* 배경 그라디언트 (quotes 변경에 따라 변함) */}
                    <motion.div
                        className="absolute inset-0 z-0"
                        animate={{
                            background: [
                                "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
                                "linear-gradient(120deg, #ff9a9e 0%, #fad0c4 100%)",
                                "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
                                "linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)",
                            ][currentQuote],
                        }}
                        transition={{ duration: 3, ease: "easeInOut" }}
                    />

                    {/* 메인 헤딩 & quote 영역 */}
                    <div className="relative z-10">
                        <motion.h1
                            className="text-4xl font-bold text-black mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                        >
                            Welcome To NODE!
                        </motion.h1>
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={currentQuote}
                                className="text-xl text-black/90 mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 2 }}
                            >
                                {quotes[currentQuote]}
                            </motion.p>
                        </AnimatePresence>
                    </div>

                    {/* Node 주요 특징 (아이콘 + 텍스트) */}
                    <div className="relative z-10 space-y-4 mb-6">
                        {features.map((item, idx) => (
                            <motion.div
                                key={idx}
                                className="flex items-center justify-center bg-white rounded-xl p-4 text-left bg-opacity-35 shadow-lg group hover:bg-opacity-70 transition-colors"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.5, delay: 0.5 + idx * 0.2 }}
                                whileHover={{ scale: 1.03 }}
                            >
                                {item.icon}
                                <div>
                                    <h4 className="text-black text-lg font-semibold">
                                        {item.title}
                                    </h4>
                                    <p className="text-black/80 text-sm">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* 간단한 액션 버튼 */}
                    <motion.button
                        className="px-6 py-2 bg-white text-gray-800 rounded-full flex items-center group hover:bg-gray-100 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Explore Node
                        <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </motion.div>

                {/* 오른쪽 영역: Outlet으로 자식 페이지(로그인/회원가입 등) 표시 */}
                <motion.div
                    className="flex-1 p-8 sm:p-10 relative z-10 bg-white"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    onAnimationComplete={() => setPaneEntered(true)}
                    style={paneEntered ? { transform: 'none' } : undefined}
                >
                    <Outlet />
                </motion.div>
            </motion.div>
        </div>
    )
}

export default AuthLayout
