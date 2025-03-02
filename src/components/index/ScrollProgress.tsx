"use client";

import { motion, useScroll } from "framer-motion";

/**
 * 스크롤 진행 표시기 컴포넌트
 * 페이지 스크롤에 따라 상단에 진행 바를 표시.
 */
const ScrollProgress = () => {
    const { scrollYProgress } = useScroll();

    return (
        <motion.div
            className="fixed top-16 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 z-50"
            style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
        />
    );
};

export default ScrollProgress;
