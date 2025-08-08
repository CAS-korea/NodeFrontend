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
import NeuralNetwork from "../components/index/NeuralNetwork";
import GlassFilters from "../components/index/GlassFilters";



import "./Index.css";

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
        { src: "index/index_collab.jpg?height=400&width=400", alt: "Collab", caption: "팀 협업" },
        { src: "index/index_design.jpg?height=400&width=400", alt: "Design", caption: "웹 디자인" },
        { src: "index/index_link.jpg?height=400&width=400", alt: "Link", caption: "다른 이들과 소통" },
        { src: "index/index_seminar.jpg?height=400&width=400", alt: "Seminar", caption: "세미나 발표" },
        { src: "index/index_memory.jpg?height=400&width=400", alt: "Memory", caption: "값진 경험들" },
    ];

    return (
        <motion.div ref={containerRef} className="relative min-h-screen overflow-x-hidden" style={backgroundStyle}>
            {/* 미니멀한 배경 효과 */}
            <GlassFilters />
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <NeuralNetwork />
                <div className="absolute inset-0 bg-gradient-radial from-blue-900/10 to-transparent opacity-40" />
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
                        <motion.div className="relative h-72 mx-auto">
                            {/* 로고 확대/축소 애니메이션 */}
                            <motion.div
                                className="absolute inset-0 flex justify-center items-center"
                            >
                                <img src="/Node_Logo_Refined.png" alt="NODE Logo" className="w-full h-full object-contain" />
                            </motion.div>

                        </motion.div>
                        <motion.h1
                            className="text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-500 to-teal-400 tracking-wide leading-relaxed mb-8"
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
                            AI학과를 위한 커넥션 프로젝트 <br />
                            <span className="text-sm">Connection Project for AI Department</span>
                        </motion.p>
                    </motion.div>
                    <motion.div
                        className="bottom-5 px-8 py-3"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                            <h2 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-500 to-teal-400 mb-6">
                                "해봐야 안다"
                            </h2>
                            <p className="text-2xl font-medium text-white/90">- VISION OF CAS -</p>
                        </div>

                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            {[
                                { title: "탐구", desc: "새로운 아이디어와 개념을 끊임없이 탐구합니다" },
                                { title: "도전", desc: "무엇이든 해봐야 안다라는 생각으로 도전합니다" },
                                { title: "공유", desc: "생각의 공유를 통해 더 큰 가치를 만들어 냅니다" },
                            ].map(({ title, desc }) => (
                                <motion.div
                                    key={title}
                                    variants={fadeInUp}
                                >
                                    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                                    <p className="text-white/70">{desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </section>

                {/* 특징 섹션 */}
                <section ref={featuresRef} className="min-h-screen flex flex-col justify-center items-center px-4 py-20">
                    <motion.div initial="hidden" animate={featuresInView ? "visible" : "hidden"} variants={fadeInUp} className="max-w-6xl mx-auto w-full">
                        <div className="text-center mb-16">
                            <motion.h2
                                className=" text-4xl font-bold text-white mb-4"
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
                                title="정보교류회"
                                description="CAS 회원들끼리 정보를 공유하며 교류합니다."
                                video="index/index_seminar_vid.MOV?height=400&width=400"
                            />
                            <InteractiveCard
                                title="데모"
                                description="만들어진 프로토타입을 시연 영상으로 발표할 시간입니다!"
                                video="index/index_demo.MOV?height=400&width=400"

                            />
                            <InteractiveCard
                                title="프로토타입 제작"
                                description="프로토타입을 제작하여 자랑해보세요! 시작이 즐거워야 목표까지 즐거울 수 있습니다."
                                video="index/index_prototype.MOV?height=400&width=400"

                            />
                            <InteractiveCard
                                title="해커톤 참여"
                                description="CAS 내에서 해커톤 팀을 꾸려 실제 해커톤들도 참여해보실 수 있습니다."
                                image="index/index_hack.JPG?height=400&width=400"

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
                            <ZoomImage src="index/index_hackathon.png?height=500&width=300" alt="AI Research" />
                            <ZoomImage src="index/index_roadmap.png?height=300&width=300" alt="Team Collaboration" />
                            <ZoomImage src="index/index_ppt.JPG?height=300&width=300" alt="Workshop" />
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
                                        <img src="index/index_nangman.JPG?height=400&width=600" alt="CAS" className="w-full h-auto rounded-xl" />
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
                                <div className="p-4  mb-6">
                                    <p className="text-white font-medium text-2xl text-center">"해봐야 안다."</p>
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
                                <h3 className="text-2xl font-bold text-white mb-6">CAS에 지원하세요!</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mt-1">
                                            <span className="text-purple-400">01</span>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-medium text-white mb-2">개별 연락</h4>
                                            <p className="text-white/70">저희 임원진 중 한 명에게 연락 주시길 바랍니다.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mt-1">
                                            <span className="text-blue-400">02</span>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-medium text-white mb-2">면접 참여</h4>
                                            <p className="text-white/70">간단한 면접을 통해 열정과 관심사를 공유해주세요.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center mt-1">
                                            <span className="text-teal-400">03</span>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-medium text-white mb-2">오리엔테이션</h4>
                                            <p className="text-white/70">프로젝트 소개와 팀 빌딩 과정에 뛰어드세요!</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-10">
                                    <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300">
                                        많은 관심 부탁드립니다
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
                                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-medium text-white">이메일</h4>
                                            <p className="text-white/70">cas.aikorea@gmail.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-medium text-white">위치</h4>
                                            <p className="text-white/70">중앙대학교 근처</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-medium text-white">활동 시간</h4>
                                            <p className="text-white/70">미정</p>
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
