"use client";

import React from "react";
import { motion } from "framer-motion";

interface MarqueeProps {
    items: string[];
    direction?: "left" | "right";
    speed?: number;
}

export default function Marquee({ items, direction = "left", speed = 20 }: MarqueeProps) {
    return (
        <div className="relative flex overflow-hidden py-10 bg-gray-50 border-y border-gray-100">
            <div className="flex gap-16 whitespace-nowrap">
                <motion.div
                    className="flex gap-16 min-w-full"
                    initial={{ x: direction === "left" ? 0 : "-100%" }}
                    animate={{ x: direction === "left" ? "-100%" : 0 }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: speed,
                    }}
                >
                    {items.map((item, index) => (
                        <span
                            key={index}
                            className="text-4xl md:text-6xl font-bold text-gray-200 uppercase tracking-widest select-none"
                        >
                            {item}
                        </span>
                    ))}
                    {/* Duplicate items for seamless loop */}
                    {items.map((item, index) => (
                        <span
                            key={`dup-${index}`}
                            className="text-4xl md:text-6xl font-bold text-gray-200 uppercase tracking-widest select-none"
                        >
                            {item}
                        </span>
                    ))}
                    {/* Duplicate items again for safety on wide screens */}
                    {items.map((item, index) => (
                        <span
                            key={`dup2-${index}`}
                            className="text-4xl md:text-6xl font-bold text-gray-200 uppercase tracking-widest select-none"
                        >
                            {item}
                        </span>
                    ))}
                </motion.div>

                {/* Second container for seamless loop logic if needed, but the above repetition usually covers it. 
            For a true infinite loop with Framer Motion, it's often easier to just repeat the children enough times 
            and animate the container X position.
            
            However, a more robust way is to have TWO copies of the list animating.
        */}
                <motion.div
                    className="flex gap-16 min-w-full absolute top-0 py-10 left-full"
                    initial={{ x: 0 }}
                    animate={{ x: "-200%" }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: speed * 2, // Adjust logic if using absolute positioning approach
                    }}
                    style={{ display: 'none' }} // Disabling this block to rely on the simple long-strip method above for now
                />
            </div>

            {/* Gradients to fade edges */}
            <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-white to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>
    );
}
