"use client"

import type React from "react"
import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface PostContainerProps {
    children?: ReactNode
}

const PostContainer: React.FC<PostContainerProps> = ({ children }) => {
    return (
        <motion.div
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-[600px] items-center bg-white text-black p-6 space-y-6 rounded-xl shadow-md transition-all duration-300 ease-in-out dark:bg-gray-900"
        >
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.01, duration: 0.2 }}>
                {children}
            </motion.div>
        </motion.div>
    )
}

export default PostContainer

