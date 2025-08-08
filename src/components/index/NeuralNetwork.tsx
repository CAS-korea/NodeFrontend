"use client";

import { useEffect, useRef } from "react";
import type { FC } from "react";

type Node = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    alpha: number;       // 현재 투명도
    targetAlpha: number; // 0(사라짐) ↔ 1(완전 표시)
};

type Edge = { from: number; to: number };

const NeuralNetwork: FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const mouseRef  = useRef({ x: -1_000, y: -1_000 });

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx    = canvas.getContext("2d")!;

        /* ── 헬퍼 ─────────────────────────────────────── */
        const getTargetCount = (w: number) =>
            w < 640 ? 50 : w < 1024 ? 100 : 200; // sm / md~lg / lg+

        const nodes: Node[] = [];
        const edges: Edge[] = [];

        /** 노드 수를 목표치에 맞춤 + 에지 구축 */
        const syncNodeCount = (target: number) => {
            // 추가: fade-in 준비
            while (nodes.length < target) {
                nodes.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    alpha: 0,
                    targetAlpha: 1,
                });
            }
            // 제거: fade-out 플래그만 켬
            if (nodes.length > target) {
                for (let i = target; i < nodes.length; i++) nodes[i].targetAlpha = 0;
            }
            rebuildEdges(); // 연결 재계산
        };

        const rebuildEdges = () => {
            edges.length = 0;
            for (let i = 0; i < nodes.length; i++)
                for (let j = i + 1; j < nodes.length; j++)
                    edges.push({ from: i, to: j });
        };

        /* ── 리사이즈 ─────────────────────────────────── */
        const resize = () => {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
            syncNodeCount(getTargetCount(canvas.width));
        };
        resize();
        window.addEventListener("resize", resize);

        /* ── 마우스 ───────────────────────────────────── */
        const onMove = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };
        const onLeave = () => {
            mouseRef.current.x = -1_000;
            mouseRef.current.y = -1_000;
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseleave", onLeave);

        /* ── 애니메이션 ───────────────────────────────── */
        const FADE_SPEED = 0.1;      // 투명도 보간 속도
        const REPEL_R    = 50;        // 마우스 반발 반경
        const REPEL_F    = 1.3;       // 마우스 반발 강도
        let id = 0;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const { x: mx, y: my } = mouseRef.current;

            /* ─ 노드 업데이트 ─ */
            nodes.forEach((n, idx) => {
                /** fade in/out */
                n.alpha += (n.targetAlpha - n.alpha) * FADE_SPEED;

                /** 마우스 반발 */
                const dx = n.x - mx, dy = n.y - my, d = Math.hypot(dx, dy);
                if (d < REPEL_R) {
                    const f = (REPEL_R - d) / REPEL_R * REPEL_F;
                    n.vx += (dx / d) * f;
                    n.vy += (dy / d) * f;
                }

                /** 물결 + 이동 + 감쇠 */
                n.y += Math.sin(Date.now() * 0.001 + idx * 0.1) * 0.25;
                n.x += n.vx; n.y += n.vy;
                n.vx *= 0.98; n.vy *= 0.98;

                if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
                if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
            });

            /* ─ 에지 그리기 ─ */
            edges.forEach(({ from, to }) => {
                const a = nodes[from], b = nodes[to];
                if (a.alpha < 0.01 || b.alpha < 0.01) return; // 보이지 않는 노드 skip

                const dx = a.x - b.x, dy = a.y - b.y, dist = Math.hypot(dx, dy);
                const maxDist = 390;
                let alpha = Math.max(0, (maxDist - dist) / maxDist) * 0.4;
                alpha *= a.alpha * b.alpha; // 노드 투명도 반영

                if (alpha > 0.005) {
                    ctx.strokeStyle = `rgba(20, 80, 185, ${alpha})`;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            });

            /* ─ 노드 그리기 ─ */
            nodes.forEach((n) => {
                if (n.alpha < 0.01) return;
                ctx.globalAlpha = n.alpha;
                ctx.beginPath();
                ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
                ctx.fillStyle   = "#7486e6";
                ctx.shadowColor = "#8031e3";
                ctx.shadowBlur  = 60;
                ctx.fill();
                ctx.shadowBlur  = 0;
                ctx.globalAlpha = 1;
            });

            /* ─ fade-out 완료된 노드 정리 ─ */
            const before = nodes.length;
            for (let i = nodes.length - 1; i >= 0; i--) {
                if (nodes[i].targetAlpha === 0 && nodes[i].alpha < 0.01) nodes.splice(i, 1);
            }
            if (nodes.length !== before) rebuildEdges();

            id = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            cancelAnimationFrame(id);
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseleave", onLeave);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full bg-black"
        />
    );
};

export default NeuralNetwork;
