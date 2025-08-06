// src/components/GlassFilters.tsx
export default function GlassFilters() {
    return (
        /* 포커스 안 잡히게 width/height 0 */
        <svg width="0" height="0" className="absolute">
            {/* 큰 컨테이너(카드) */}
            <filter id="container-glass" x="0%" y="0%" width="100%" height="100%">
                <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.014 0.011"
                    numOctaves="2"
                    seed="70"
                    result="noise"
                />
                <feGaussianBlur in="noise" stdDeviation="2.22" result="blur" />
                <feDisplacementMap
                    in="SourceGraphic"
                    in2="blur"
                    scale="67"
                    xChannelSelector="R"
                    yChannelSelector="G"
                />
            </filter>
        </svg>
    );
}
