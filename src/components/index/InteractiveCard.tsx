"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight } from "lucide-react";

/**
 * 인터랙티브 카드 컴포넌트
 * - 기본 카드: 호버 시 살짝 커지며, 제목(h3)와 설명(p) 사이에 아이콘이 추가됨.
 * - 클릭 시 모달을 띄워, 모달의 왼쪽 칸에는 이미지 위에 제목이 오버레이되고,
 *   이미지 하단에는 캡션과 닫기 버튼이 배치되며, 오른쪽 칸에는 주요 특징 및 설명이 표시됨.
 */
const InteractiveCard = ({ title, description, image, color }) => {
    const [showModal, setShowModal] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const modalRef = useRef(null);

    // 바깥 영역 클릭 시 모달 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
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

    // 제목에 따른 상세 콘텐츠 구성
    const getDetailedContent = () => {
        switch (title) {
            case "AI 연구 플랫폼":
                return {
                    subtitle: "최첨단 인공지능 연구를 위한 통합 플랫폼",
                    features: [
                        "딥러닝 모델 개발 및 학습 환경",
                        "대규모 데이터셋 처리 및 분석 도구",
                        "연구 결과 공유 및 협업 시스템",
                        "최신 AI 논문 및 연구 트렌드 정보",
                    ],
                    caption: "최첨단 AI 연구 이미지",
                    icon: "🧠",
                };
            case "협업 시스템":
                return {
                    subtitle: "효율적인 팀워크를 위한 지능형 협업 시스템",
                    features: [
                        "실시간 프로젝트 관리 및 진행 상황 공유",
                        "멘토링 및 지식 공유 플랫폼",
                        "팀 빌딩 및 역할 분담 시스템",
                        "코드 리뷰 및 피드백 프로세스",
                    ],
                    caption: "효율적인 협업 시스템 이미지",
                    icon: "🤝",
                };
            case "창의적 워크샵":
                return {
                    subtitle: "혁신적인 아이디어를 발굴하는 창의적 워크샵",
                    features: [
                        "AI 기술 트렌드 및 응용 사례 세미나",
                        "문제 해결 중심의 해커톤 이벤트",
                        "산업 전문가 초청 강연 및 네트워킹",
                        "학제간 융합 연구 워크샵",
                    ],
                    caption: "창의적 워크샵 이미지",
                    icon: "💡",
                };
            case "프로젝트 쇼케이스":
                return {
                    subtitle: "혁신적인 프로젝트를 공유하는 쇼케이스 플랫폼",
                    features: [
                        "정기적인 프로젝트 발표회 및 데모 세션",
                        "온라인 포트폴리오 및 프로젝트 갤러리",
                        "산학협력 프로젝트 전시 기회",
                        "우수 프로젝트 시상 및 지원 프로그램",
                    ],
                    caption: "프로젝트 쇼케이스 이미지",
                    icon: "🏆",
                };
            default:
                return {
                    subtitle: "혁신적인 기술과 아이디어",
                    features: ["혁신적인 기술", "창의적인 아이디어", "효율적인 협업", "지속적인 성장"],
                    caption: "프로젝트 이미지",
                    icon: "✨",
                };
        }
    };

    const detailedContent = getDetailedContent();

    return (
        <>
            {/* 기본 카드 */}
            <motion.div
                className={`relative justify-self-center w-full max-w-md h-64 rounded-xl overflow-hidden cursor-pointer shadow-xl ${color}`}
                onClick={() => setShowModal(true)}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                {/* 카드 배경 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-white/10" />

                {/* 카드 기본 내용 */}
                <div className="p-6 flex flex-col justify-between h-full relative z-10">
                    <div>
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-white">{title}</h3>
                            <span className="text-3xl">{detailedContent.icon}</span>
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

                {/* 호버 효과 */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovering ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                />

                {/* 장식 요소 */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10 blur-xl" />
            </motion.div>

            {/* 모달 */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center z-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ backdropFilter: "blur(8px)" }}
                    >
                        <motion.div
                            ref={modalRef}
                            className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl mx-auto relative overflow-hidden max-w-3xl w-full max-h-[80vh] overflow-y-auto"
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            <div className="flex flex-col md:flex-row">
                                {/* 왼쪽 칸: 이미지 섹션 */}
                                <div className="md:w-2/5 w-full p-6">
                                    <div className="relative rounded-xl overflow-hidden aspect-square shadow-lg">
                                        <img
                                            src={image || "/placeholder.svg"}
                                            alt={title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                        {/* 이미지 상단에 제목 오버레이 */}
                                        <div className="absolute top-4 left-4 text-white text-2xl font-bold">
                                            {title}
                                        </div>
                                    </div>
                                    {/* 사진 캡션 */}
                                    <p className="mt-4 text-center text-gray-400 text-sm">
                                        {detailedContent.caption}
                                    </p>
                                    {/* 닫기 버튼 (왼쪽 칸 하단) */}
                                    <div className="mt-4 flex justify-center">
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                                        >
                                            닫기
                                        </button>
                                    </div>
                                </div>

                                {/* 오른쪽 칸: 콘텐츠 섹션 */}
                                <div className="md:w-3/5 w-full p-6">
                                    <h3 className="text-xl font-semibold text-white mb-4">주요 특징</h3>
                                    <div className="space-y-4 mb-6">
                                        {detailedContent.features.map((feature, index) => (
                                            <motion.div
                                                key={index}
                                                className="flex items-start gap-3 bg-white/5 p-3 rounded-lg"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 + 0.2 }}
                                            >
                                                <div
                                                    className={`${color} w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0`}
                                                >
                                                    {index + 1}
                                                </div>
                                                <p className="text-white/90">{feature}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <p className="text-white/70 mb-6">
                                        {description} NODE 프로젝트는 학생들에게 최고의 학습 경험과 실무 기회를 제공합니다.
                                    </p>
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
