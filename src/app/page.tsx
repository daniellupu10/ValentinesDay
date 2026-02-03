"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { EvadingButton } from "@/components/EvadingButton";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Stars, Ghost, Footprints, Shuffle, Loader, Copy, Check, RotateCw, Minimize2, Activity } from "lucide-react";

// --- TYPES ---
interface ValentineRequest {
  id: string;
  sender_name: string;
  recipient_name: string;
  evasion_mode: string;
}

// --- COMPONENTS ---

function ValentineView({ id }: { id: string }) {
  const [request, setRequest] = useState<ValentineRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    async function fetchRequest() {
      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setRequest(data as ValentineRequest);
      }
      setLoading(false);
    }
    fetchRequest();
  }, [id]);

  if (loading) return <div className="min-h-screen text-white flex items-center justify-center font-bold animate-pulse">Summoning Cupid...</div>;
  if (!request) return <div className="min-h-screen text-white flex items-center justify-center">{"Valentine not found 💔"}</div>;

  return (
    <div className="z-10 max-w-4xl w-full">
      <AnimatePresence mode="wait">
        {!accepted ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: "circOut" }}
          >
            <div className="mb-16">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-slate-200 text-sm font-bold tracking-wider uppercase mb-8 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
              >
                <Stars className="w-4 h-4" />
                <span>Question from {request.sender_name}</span>
              </motion.div>

              <h1 className="font-serif text-5xl md:text-8xl mb-8 leading-[0.9] tracking-tighter text-white drop-shadow-2xl">
                {request.recipient_name},<br />
                will you be my<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E6C200] via-[#B87333] to-[#82783C] animate-pulse">
                  Valentine?
                </span>
              </h1>
            </div>

            <div className="relative h-32 flex items-center justify-center gap-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAccepted(true)}
                className="px-12 py-5 bg-white text-black font-sans text-xl rounded-full font-black shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:shadow-[0_0_80px_rgba(255,255,255,0.6)] hover:bg-white transition-all z-20"
              >
                YES!
              </motion.button>

              <div className="relative w-40 h-16 flex items-center justify-center">
                <EvadingButton mode={request.evasion_mode}>
                  {"No"}
                </EvadingButton>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
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
              <Heart className="w-32 h-32 text-red-500 fill-red-500 relative z-10" />
            </motion.div>
            <h1 className="font-serif text-6xl md:text-7xl mb-6 font-bold tracking-tighter bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
              {"It's a Date!"}
            </h1>
            <p className="text-xl text-slate-400 font-light max-w-xl mx-auto leading-relaxed">
              Acceptance confirmed. {request.sender_name} is currently doing a happy dance.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateView() {
  const [loading, setLoading] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    recipient_name: "",
    sender_name: "",
    evasion_mode: "run_away",
  });

  const modes = [
    { id: "run_away", name: "Run Away", icon: Footprints },
    { id: "teleport", name: "Teleport", icon: Shuffle },
    { id: "ghost", name: "Ghost", icon: Ghost },
    { id: "spin", name: "Spin", icon: RotateCw },
    { id: "shrink", name: "Shrink", icon: Minimize2 },
    { id: "bounce", name: "Bounce", icon: Activity },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase
      .from("requests")
      .insert([formData])
      .select()
      .single();

    if (error) {
      alert("Error: " + error.message);
      setLoading(false);
      return;
    }

    // Static Friendly Link: Use Query Param instead of Path
    const link = `${window.location.origin}${window.location.pathname}?v=${data.id}`;
    setCreatedLink(link);
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (createdLink) {
      navigator.clipboard.writeText(createdLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="z-10 w-full max-w-xl animate-float">
      <h1 className="font-serif text-5xl md:text-7xl text-center mb-4 tracking-tighter bg-gradient-to-br from-white via-white to-white/50 bg-clip-text text-transparent font-bold">
        Be Lovable.
      </h1>
      <p className="text-center text-slate-400 mb-12 text-lg font-medium">
        Create the perfect, impossible-to-reject Valentine.
      </p>

      {!createdLink ? (
        <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl space-y-8">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Recipient</label>
              <input
                type="text"
                required
                className="lovable-input"
                placeholder="Who is looking lovely today?"
                value={formData.recipient_name}
                onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Your Name</label>
              <input
                type="text"
                required
                className="lovable-input"
                placeholder="Who is asking?"
                value={formData.sender_name}
                onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Evasion Tactic</label>
            <div className="grid grid-cols-3 gap-3">
              {modes.map((mode) => (
                <div
                  key={mode.id}
                  onClick={() => setFormData({ ...formData, evasion_mode: mode.id })}
                  className={`cursor-pointer p-3 rounded-xl border transition-all flex flex-col items-center text-center gap-1 hover:scale-105 active:scale-95 ${formData.evasion_mode === mode.id
                    ? "bg-[#82783C]/20 border-[#82783C]/50 shadow-[0_0_20px_rgba(130,120,60,0.2)]"
                    : "bg-white/5 border-white/5 hover:bg-white/10"
                    }`}
                >
                  <mode.icon className={`w-5 h-5 ${formData.evasion_mode === mode.id ? "text-[#E6C200]" : "text-slate-400"}`} />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">{mode.name}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#82783C] to-[#B87333] text-white font-bold text-lg hover:brightness-110 transition-all shadow-[0_0_20px_rgba(184,115,51,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-white/10"
          >
            {loading && <Loader className="animate-spin w-5 h-5" />}
            {loading ? "Generating Magic..." : "Create Valentine URL"}
          </button>
        </form>
      ) : (
        <div className="glass-card p-8 rounded-2xl space-y-6 text-center animate-in fade-in zoom-in duration-500">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#E6C200] to-[#B87333] bg-clip-text text-transparent">{"It's Ready! 💖"}</h2>
          <p className="text-slate-400">Send this link to {formData.recipient_name} and watch them struggle to say no.</p>

          <div className="relative group">
            <input
              readOnly
              value={createdLink}
              className="lovable-input pr-12 text-center text-[#E6C200] font-mono text-sm border-[#82783C]/30 focus:border-[#82783C]/50"
            />
            <button
              onClick={copyToClipboard}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-md transition-colors text-slate-400 hover:text-white"
            >
              {copied ? <Check className="w-5 h-5 text-[#82783C]" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <button
              onClick={() => { setCreatedLink(null); setFormData(prev => ({ ...prev, recipient_name: "" })); }}
              className="text-sm text-slate-500 hover:text-white transition-colors"
            >
              Create Another
            </button>
            <a
              href={createdLink}
              className="text-sm text-[#B87333] hover:text-[#E6C200] font-bold transition-colors"
            >
              Test it yourself →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function MainContent() {
  const searchParams = useSearchParams();
  const vId = searchParams.get("v");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden text-white">
      {vId ? <ValentineView id={vId} /> : <CreateView />}
    </main>
  );
}

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center animate-pulse">Summoning Cupid...</div>}>
      <MainContent />
    </Suspense>
  );
}
