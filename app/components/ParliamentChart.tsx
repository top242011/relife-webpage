"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Seat = {
    id: string;
    name: string;
    vote: "approve" | "disapprove" | "abstain" | "no_vote" | "other";
};

type Props = {
    seats: Seat[];
    totalSeats?: number;
    t: any;
};

// SVG fill colors (hex values for SVG compatibility)
const voteColors: Record<string, string> = {
    approve: "#22c55e",      // green-500
    disapprove: "#ef4444",   // red-500
    abstain: "#eab308",      // yellow-500
    no_vote: "#475569",      // slate-600
    other: "#e2e8f0",        // slate-200
};

const voteColorsHover: Record<string, string> = {
    approve: "#16a34a",      // green-600
    disapprove: "#dc2626",   // red-600
    abstain: "#ca8a04",      // yellow-600
    no_vote: "#334155",      // slate-700
    other: "#cbd5e1",        // slate-300
};

export default function ParliamentChart({ seats, totalSeats = 100, t }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);
    const [hoveredSeatId, setHoveredSeatId] = useState<string | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    // Fill remaining seats with "other"
    const allSeats: Seat[] = [...seats];
    for (let i = seats.length; i < totalSeats; i++) {
        allSeats.push({ id: `other-${i}`, name: t("otherParties"), vote: "other" });
    }

    // Row radii (from outer to inner)
    const rowRadii = [170, 145, 120, 95, 70];
    const numRows = rowRadii.length;

    // Calculate number of columns needed based on total seats
    const numColumns = Math.ceil(totalSeats / numRows);

    // Generate seat positions by filling COLUMN-FIRST (angle-first)
    // This groups same-colored seats together in angular sections
    const seatPositions: { seat: Seat; x: number; y: number; size: number }[] = [];
    let seatIndex = 0;

    // Iterate by column (angle) first, then by row (radius)
    for (let col = 0; col < numColumns && seatIndex < totalSeats; col++) {
        // Calculate angle for this column (from left PI to right 0)
        const angle = Math.PI - (col / (numColumns - 1 || 1)) * Math.PI;

        // Fill each row in this column from outer to inner
        for (let row = 0; row < numRows && seatIndex < totalSeats; row++) {
            const radius = rowRadii[row];
            const x = 200 + radius * Math.cos(angle);
            const y = 185 - radius * Math.sin(angle);

            seatPositions.push({
                seat: allSeats[seatIndex],
                x,
                y,
                size: radius > 130 ? 12 : radius > 100 ? 11 : 10,
            });
            seatIndex++;
        }
    }

    const handleMouseEnter = (seat: Seat, e: React.MouseEvent) => {
        setHoveredSeat(seat);
        setHoveredSeatId(seat.id);

        // Get position relative to container
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setTooltipPos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }
    };

    const handleMouseLeave = () => {
        setHoveredSeat(null);
        setHoveredSeatId(null);
    };

    return (
        <div ref={containerRef} className="relative w-full flex justify-center">
            <svg viewBox="0 0 400 200" className="w-full max-w-md">
                {/* Seats */}
                {seatPositions.map(({ seat, x, y, size }, idx) => (
                    <motion.circle
                        key={seat.id}
                        cx={x}
                        cy={y}
                        r={size / 2}
                        fill={hoveredSeatId === seat.id ? voteColorsHover[seat.vote] : voteColors[seat.vote]}
                        className="cursor-pointer"
                        style={{ transition: "fill 0.2s ease" }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: idx * 0.005, duration: 0.2 }}
                        onMouseEnter={(e: any) => handleMouseEnter(seat, e)}
                        onMouseLeave={handleMouseLeave}
                    />
                ))}
            </svg>

            {/* Tooltip - positioned relative to container */}
            <AnimatePresence>
                {hoveredSeat && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute z-10 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg shadow-lg pointer-events-none whitespace-nowrap"
                        style={{
                            left: Math.min(tooltipPos.x + 10, 250),
                            top: Math.max(tooltipPos.y - 40, 0),
                        }}
                    >
                        <div className="font-semibold">{hoveredSeat.name}</div>
                        <div className="text-slate-300 capitalize">
                            {hoveredSeat.vote === "approve" && t("approve")}
                            {hoveredSeat.vote === "disapprove" && t("disapprove")}
                            {hoveredSeat.vote === "abstain" && t("abstain")}
                            {hoveredSeat.vote === "no_vote" && t("noVote")}
                            {hoveredSeat.vote === "other" && t("otherParties")}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}


