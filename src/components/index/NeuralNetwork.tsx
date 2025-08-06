"use client";

import { useEffect, useRef } from "react";
import type { FC } from "react";

// Node and Edge types for clarity
type Node = {
    x: number;
    y: number;
    vx: number;
    vy: number;
};

type Edge = {
    from: number;
    to: number;
};

const NeuralNetwork: FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    // Use a ref for mouse position to avoid re-renders on every mouse move [^3]
    const mouseRef = useRef({ x: -1000, y: -1000 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const handleMouseMove = (event: MouseEvent) => {
            mouseRef.current.x = event.clientX;
            mouseRef.current.y = event.clientY;
        };
        window.addEventListener("mousemove", handleMouseMove);

        const handleMouseLeave = () => {
            mouseRef.current.x = -1000;
            mouseRef.current.y = -1000;
        };
        window.addEventListener("mouseleave", handleMouseLeave);

        /* ── nodes & edges ─────────────────────────────── */
        const nodes: Node[] = [];
        const edges: Edge[] = [];
        const nodeCount = 200;

        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
            });
        }

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                edges.push({ from: i, to: j });
            }
        }

        /* ── animation loop ────────────────────────────── */
        let animationFrameId: number;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const mouse = mouseRef.current;
            const repelRadius = 50;
            const repelStrength = 1.3;

            nodes.forEach((n, idx) => {
                // Repel from mouse
                const dxMouse = n.x - mouse.x;
                const dyMouse = n.y - mouse.y;
                const distMouse = Math.hypot(dxMouse, dyMouse);

                if (distMouse < repelRadius) {
                    const force = (repelRadius - distMouse) / repelRadius;
                    const angle = Math.atan2(dyMouse, dxMouse);
                    n.vx += Math.cos(angle) * force * repelStrength;
                    n.vy += Math.sin(angle) * force * repelStrength;
                }

                // Original wavy motion
                n.y += Math.sin(Date.now() * 0.001 + idx * 0.1) * 0.25;

                // Apply velocity
                n.x += n.vx;
                n.y += n.vy;

                // Dampen velocity for smoother animation
                n.vx *= 0.98;
                n.vy *= 0.98;

                // Wall bouncing
                if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
                if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
            });

            edges.forEach(({ from, to }) => {
                const a = nodes[from];
                const b = nodes[to];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.hypot(dx, dy);
                const maxDist = 390;
                const opacity = Math.max(0, (maxDist - dist) / maxDist) * 0.4;

                if (opacity > 0) {
                    ctx.strokeStyle = `rgba(51, 50, 275, ${opacity})`;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            });

            nodes.forEach((n) => {
                ctx.beginPath();
                ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = "#072dec";
                ctx.shadowColor = "#e6e8ef";
                ctx.shadowBlur = 60;
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    // Using refs to access DOM elements is a common pattern in React. [^2]
    return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full bg-black" />;
};


export default NeuralNetwork;
