"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from 'lucide-react';

/**
 * 인터랙티브 카드 컴포넌트
 * - 기본 카드: 호버 시 살짝 커지며, 제목(h3)와 설명(p) 사이에 아이콘이 추가됨.
 * - 클릭 시 모달을 띄워, 모달의 왼쪽 칸에는 이미지 위에 제목이 오버레이되고,
 *   이미지 하단에는 캡션과 닫기 버튼이 배치되며, 오른쪽 칸에는 주요 특징 및 설명이 표시됨.
 */
interface InteractiveCardProps {
    title: string;
    description: string;
    image?: string;
    video?: string;            // ★ 변경: mp4 · webm 등
    poster?: string;           // ★ 변경: video 로딩 전 썸네일
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({ title, description, image, video, poster, }) => {
    const [showModal, setShowModal] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const modalRef = useRef<HTMLDivElement | null>(null);

    // This Effect synchronizes with the browser's DOM event system to handle clicks outside the modal. [^2]
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setShowModal(false);
            }
        };
        if (showModal) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showModal]);

    const getDetailedContent = () => {
        switch (title) {
            case "정보교류회":
                return {
                    subtitle: "AI 연구 지식‧데이터 교류 세션",
                    features: [
                        "최신 논문·트렌드 리뷰",
                        "공개 데이터셋·코드 공유",
                        "네트워킹",
                    ],
                    caption: "AI 정보교류회 영상",
                };

            case "데모":
                return {
                    subtitle: "프로젝트 기능 시연 & 피드백",
                    features: [
                        "실시간 데모 발표",
                        "임원진 코멘트 수렴",
                        "성과 아카이빙",
                    ],
                    caption: "시연 동영상",
                };

            case "프로토타입 제작":
                return {
                    subtitle: "아이디어 구현 워크샵",
                    features: [
                        "디자인 스프린트",
                        "빠른 모델링·테스트",
                        "사용자 경험 검증",
                    ],
                    caption: "NODE 프로토타입 동영상",
                };

            case "해커톤 참여":
                return {
                    subtitle: "문제 해결형 팀 해커톤",
                    features: [
                        "24-48h 집중 밤샘 개발",
                        "잘맞는 팀 구성",
                        "미쳐날뛰는 코딩실력",
                    ],
                    caption: "해커톤 이미지",
                };

            default:
                return {
                    subtitle: "혁신 기술·아이디어 탐구",
                    features: ["기술 탐색", "창의적 발상", "협업 문화"],
                    caption: "프로젝트 이미지",
                };
        }
    };

    const detailedContent = getDetailedContent();

    return (
        <>
            {/* 기본 카드 */}
            <motion.div
                className="glass-container justify-self-center w-full max-w-md h-64 rounded-xl overflow-hidden cursor-pointer shadow-xl"
                onClick={() => setShowModal(true)}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                <div className="glass-wavy-bg" />
                {/* 실제 카드 내용 -- z-10 으로 위에 올려 필터 영향 X */}
                <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                    <div>
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-white">{title}</h3>
                        </div>
                        <div className="w-16 h-1 bg-white/30 rounded-full mt-2" />
                    </div>
                    <p className="text-white/80 mt-2">{description}</p>
                    <motion.div
                        className="flex items-center mt-4 text-white/90"
                        animate={{ x: isHovering ? 5 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <span className="text-sm font-medium">자세히 보기</span>
                        <ChevronRight size={16} className="ml-1" />
                    </motion.div>
                </div>
            </motion.div>

            {/* 모달 */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            backdropFilter: "blur(12px)",
                            background: "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%)"
                        }}
                    >
                        {/* Floating background elements */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <motion.div
                                className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 180, 360],
                                }}
                                transition={{
                                    duration: 20,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            />
                            <motion.div
                                className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
                                animate={{
                                    scale: [1.2, 1, 1.2],
                                    rotate: [360, 180, 0],
                                }}
                                transition={{
                                    duration: 25,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            />
                        </div>

                        <motion.div
                            ref={modalRef}
                            className="relative overflow-hidden max-w-4xl w-full max-h-[85vh] overflow-y-auto"
                            initial={{ scale: 0.8, opacity: 0, y: 50, rotateX: -15 }}
                            animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 50, rotateX: 15 }}
                            transition={{
                                duration: 0.6,
                                ease: [0.16, 1, 0.3, 1],
                                type: "spring",
                                stiffness: 100,
                                damping: 15
                            }}
                            style={{ perspective: "1000px" }}
                        >
                            {/* Glass morphism container */}
                            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
                                {/* Animated border glow */}
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

                                {/* Main content container */}
                                <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-3xl">
                                    {/* Header with close button */}
                                    <div className="absolute top-4 right-4 z-20">
                                        <motion.button
                                            onClick={() => setShowModal(false)}
                                            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300"
                                            whileHover={{ scale: 1.1, rotate: 90 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                <path d="M8 7.293l2.146-2.147a.5.5 0 01.708.708L8.707 8l2.147 2.146a.5.5 0 01-.708.708L8 8.707l-2.146 2.147a.5.5 0 01-.708-.708L7.293 8 5.146 5.854a.5.5 0 01.708-.708L8 7.293z"/>
                                            </svg>
                                        </motion.button>
                                    </div>

                                    <div className="flex flex-col lg:flex-row">
                                        {/* 왼쪽 칸: 이미지 섹션 */}
                                        <div className="lg:w-2/5 w-full p-8">
                                            <motion.div
                                                className="relative rounded-2xl overflow-hidden aspect-square shadow-2xl"
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 0.2, duration: 0.5 }}
                                            >
                                                {/* Floating particles around image */}
                                                <div className="absolute -inset-4 pointer-events-none">
                                                    {[...Array(8)].map((_, i) => (
                                                        <motion.div
                                                            key={i}
                                                            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                                                            style={{
                                                                top: `${Math.random() * 100}%`,
                                                                left: `${Math.random() * 100}%`,
                                                            }}
                                                            animate={{
                                                                y: [0, -20, 0],
                                                                opacity: [0, 1, 0],
                                                                scale: [0, 1, 0],
                                                            }}
                                                            transition={{
                                                                duration: 3 + Math.random() * 2,
                                                                repeat: Infinity,
                                                                delay: Math.random() * 2,
                                                            }}
                                                        />
                                                    ))}
                                                </div>

                                                {/* Image with enhanced effects */}
                                                <div className="relative group">
                                                    {video ? (
                                                        <video
                                                            src={video}
                                                            poster={poster ?? image}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                            autoPlay
                                                            loop
                                                            muted
                                                            playsInline
                                                        />
                                                    ) : (
                                                        <img
                                                            src={
                                                                image ??
                                                                "/placeholder.svg?width=400&height=400&query=abstract"
                                                            }
                                                            alt={title}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                        />
                                                    )}

                                                    {/* Enhanced gradient overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>

                                                    {/* Shimmer effect */}
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                                                </div>
                                            </motion.div>

                                            {/* Caption with enhanced styling */}
                                            <motion.div
                                                className="mt-6 text-center"
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.4, duration: 0.5 }}
                                            >
                                                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20">
                                                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse"></div>
                                                    <p className="text-white text-lg font-semibold">
                                                        {detailedContent.caption}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        </div>

                                        {/* 오른쪽 칸: 콘텐츠 섹션 */}
                                        <div className="lg:w-3/5 w-full p-8 lg:border-l border-white/10">
                                            {/* Title section */}
                                            <motion.div
                                                className="mb-8"
                                                initial={{ x: 30, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.3, duration: 0.5 }}
                                            >
                                                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
                                                    {title}
                                                </h2>
                                                <p className="text-blue-300/80 text-lg">
                                                    {detailedContent.subtitle}
                                                </p>
                                                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-3"></div>
                                            </motion.div>

                                            {/* Features section */}
                                            <motion.div
                                                className="mb-8"
                                                initial={{ x: 30, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.4, duration: 0.5 }}
                                            >
                                                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
                                                            <path d="M6 0l1.5 4.5h4.5l-3.75 2.7 1.5 4.5L6 9l-3.75 2.7 1.5-4.5L0 4.5h4.5L6 0z"/>
                                                        </svg>
                                                    </div>
                                                    주요 특징
                                                </h3>

                                                <div className="space-y-4">
                                                    {detailedContent.features.map((feature, index) => (
                                                        <motion.div
                                                            key={index}
                                                            className="group relative"
                                                            initial={{ opacity: 0, x: -20, scale: 0.8 }}
                                                            animate={{ opacity: 1, x: 0, scale: 1 }}
                                                            transition={{
                                                                delay: index * 0.1 + 0.5,
                                                                duration: 0.5,
                                                                type: "spring",
                                                                stiffness: 100,
                                                                damping: 15
                                                            }}
                                                        >
                                                            {/* Background glow effect */}
                                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl blur-sm group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500"></div>

                                                            <div className="relative flex items-center gap-4 bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 group-hover:transform group-hover:scale-105">
                                                                {/* Enhanced number badge */}
                                                                <div className="relative flex-shrink-0">
                                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                                        {index + 1}
                                                                    </div>
                                                                    {/* Floating ring */}
                                                                    <div className="absolute inset-0 rounded-2xl border-2 border-blue-400/30 animate-pulse"></div>
                                                                </div>

                                                                <div className="flex-1">
                                                                    <p className="text-white/95 font-medium text-lg leading-relaxed">
                                                                        {feature}
                                                                    </p>
                                                                </div>

                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </motion.div>

                                            {/* Description section */}
                                            <motion.div
                                                className="relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/20"
                                                initial={{ y: 30, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.8, duration: 0.5 }}
                                            >
                                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-2xl"></div>
                                                <p className="text-white/80 text-lg leading-relaxed">
                                                    {description}
                                                </p>
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default InteractiveCard;
