"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 확대되는 이미지 컴포넌트
 * 마우스 호버 시 이미지 확대와 파동 효과 애니메이션 적용.
 */
const ZoomImage = ({ src, alt }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative overflow-hidden rounded-xl w-full max-w-sm h-64 mx-auto"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.img
                src={src}
                alt={alt}
                className="w-full h-full object-cover"
                animate={{
                    scale: isHovered ? 1.1 : 1,
                    filter: isHovered ? "brightness(1.1)" : "brightness(1)",
                }}
                transition={{ duration: 0.4 }}
            />

            {/* 파동 효과 */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                    >
                        <motion.div
                            className="absolute inset-0 rounded-xl"
                            initial={{ scale: 1, opacity: 0.8 }}
                            animate={{ scale: 1.2, opacity: 0 }}
                            transition={{ duration: 10.5, repeat: Infinity }}
                        />
                        <motion.div
                            className="absolute inset-0  rounded-xl"
                            initial={{ scale: 1, opacity: 0.8 }}
                            animate={{ scale: 1.3, opacity: 0 }}
                            transition={{ duration: 10.5, repeat: Infinity, delay: 0.3 }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ZoomImage;
