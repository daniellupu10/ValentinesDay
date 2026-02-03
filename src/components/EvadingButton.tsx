"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

type EvasionMode =
    | "run_away"
    | "teleport"
    | "ghost"
    | "mirror"
    | "spin"
    | "shrink"
    | "bounce"
    | "broken";

interface EvadingButtonProps {
    mode: string;
    children: React.ReactNode;
    onSafeClick?: () => void;
}

export function EvadingButton({ mode, children, onSafeClick }: EvadingButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);
    const [scale, setScale] = useState(1);
    const [opacity, setOpacity] = useState(1);

    // Store layout constraints
    const bounds = useRef({ minX: -50, maxX: 50, minY: -50, maxY: 50 });

    // Update bounds on mount/resize (ONLY)
    useEffect(() => {
        const updateBounds = () => {
            if (buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                // Important: We assume x,y are stable for optimal bounds calculation
                // This component is absolutely positioned relative to a small container in the main page.
                // We want to calculate the translation limits relative to the viewport.

                const padding = 50;
                const winW = window.innerWidth;
                const winH = window.innerHeight;

                // To be safe, we subtract the current X/Y just in case a re-render happens while moving.
                const layoutLeft = rect.left - position.x;
                const layoutTop = rect.top - position.y;
                const layoutRight = rect.right - position.x;
                const layoutBottom = rect.bottom - position.y;

                bounds.current = {
                    minX: padding - layoutLeft,
                    maxX: winW - padding - layoutRight,
                    minY: padding - layoutTop,
                    maxY: winH - padding - layoutBottom
                };
            }
        };

        // Defer slightly to ensure layout stability
        const timer = setTimeout(updateBounds, 100);
        window.addEventListener('resize', updateBounds);
        return () => {
            window.removeEventListener('resize', updateBounds);
            clearTimeout(timer);
        };
    }, []); // Empty dependency array = calculate only on mount (stable layout)

    const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

    const handleMouseMove = (e: MouseEvent) => {
        if (!buttonRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const buttonCenter = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        };

        const dist = Math.hypot(e.clientX - buttonCenter.x, e.clientY - buttonCenter.y);
        const threshold = 300; // Increased radius (Force Field)

        if (dist < threshold) {
            // --- MOVEMENT MODES: VECTOR FIELD APPROACH ---
            if (mode === "run_away" || mode === "bounce" || mode === "spin" || mode === "mirror") {
                // 1. Repulsive Force from Cursor
                // Vector from Cursor -> Button
                let vecX = buttonCenter.x - e.clientX; // Points AWAY from cursor
                let vecY = buttonCenter.y - e.clientY;

                // Normalize
                const mag = Math.hypot(vecX, vecY);
                if (mag > 0) {
                    vecX /= mag;
                    vecY /= mag;
                }

                // 2. Repulsive Force from Walls (The "Don't get cornered" logic)
                // If the button is near a layout boundary, push it AWAY from that boundary.
                const relX = position.x;
                const relY = position.y;

                // Distance to Left Limit (minX is negative, so diff is relX - minX)
                const distLeft = relX - bounds.current.minX;
                const distRight = bounds.current.maxX - relX;
                const distTop = relY - bounds.current.minY;
                const distBottom = bounds.current.maxY - relY;

                // Strong Wall Repulsion Weight
                const wallStrength = 2.5;
                const wallThreshold = 150; // Start pushing back early

                if (distLeft < wallThreshold) vecX += (1 - distLeft / wallThreshold) * wallStrength;
                if (distRight < wallThreshold) vecX -= (1 - distRight / wallThreshold) * wallStrength;
                if (distTop < wallThreshold) vecY += (1 - distTop / wallThreshold) * wallStrength;
                if (distBottom < wallThreshold) vecY -= (1 - distBottom / wallThreshold) * wallStrength;

                // 3. Re-normalize and Apply Speed
                // This resultant vector now points away from cursor AND away from walls
                const finalMag = Math.hypot(vecX, vecY);
                if (finalMag > 0) {
                    vecX /= finalMag;
                    vecY /= finalMag;
                }

                // Dynamic Speed based on cursor proximity
                const urgency = Math.max(1, (threshold - dist) / 40);
                const speed = (mode === "bounce" ? 100 : 70) * urgency;

                // Apply movement
                if (mode === "mirror") {
                    // Perpendicular deflection (90 deg rotation)
                    const temp = vecX;
                    vecX = -vecY;
                    vecY = temp;
                }
                if (mode === "bounce") {
                    vecX += (Math.random() - 0.5) * 0.8;
                    vecY += (Math.random() - 0.5) * 0.8;
                }

                const newX = clamp(position.x + vecX * speed, bounds.current.minX, bounds.current.maxX);
                const newY = clamp(position.y + vecY * speed, bounds.current.minY, bounds.current.maxY);

                setPosition({ x: newX, y: newY });
                if (mode === "spin") setRotation(prev => prev + 180 + urgency * 10);
            }

            // --- INSTANT MODES (Trigger on proximity) ---
            if (mode === "teleport" || mode === "broken") {
                const spanX = bounds.current.maxX - bounds.current.minX;
                const spanY = bounds.current.maxY - bounds.current.minY;
                const randomX = bounds.current.minX + Math.random() * spanX;
                const randomY = bounds.current.minY + Math.random() * spanY;
                setPosition({ x: randomX, y: randomY });
            }

            if (mode === "ghost" && opacity > 0.5) {
                setOpacity(0);
                setTimeout(() => {
                    const spanX = bounds.current.maxX - bounds.current.minX;
                    const spanY = bounds.current.maxY - bounds.current.minY;
                    const randomX = bounds.current.minX + Math.random() * spanX;
                    const randomY = bounds.current.minY + Math.random() * spanY;
                    setPosition({ x: randomX, y: randomY });
                    setOpacity(1);
                }, 250);
            }

            if (mode === "shrink") {
                setScale(prev => Math.max(0.01, prev - 0.1));
                const newX = clamp(position.x + (Math.random() - 0.5) * 30, bounds.current.minX, bounds.current.maxX);
                setPosition(prev => ({ ...prev, x: newX }));
            }

        } else {
            if (mode === "shrink" && dist > 350) setScale(1);
        }
    };

    // Keep fallback for super fast movements or touch cases
    const handleHover = () => {
        if (mode === "ghost" && opacity > 0.5) {
            setOpacity(0);
            setTimeout(() => {
                const spanX = bounds.current.maxX - bounds.current.minX;
                const spanY = bounds.current.maxY - bounds.current.minY;
                const randomX = bounds.current.minX + Math.random() * spanX;
                const randomY = bounds.current.minY + Math.random() * spanY;
                setPosition({ x: randomX, y: randomY });
                setOpacity(1);
            }, 250);
        }
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    });

    return (
        <motion.button
            ref={buttonRef}
            animate={{
                x: position.x,
                y: position.y,
                opacity: opacity,
                rotate: rotation,
                scale: scale,
            }}
            onMouseEnter={handleHover}
            onMouseLeave={() => { }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 40 // Higher damping prevents overshooting bounds
            }}
            className="px-8 py-3 bg-red-500/10 text-red-500 rounded-full border border-red-500/50 hover:bg-red-500/20 transition-colors font-bold cursor-not-allowed absolute whitespace-nowrap z-50 shadow-[0_0_15px_rgba(239,68,68,0.3)] backdrop-blur-md"
            style={{ pointerEvents: opacity < 0.2 || scale < 0.2 ? "none" : "auto" }}
            // Safe click will likely never trigger unless you are extremely fast
            onClick={onSafeClick}
        >
            {children}
        </motion.button>
    );
}
