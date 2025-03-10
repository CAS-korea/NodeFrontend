import React from "react";

interface SideArrowsProps {
    onNext: () => void;
    onPrevious: () => void;
    canGoPrevious: boolean;
    canGoNext: boolean;
}

const SideArrows: React.FC<SideArrowsProps> = ({
                                                   onNext,
                                                   onPrevious,
                                                   canGoPrevious,
                                                   canGoNext,
                                               }) => {
    return (
        <div className="fixed top-1/2 right-0 transform -translate-x-[254px] -translate-y-1/2 flex flex-col space-y-2 z-10">
            {/* Up Arrow */}
            {canGoPrevious && (
                <button
                    onClick={onPrevious}
                    className="dark:text-white text-black p-6 rounded-full opacity-50 hover:opacity-100 transition-opacity duration-200 text-3xl"
                >
                    ↑
                </button>
            )}

            {/* Down Arrow */}
            {canGoNext && (
                <button
                    onClick={onNext}
                    className="dark:text-white text-black p-6 rounded-full opacity-50 hover:opacity-100 transition-opacity duration-200 text-3xl"
                >
                    ↓
                </button>
            )}
        </div>
    );
};

export default SideArrows;
