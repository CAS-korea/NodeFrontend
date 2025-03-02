"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// CustomCursor 컴포넌트 Props 인터페이스
interface CustomCursorProps {
    dotSize?: number;      // 메인 커서 점 크기
    ringSize?: number;     // 링 크기
    color?: string;        // 점 및 링의 기본 색상
    ringColor?: string;    // 링의 색상 (반투명)
    enableTrail?: boolean; // 트레일 효과 사용 여부
    trailLength?: number;  // 트레일 점 개수
}

const CustomCursor: React.FC<CustomCursorProps> = ({
                                                       dotSize = 10,
                                                       ringSize = 60,
                                                       // 기본 색상은 다크모드에 따라 변경
                                                       color: propColor,
                                                       ringColor: propRingColor,
                                                       enableTrail = true,
                                                       trailLength = 8,
                                                   }) => {
    // 다크모드 상태 감지
    const [isDarkMode, setIsDarkMode] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        setIsDarkMode(mq.matches);
        const handleChange = (e: MediaQueryListEvent) => {
            setIsDarkMode(e.matches);
        };
        mq.addEventListener("change", handleChange);
        return () => mq.removeEventListener("change", handleChange);
    }, []);

    const defaultColor = isDarkMode ? "#ffffff" : "#000000";
    const defaultRingColor = isDarkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
    const color = propColor || defaultColor;
    const ringColor = propRingColor || defaultRingColor;

    // 마우스 위치 모션 값
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // 스프링을 이용한 부드러운 커서 움직임
    const springConfig = { damping: 45, stiffness: 1000 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    // 링은 약간 느리게 따라감
    const ringX = useSpring(mouseX, { damping: 50, stiffness: 400 });
    const ringY = useSpring(mouseY, { damping: 50, stiffness: 400 });

    // 커서 보임 상태
    const [isVisible, setIsVisible] = useState(false);
    // 트레일 점들의 위치 상태
    const [trailPositions, setTrailPositions] = useState<{ x: number; y: number }[]>([]);
    const lastUpdateTime = useRef(0);
    const requestRef = useRef<number | null>(null);

    // 트레일 업데이트 함수 (최적화를 위해 30ms 간격 업데이트)
    const updateTrail = useCallback(() => {
        if (!enableTrail) return;
        const now = performance.now();
        if (now - lastUpdateTime.current > 30) {
            setTrailPositions((prev) => {
                const newPositions = [...prev, { x: mouseX.get(), y: mouseY.get() }];
                return newPositions.slice(-trailLength);
            });
            lastUpdateTime.current = now;
        }
        requestRef.current = requestAnimationFrame(updateTrail);
    }, [mouseX, mouseY, enableTrail, trailLength]);

    useEffect(() => {
        // 기본 커서 숨기기
        document.body.style.cursor = "none";
        const visibilityTimeout = setTimeout(() => setIsVisible(true), 100);

        if (enableTrail) {
            requestRef.current = requestAnimationFrame(updateTrail);
        }

        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseenter", handleMouseEnter);
        document.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            document.body.style.cursor = "auto";
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseenter", handleMouseEnter);
            document.removeEventListener("mouseleave", handleMouseLeave);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            clearTimeout(visibilityTimeout);
        };
    }, [mouseX, mouseY, updateTrail, enableTrail]);

    // 트레일 점들 렌더링 (각 점은 위치, 크기, 투명도가 다름)
    const trailDots = enableTrail
        ? trailPositions.map((pos, index) => {
            const progress = (index + 1) / trailPositions.length;
            const size = dotSize * (0.5 + progress * 1.5);
            const opacity = progress * 0.5;
            return (
                <motion.div
                    key={`trail-${index}`}
                    className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998]"
                    style={{
                        x: pos.x - size / 2,
                        y: pos.y - size / 2,
                        width: size,
                        height: size,
                        backgroundColor: color,
                        opacity: opacity,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: opacity }}
                    transition={{ duration: 0.1 }}
                />
            );
        })
        : null;

    return (
        <>
            {/* 트레일 점들 */}
            {trailDots}

            {/* 메인 커서 점 */}
            <motion.div
                className="fixed top-0 left-0 rounded-full pointer-events-none z-[10000]"
                style={{
                    x: cursorX,
                    y: cursorY,
                    width: dotSize,
                    height: dotSize,
                    backgroundColor: color,
                    opacity: isVisible ? 1 : 0,
                    mixBlendMode: "difference",
                }}
            />

            {/* 커서 링 */}
            <motion.div
                className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
                style={{
                    x: ringX,
                    y: ringY,
                    width: ringSize,
                    height: ringSize,
                    border: `1.5px solid ${ringColor}`,
                    opacity: isVisible ? 1 : 0,
                    translateX: `-${ringSize / 2}px`,
                    translateY: `-${ringSize / 2}px`,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30, bounce: 0.2 }}
            />
        </>
    );
};

export default CustomCursor;
