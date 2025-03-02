"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { useInView } from "react-intersection-observer";

// 공통 컴포넌트 임포트
import Header from "../components/index/Header";
import Footer from "../components/index/Footer";
import InteractiveCard from "../components/index/InteractiveCard";
import ZoomImage from "../components/index/ZoomImage";
import RotatingGallery from "../components/index/RotatingGallery";
import ScrollProgress from "../components/index/ScrollProgress";

const ModernIndex = () => {
    // 섹션 인뷰 훅 (스크롤에 따른 애니메이션 제어)
    const { ref: heroRef, inView: heroInView } = useInView({ threshold: 0.3 });
    const { ref: aboutRef, inView: aboutInView } = useInView({ threshold: 0.3 });
    const { ref: featuresRef, inView: featuresInView } = useInView({ threshold: 0.3 });
    const { ref: galleryRef, inView: galleryInView } = useInView({ threshold: 0.3 });
    const { ref: teamRef, inView: teamInView } = useInView({ threshold: 0.3 });
    const { ref: contactRef, inView: contactInView } = useInView({ threshold: 0.3 });

    // 스크롤 감지 (추가 애니메이션에 활용 가능)
    const containerRef = useRef(null);
    useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // 프로페셔널한 느낌의 고정 배경 그라데이션
    const backgroundStyle = {
        background: "linear-gradient(135deg, #000000, #121227)",
    };

    // 공통 애니메이션 variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.3 },
        },
    };

    // 갤러리 이미지 데이터
    const galleryImages = [
        { src: "/kimafganta.png?height=400&width=400", alt: "AI Research", caption: "인공지능 연구 프로젝트" },
        { src: "/kimafganta.png?height=400&width=400", alt: "Team Collaboration", caption: "팀 협업 세션" },
        { src: "/kimafganta.png?height=400&width=400", alt: "Workshop", caption: "AI 워크샵" },
        { src: "/kimafganta.png?height=400&width=400", alt: "Seminar", caption: "세미나 발표" },
        { src: "/kimafganta.png?height=400&width=400", alt: "Project Demo", caption: "프로젝트 데모" },
    ];

    return (
        <motion.div ref={containerRef} className="relative min-h-screen overflow-x-hidden" style={backgroundStyle}>
            {/* 미니멀한 배경 효과 */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-radial from-blue-900/10 to-transparent opacity-30" />
            </div>

            <ScrollProgress />

            <Header />

            <main className="relative z-10">
                {/* 히어로 섹션 */}
                <section ref={heroRef} className="min-h-screen flex flex-col justify-center items-center px-4 py-20">
                    <motion.div
                        initial="hidden"
                        animate={heroInView ? "visible" : "hidden"}
                        variants={fadeInUp}
                        className="text-center max-w-5xl mx-auto"
                    >
                        <motion.div className="relative w-72 h-72 mx-auto mb-8">
                            {/* 로고 확대/축소 애니메이션 */}
                            <motion.div
                                className="absolute inset-0 flex justify-center items-center"
                                animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <img src="/Node_Logo_Refined.png" alt="NODE Logo" className="w-full h-full object-contain" />
                            </motion.div>

                            {/* 링 애니메이션: 부드럽게 회전하며 확장 */}
                            <motion.div
                                className="absolute inset-5 border-2 border-white-500/30 rounded-full"
                                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.4, 0.6] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                            />
                            <motion.div
                                className="absolute inset-0 border-2 border-white-500/30 rounded-full"
                                animate={{ scale: [1, 1.25, 1], opacity: [0.8, 0.4, 0.8] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                            />
                        </motion.div>
                        <motion.h1
                            className="text-7xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-500 to-teal-400 tracking-wide leading-relaxed mb-4"
                            animate={{ backgroundPosition: ["0% center", "100% center", "0% center"] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            style={{ backgroundSize: "200% auto" }}
                        >
                            PROJECT : NODE
                        </motion.h1>
                        <motion.h2
                            className="text-2xl font-bold text-white/90 mb-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                        >
                            Created by CAS
                        </motion.h2>
                        <motion.p
                            className="text-lg text-white/70 max-w-2xl mx-auto mb-12"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 1 }}
                        >
                            미래를 향한 혁신적인 인공지능 프로젝트 <br />
                            <span className="text-sm">Innovative AI project for the future</span>
                        </motion.p>
                    </motion.div>
                    <motion.div
                        className="bottom-5 px-8 py-3"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </motion.div>
                </section>

                {/* 철학 섹션 */}
                <section ref={aboutRef} className="min-h-screen flex flex-col justify-center items-center px-4 py-20">
                    <motion.div
                        initial="hidden"
                        animate={aboutInView ? "visible" : "hidden"}
                        variants={fadeInUp}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <div className="mb-12">
                            <h2 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-6">
                                "해봐야 안다"
                            </h2>
                            <p className="text-2xl font-medium text-white/90">whip whip</p>
                        </div>
                        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16" variants={staggerContainer} initial="hidden" animate="visible">
                            <motion.div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl hover:bg-white/10 transition-colors duration-300" variants={fadeInUp}>
                                <div className="text-4xl mb-4 text-blue-400">🔍</div>
                                <h3 className="text-xl font-bold text-white mb-2">탐구</h3>
                                <p className="text-white/70">새로운 아이디어와 기술을 끊임없이 탐구합니다</p>
                            </motion.div>
                            <motion.div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl hover:bg-white/10 transition-colors duration-300" variants={fadeInUp}>
                                <div className="text-4xl mb-4 text-purple-400">🚀</div>
                                <h3 className="text-xl font-bold text-white mb-2">도전</h3>
                                <p className="text-white/70">한계를 뛰어넘는 도전 정신으로 혁신을 추구합니다</p>
                            </motion.div>
                            <motion.div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl hover:bg-white/10 transition-colors duration-300" variants={fadeInUp}>
                                <div className="text-4xl mb-4 text-teal-400">🤝</div>
                                <h3 className="text-xl font-bold text-white mb-2">공유</h3>
                                <p className="text-white/70">생각의 공유를 통해 더 큰 가치를 만들어 냅니다</p>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* 특징 섹션 */}
                <section ref={featuresRef} className="min-h-screen flex flex-col justify-center items-center px-4 py-20">
                    <motion.div initial="hidden" animate={featuresInView ? "visible" : "hidden"} variants={fadeInUp} className="max-w-6xl mx-auto w-full">
                        <div className="text-center mb-16">
                            <motion.h2
                                className="text-4xl font-bold text-white mb-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.6 }}
                            >
                                프로젝트 특징
                            </motion.h2>
                            <motion.div
                                className="h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-6"
                                initial={{ width: 0 }}
                                animate={featuresInView ? { width: 80 } : { width: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                            />
                            <motion.p
                                className="text-white/70 max-w-2xl mx-auto"
                                initial={{ opacity: 0 }}
                                animate={featuresInView ? { opacity: 1 } : { opacity: 0 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                            >
                                PROJECT : NODE는 혁신적인 기술과 창의적인 아이디어를 통해 <br />
                                인공지능의 새로운 가능성을 탐구합니다
                            </motion.p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <InteractiveCard
                                title="AI 연구 플랫폼"
                                description="최신 인공지능 기술을 연구하고 개발하는 플랫폼을 제공합니다"
                                image="/kimafganta.png?height=300&width=300"
                                color="bg-gradient-to-br from-purple-600/90 to-blue-600/90"
                            />
                            <InteractiveCard
                                title="협업 시스템"
                                description="학과 내 선배와 후배 간의 효과적인 협업을 위한 시스템을 구축합니다"
                                image="/kimafganta.png?height=300&width=300"
                                color="bg-gradient-to-br from-blue-600/90 to-teal-600/90"
                            />
                            <InteractiveCard
                                title="창의적 워크샵"
                                description="창의력을 자극하는 다양한 워크샵과 세미나를 진행합니다"
                                image="/kimafganta.png?height=300&width=300"
                                color="bg-gradient-to-br from-teal-600/90 to-emerald-600/90"
                            />
                            <InteractiveCard
                                title="프로젝트 쇼케이스"
                                description="완성된 프로젝트를 공유하고 피드백을 받을 수 있는 기회를 제공합니다"
                                image="/kimafganta.png?height=300&width=300"
                                color="bg-gradient-to-br from-emerald-600/90 to-purple-600/90"
                            />
                        </div>
                    </motion.div>
                </section>

                {/* 갤러리 섹션 */}
                <section ref={galleryRef} className="min-h-screen flex flex-col justify-center items-center px-4 py-20">
                    <motion.div initial="hidden" animate={galleryInView ? "visible" : "hidden"} variants={fadeInUp} className="max-w-6xl mx-auto w-full">
                        <div className="text-center mb-16">
                            <motion.h2
                                className="text-4xl font-bold text-white mb-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={galleryInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.6 }}
                            >
                                프로젝트 갤러리
                            </motion.h2>
                            <motion.div
                                className="h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-6"
                                initial={{ width: 0 }}
                                animate={galleryInView ? { width: 80 } : { width: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                            />
                            <motion.p
                                className="text-white/70 max-w-2xl mx-auto"
                                initial={{ opacity: 0 }}
                                animate={galleryInView ? { opacity: 1 } : { opacity: 0 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                            >
                                NODE 프로젝트의 다양한 활동과 성과를 살펴보세요
                            </motion.p>
                        </div>
                        <RotatingGallery images={galleryImages} />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                            <ZoomImage src="/kimafganta.png?height=300&width=300" alt="AI Research" />
                            <ZoomImage src="/kimafganta.png?height=300&width=300" alt="Team Collaboration" />
                            <ZoomImage src="/kimafganta.png?height=300&width=300" alt="Workshop" />
                        </div>
                    </motion.div>
                </section>

                {/* 팀 소개 섹션 */}
                <section ref={teamRef} className="min-h-screen flex flex-col justify-center items-center px-4 py-20">
                    <motion.div initial="hidden" animate={teamInView ? "visible" : "hidden"} variants={fadeInUp} className="max-w-6xl mx-auto w-full">
                        <div className="text-center mb-16">
                            <motion.h2
                                className="text-4xl font-bold text-white mb-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={teamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.6 }}
                            >
                                CAS 소개
                            </motion.h2>
                            <motion.div
                                className="h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-6"
                                initial={{ width: 0 }}
                                animate={teamInView ? { width: 80 } : { width: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                            />
                        </div>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                            <motion.div
                                className="w-full max-w-md"
                                initial={{ opacity: 0, x: -50 }}
                                animate={teamInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                                transition={{ duration: 0.8 }}
                            >
                                <img src="/CASlogo.png" alt="CAS Logo" className="w-full h-auto object-contain mb-8" />
                                <motion.div className="relative overflow-hidden rounded-xl" whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 mix-blend-overlay" />
                                    <img src="/kimafganta.png?height=400&width=600" alt="CAS Team" className="w-full h-auto rounded-xl" />
                                </motion.div>
                            </motion.div>
                            <motion.div
                                className="w-full max-w-lg bg-white/5 backdrop-blur-sm p-8 rounded-xl"
                                initial={{ opacity: 0, x: 50 }}
                                animate={teamInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                                transition={{ duration: 0.8 }}
                            >
                                <h3 className="text-2xl font-bold text-white mb-6">중앙대학교 인공지능 세미나</h3>
                                <p className="text-white/80 mb-6 leading-relaxed">
                                    Chung-Ang University Artificial Intelligence Seminar (CAS)는 AI에 열정을 가진 인재들이 모여 서로의
                                    지식을 나누고 함께 성장하는 공간입니다.
                                </p>
                                <p className="text-white/80 mb-6 leading-relaxed">
                                    CAS는 AI분야와 다른 분야들을 접목해 무한한 가능성과 창의력을 탐구하기 위해 만들어진 학회입니다.
                                </p>
                                <p className="text-white/80 mb-6 leading-relaxed">
                                    직접 부딫히고 경험하며 함께 성장하는 문화를 만들어가고자 합니다.
                                </p>
                                <div className="p-4 border border-white/10 rounded-lg bg-white/5 mb-6">
                                    <p className="text-white font-medium text-lg text-center">"해봐야 안다."</p>
                                </div>
                                <p className="text-white/80 mb-6 leading-relaxed">
                                    해보지 않으면 모르는 것이 많습니다. CAS와 함께 무엇이든 부딫혀 보며, 새로운 생각의 패러다임을 펼쳐보세요.
                                </p>
                                <p className="text-white/80 leading-relaxed">
                                    끊임없는 도전과 경험을 통해 달라진 자신을 발견하실 수 있을 겁니다.
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </section>

                {/* 연락처 섹션 */}
                <section ref={contactRef} className="min-h-screen flex flex-col justify-center items-center px-4 py-20">
                    <motion.div initial="hidden" animate={contactInView ? "visible" : "hidden"} variants={fadeInUp} className="max-w-6xl mx-auto w-full">
                        <div className="text-center mb-16">
                            <motion.h2
                                className="text-4xl font-bold text-white mb-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={contactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.6 }}
                            >
                                NODE 프로젝트 참여하기
                            </motion.h2>
                            <motion.div
                                className="h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-6"
                                initial={{ width: 0 }}
                                animate={contactInView ? { width: 80 } : { width: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                            />
                            <motion.p
                                className="text-white/70 max-w-2xl mx-auto mb-12"
                                initial={{ opacity: 0 }}
                                animate={contactInView ? { opacity: 1 } : { opacity: 0 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                            >
                                NODE Project는 학과 내 선배와 후배 간의 단합과 협업을 촉진하여, <br />
                                창의적이고 혁신적인 아이디어를 실현하는 플랫폼입니다.
                            </motion.p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <motion.div
                                className="bg-white/5 backdrop-blur-sm p-8 rounded-xl"
                                initial={{ opacity: 0, y: 30 }}
                                animate={contactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                transition={{ duration: 0.8 }}
                            >
                                <h3 className="text-2xl font-bold text-white mb-6">채찍피티 이벤트 참여 방법</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mt-1">
                                            <span className="text-purple-400">01</span>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-medium text-white mb-2">지원서 제출</h4>
                                            <p className="text-white/70">온라인 지원서를 작성하여 제출해주세요. 대충 예시임</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mt-1">
                                            <span className="text-blue-400">02</span>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-medium text-white mb-2">면접 참여</h4>
                                            <p className="text-white/70">간단한 면접을 통해 열정과 관심사를 공유해주세요 . 대충 예시임</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center mt-1">
                                            <span className="text-teal-400">03</span>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-medium text-white mb-2">오리엔테이션</h4>
                                            <p className="text-white/70">프로젝트 소개와 팀 빌딩 과정에 참여합니다 . 대충 예시임</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-10">
                                    <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300">
                                        지원하실?
                                    </button>
                                </div>
                            </motion.div>
                            <motion.div
                                className="bg-white/5 backdrop-blur-sm p-8 rounded-xl"
                                initial={{ opacity: 0, y: 30 }}
                                animate={contactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <h3 className="text-2xl font-bold text-white mb-6">연락처</h3>
                                <div className="space-y-6 mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-medium text-white">이메일</h4>
                                            <p className="text-white/70">cas@example.ac.kr</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-medium text-white">위치</h4>
                                            <p className="text-white/70">중앙대학교 310관 팀플룸</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-medium text-white">활동 시간</h4>
                                            <p className="text-white/70">꼴릴 때마다</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </section>
            </main>

            <Footer />
        </motion.div>
    );
};

export default ModernIndex;
