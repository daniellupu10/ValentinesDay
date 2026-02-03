"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { EvadingButton } from "@/components/EvadingButton";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Stars } from "lucide-react";

export default function ValentinePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const [request, setRequest] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [accepted, setAccepted] = useState(false);

    useEffect(() => {
        async function fetchRequest() {
            const { data, error } = await supabase
                .from("requests")
                .select("*")
                .eq("id", id)
                .single();

            if (data) setRequest(data);
            setLoading(false);
        }
        fetchRequest();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center font-bold animate-pulse">Summoning Cupid...</div>;
    if (!request) return <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center">Valentine not found 💔</div>;

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden text-center bg-[#030303] selection:bg-purple-500 selection:text-white">
            <div className="absolute inset-0 aurora-gradient pointer-events-none opacity-40" />

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white/20 blur-sm"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 4 + 1}px`,
                            height: `${Math.random() * 4 + 1}px`,
                            animation: `float ${Math.random() * 10 + 5}s infinite linear`
                        }}
                    />
                ))}
            </div>

            <AnimatePresence mode="wait">
                {!accepted ? (
                    <motion.div
                        key="question"
                        initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="z-10 max-w-4xl w-full"
                    >
                        <div className="mb-16">
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-purple-200 text-sm font-bold tracking-wider uppercase mb-8 shadow-[0_0_20px_rgba(168,85,247,0.1)]"
                            >
                                <Stars className="w-4 h-4" />
                                <span>Question from {request.sender_name}</span>
                            </motion.div>

                            <h1 className="font-serif text-7xl md:text-9xl mb-8 leading-[0.9] tracking-tighter text-white drop-shadow-2xl">
                                {request.recipient_name},<br />
                                will you be my<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 animate-pulse">
                                    Valentine?
                                </span>
                            </h1>
                        </div>

                        <div className="relative h-32 flex items-center justify-center gap-10">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setAccepted(true)}
                                className="px-16 py-6 bg-white text-black font-sans text-2xl rounded-full font-black shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:shadow-[0_0_80px_rgba(255,255,255,0.6)] hover:bg-white transition-all z-20"
                            >
                                YES!
                            </motion.button>

                            {/* The Trap */}
                            <div className="relative w-40 h-16 flex items-center justify-center">
                                <EvadingButton mode={request.evasion_mode as any}>
                                    No
                                </EvadingButton>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="z-10 text-center"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 10, -10, 0]
                            }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="inline-block mb-8 relative"
                        >
                            <div className="absolute inset-0 bg-red-500 blur-3xl opacity-50 animate-pulse" />
                            <Heart className="w-40 h-40 text-red-500 fill-red-500 relative z-10" />
                        </motion.div>
                        <h1 className="font-serif text-7xl md:text-8xl mb-6 font-bold tracking-tighter">
                            It's a Date!
                        </h1>
                        <p className="text-2xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
                            Acceptance confirmed. {request.sender_name} is currently doing a happy dance.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
