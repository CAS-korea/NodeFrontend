"use client";

import { useState } from "react";
import { motion } from "framer-motion";

/**
 * 회전 갤러리 컴포넌트
 * 이미지 배열을 회전하며 보여주며, 좌우 버튼으로 전환 가능.
 */
const RotatingGallery = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalImages = images.length;

    // 다음 이미지로 전환하는 함수
    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % totalImages);
    };

    // 이전 이미지로 전환하는 함수
    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
    };

    return (
        <div className="relative w-full max-w-4xl mx-auto h-80">
            <div className="absolute inset-0 flex items-center justify-center">
                {images.map((image, index) => {
                    // 현재 이미지와의 거리 계산 (-2, -1, 0, 1, 2)
                    let distance = (index - currentIndex + totalImages) % totalImages;
                    if (distance > totalImages / 2) distance -= totalImages;

                    // 위치, z-index, 스케일, 투명도 계산
                    const xPosition = distance * 150;
                    const zPosition = Math.abs(distance) * -100;
                    const scale = 1 - Math.abs(distance) * 0.15;
                    const opacity = 1 - Math.abs(distance) * 0.3;

                    return (
                        <motion.div
                            key={index}
                            className="absolute w-64 h-64 rounded-xl overflow-hidden shadow-xl"
                            initial={false}
                            animate={{
                                x: xPosition,
                                z: zPosition,
                                scale,
                                opacity,
                                rotateY: distance * -5,
                            }}
                            transition={{ duration: 0.5 }}
                            style={{
                                zIndex: 10 - Math.abs(distance),
                                transformStyle: "preserve-3d",
                            }}
                        >
                            <img
                                src={image.src || "/placeholder.svg"}
                                alt={image.alt}
                                className="w-full h-full object-cover"
                            />
                            {distance === 0 && (
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <p className="text-white p-4 font-medium">{image.caption}</p>
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* 이전 이미지 버튼 */}
            <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm"
                aria-label="Previous image"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </button>

            {/* 다음 이미지 버튼 */}
            <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm"
                aria-label="Next image"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </button>
        </div>
    );
};

export default RotatingGallery;
