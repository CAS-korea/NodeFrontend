"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

type Mode = "blend" | "contrast"

export interface CustomCursorProps {
    enabled?: boolean
    disableOnTouch?: boolean
    dotSize?: number
    ringSize?: number
    ringBorder?: number
    enableTrail?: boolean
    trailLength?: number
    mode?: Mode // "blend" (mix-blend-mode: difference) | "contrast" (computed white/black)
    clickableSelector?: string
    blendColor?: string // base color when in blend mode; default is white for proper inversion
    ringBlend?: boolean
    performance?: {
        trailFps?: number
        colorFps?: number
        now(): number;
    }
}

/**
 * Notes:
 * - Must run on the client because it uses hooks and DOM APIs (event handlers, elementFromPoint) [^2][^3].
 * - rAF loops and callbacks are memoized with useCallback to reduce re-renders [^1].
 */
const CustomCursor: React.FC<CustomCursorProps> = ({
                                                       enabled,
                                                       disableOnTouch = true,
                                                       dotSize = 10,
                                                       ringSize = 56,
                                                       ringBorder = 1.5,
                                                       enableTrail = true,
                                                       trailLength = 8,
                                                       mode = "blend",
                                                       // Detect typical interactive elements; add data-cursor="clickable" for custom targets
                                                       clickableSelector = 'a, button, [role="button"], input[type="button"], input[type="submit"], label[for], [data-cursor="clickable"], [tabindex]:not([tabindex="-1"])',
                                                       // Critical fix: use white as the base color for mix-blend-mode: difference
                                                       blendColor = "#ffffff",
                                                       ringBlend = true,
                                                       performance = { trailFps: 33, colorFps: 30,
                                                           now() {
                                                               return 0;
                                                           }
                                                       },
                                                   }) => {
    // Touch detection: disable cursor on phones/tablets
    const [isTouch, setIsTouch] = useState(false)
    useEffect(() => {
        const coarse = window.matchMedia("(pointer: coarse)").matches
        const noHover = window.matchMedia("(hover: none)").matches
        const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0
        setIsTouch(coarse || noHover || hasTouch)
    }, [])

    const shouldEnable = useMemo(() => {
        if (typeof enabled === "boolean") return enabled
        if (disableOnTouch && isTouch) return false
        return true
    }, [enabled, disableOnTouch, isTouch])

    // Motion and springs
    const mouseX = useMotionValue(-9999)
    const mouseY = useMotionValue(-9999)
    const cursorX = useSpring(mouseX, { damping: 45, stiffness: 1000 })
    const cursorY = useSpring(mouseY, { damping: 45, stiffness: 1000 })
    const ringX = useSpring(mouseX, { damping: 50, stiffness: 400 })
    const ringY = useSpring(mouseY, { damping: 50, stiffness: 400 })

    // Visibility and active state
    const [isVisible, setIsVisible] = useState(false)
    const [isActive, setIsActive] = useState(false)

    // Trail
    const [trailPositions, setTrailPositions] = useState<{ x: number; y: number }[]>([])
    const lastTrailUpdate = useRef(0)
    const trailRaf = useRef<number | null>(null)
    const now = () => (typeof performance !== "undefined" ? performance.now() : Date.now())
    const trailInterval = 1000 / (performance.trailFps ?? 33)

    const updateTrail = useCallback(() => {
        if (!enableTrail) return
        const t = now()
        if (t - lastTrailUpdate.current >= trailInterval) {
            setTrailPositions((prev) => {
                const np = [...prev, { x: mouseX.get(), y: mouseY.get() }]
                return np.slice(-trailLength)
            })
            lastTrailUpdate.current = t
        }
        trailRaf.current = requestAnimationFrame(updateTrail)
    }, [enableTrail, mouseX, mouseY, trailLength, trailInterval])

    // Contrast mode (optional fallback) – sample background and pick white/black
    const [contrastColor, setContrastColor] = useState("#000000")
    const lastColorUpdate = useRef(0)
    const colorRaf = useRef<number | null>(null)
    const colorInterval = 1000 / (performance.colorFps ?? 30)

    const computeContrastColor = useCallback(() => {
        const x = mouseX.get()
        const y = mouseY.get()
        const el = document.elementFromPoint(x, y) as HTMLElement | null
        let current: HTMLElement | null = el
        let bg = ""
        while (current) {
            const cs = getComputedStyle(current)
            const bgc = cs.backgroundColor
            if (bgc && !isTransparent(bgc)) {
                bg = bgc
                break
            }
            current = current.parentElement
        }
        if (!bg) {
            const bodyBg = getComputedStyle(document.body).backgroundColor
            bg = isTransparent(bodyBg) ? "#ffffff" : bodyBg
        }
        const { r, g, b } = toRgb(bg)
        const L = relativeLuminance(r, g, b)
        setContrastColor(L < 0.5 ? "#ffffff" : "#000000")
    }, [mouseX, mouseY])

    const updateContrastLoop = useCallback(() => {
        if (mode !== "contrast") return
        const t = now()
        if (t - lastColorUpdate.current >= colorInterval) {
            computeContrastColor()
            lastColorUpdate.current = t
        }
        colorRaf.current = requestAnimationFrame(updateContrastLoop)
    }, [computeContrastColor, colorInterval, mode])

    useEffect(() => {
        if (!shouldEnable) return

        // hide native cursor only while enabled
        const prev = document.body.style.cursor
        document.body.style.cursor = "none"

        const visTimeout = setTimeout(() => setIsVisible(true), 80)

        // Start loops
        if (enableTrail) {
            trailRaf.current = requestAnimationFrame(updateTrail)
        }
        if (mode === "contrast") {
            colorRaf.current = requestAnimationFrame(updateContrastLoop)
        }

        // Events
        const onMove = (e: MouseEvent) => {
            mouseX.set(e.clientX)
            mouseY.set(e.clientY)
        }
        const onEnter = () => setIsVisible(true)
        const onLeave = () => setIsVisible(false)

        const onOver = (e: MouseEvent) => {
            const t = e.target as Element | null
            if (!t) return
            setIsActive(!!closestClickable(t, clickableSelector))
        }
        const onOut = (e: MouseEvent) => {
            if (!e.relatedTarget) setIsActive(false)
        }

        document.addEventListener("mousemove", onMove, { passive: true })
        document.addEventListener("mouseenter", onEnter)
        document.addEventListener("mouseleave", onLeave)
        document.addEventListener("mouseover", onOver)
        document.addEventListener("mouseout", onOut)

        return () => {
            document.body.style.cursor = prev
            document.removeEventListener("mousemove", onMove)
            document.removeEventListener("mouseenter", onEnter)
            document.removeEventListener("mouseleave", onLeave)
            document.removeEventListener("mouseover", onOver)
            document.removeEventListener("mouseout", onOut)
            if (trailRaf.current) cancelAnimationFrame(trailRaf.current)
            if (colorRaf.current) cancelAnimationFrame(colorRaf.current)
            clearTimeout(visTimeout)
        }
    }, [shouldEnable, enableTrail, mode, clickableSelector, updateTrail, updateContrastLoop, mouseX, mouseY])

    if (!shouldEnable) return null

    const dotColor = mode === "blend" ? blendColor : contrastColor
    const ringColor = mode === "blend" ? blendColor : contrastColor

    // Trail
    const trail =
        enableTrail && trailPositions.length > 0
            ? trailPositions.map((p, i) => {
                const progress = (i + 1) / trailPositions.length
                const size = dotSize * (0.5 + progress * 1.2)
                const opacity = progress * 0.45
                return (
                    <motion.div
                        key={`trail-${i}`}
                        aria-hidden="true"
                        className="fixed left-0 top-0 pointer-events-none rounded-full"
                        style={{
                            x: p.x,
                            y: p.y,
                            translateX: "-50%",
                            translateY: "-50%",
                            width: size,
                            height: size,
                            backgroundColor: dotColor,
                            opacity,
                            mixBlendMode: mode === "blend" ? ("difference" as any) : ("normal" as any),
                            willChange: "transform, opacity",
                            zIndex: 9998,
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity }}
                        transition={{ duration: 0.1 }}
                    />
                )
            })
            : null

    return (
        <>
            {trail}

            {/* Dot */}
            <motion.div
                aria-hidden="true"
                className="fixed left-0 top-0 pointer-events-none rounded-full"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                    width: dotSize,
                    height: dotSize,
                    backgroundColor: dotColor,
                    opacity: isVisible ? 1 : 0,
                    mixBlendMode: mode === "blend" ? ("difference" as any) : ("normal" as any),
                    willChange: "transform, opacity",
                    zIndex: 10000,
                }}
                animate={{ scale: isActive ? 1.3 : 1 }}
                transition={{ type: "spring", stiffness: 600, damping: 35 }}
            />

            {/* Ring */}
            <motion.div
                aria-hidden="true"
                className="fixed left-0 top-0 pointer-events-none rounded-full"
                style={{
                    x: ringX,
                    y: ringY,
                    translateX: "-50%",
                    translateY: "-50%",
                    width: ringSize,
                    height: ringSize,
                    borderStyle: "solid",
                    borderWidth: isActive ? ringBorder * 1.8 : ringBorder,
                    borderColor: ringColor,
                    opacity: isVisible ? 1 : 0.95,
                    mixBlendMode: mode === "blend" && ringBlend ? ("difference" as any) : ("normal" as any),
                    willChange: "transform, opacity, border-width",
                    zIndex: 9999,
                }}
                animate={{ scale: isActive ? 1.22 : 1 }}
                transition={{ type: "spring", stiffness: 320, damping: 30, bounce: 0.2 }}
            />
        </>
    )
}

export default CustomCursor

/* ------------- helpers ------------- */

function closestClickable(start: Element, selector: string) {
    let el: Element | null = start
    while (el && el !== document.documentElement) {
        if ((el as HTMLElement).matches?.(selector)) return el
        const style = window.getComputedStyle(el as HTMLElement)
        if (style.cursor === "pointer") return el
        el = el.parentElement
    }
    return null
}

function isTransparent(bg: string) {
    if (!bg) return true
    if (bg === "transparent") return true
    if (bg.startsWith("rgba")) {
        const a = parseFloat(bg.split(",")[3])
        return isNaN(a) ? true : a === 0
    }
    return false
}

function toRgb(input: string): { r: number; g: number; b: number } {
    let s = input.trim().toLowerCase()
    if (s.startsWith("#")) {
        if (s.length === 4) {
            const r = parseInt(s[1] + s[1], 16)
            const g = parseInt(s[2] + s[2], 16)
            const b = parseInt(s[3] + s[3], 16)
            return { r, g, b }
        }
        if (s.length === 7) {
            const r = parseInt(s.slice(1, 3), 16)
            const g = parseInt(s.slice(3, 5), 16)
            const b = parseInt(s.slice(5, 7), 16)
            return { r, g, b }
        }
    }
    if (s.startsWith("rgb")) {
        const nums = s
            .replace(/rgba?\(/, "")
            .replace(/\)/, "")
            .split(",")
            .map((n) => n.trim())
        const r = Math.max(0, Math.min(255, parseInt(nums[0] ?? "0", 10)))
        const g = Math.max(0, Math.min(255, parseInt(nums[1] ?? "0", 10)))
        const b = Math.max(0, Math.min(255, parseInt(nums[2] ?? "0", 10)))
        return { r, g, b }
    }
    return { r: 255, g: 255, b: 255 }
}

function srgbToLinear(c: number) {
    const cs = c / 255
    return cs <= 0.04045 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4)
}

function relativeLuminance(r: number, g: number, b: number) {
    const R = srgbToLinear(r)
    const G = srgbToLinear(g)
    const B = srgbToLinear(b)
    return 0.2126 * R + 0.7152 * G + 0.0722 * B
}
