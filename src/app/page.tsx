"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Ghost, Move, Footprints, Shuffle, Loader, Copy, Check, RotateCw, Minimize2, Activity } from "lucide-react";

export default function CreatePage() {
  const [loading, setLoading] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    recipient_name: "",
    sender_name: "",
    evasion_mode: "run_away",
  });

  const modes = [
    { id: "run_away", name: "Run Away", icon: Footprints, desc: "Flees from cursor" },
    { id: "teleport", name: "Teleport", icon: Shuffle, desc: "Instantly jumps" },
    { id: "ghost", name: "Ghost", icon: Ghost, desc: "Vanishes on hover" },
    { id: "spin", name: "Spin", icon: RotateCw, desc: "Spins uncontrollably" },
    { id: "shrink", name: "Shrink", icon: Minimize2, desc: "Gets tiny" },
    { id: "bounce", name: "Bounce", icon: Activity, desc: "Bounces around" },
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

    const link = `${window.location.origin}/${data.id}`;
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
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden text-white">

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
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Choose Evasion Tactic</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {modes.map((mode) => (
                  <div
                    key={mode.id}
                    onClick={() => setFormData({ ...formData, evasion_mode: mode.id })}
                    className={`cursor-pointer p-4 rounded-xl border transition-all flex flex-col items-center text-center gap-2 hover:scale-105 active:scale-95 ${formData.evasion_mode === mode.id
                      ? "bg-[#82783C]/20 border-[#82783C]/50 shadow-[0_0_20px_rgba(130,120,60,0.2)]"
                      : "bg-white/5 border-white/5 hover:bg-white/10"
                      }`}
                  >
                    <mode.icon className={`w-6 h-6 ${formData.evasion_mode === mode.id ? "text-[#E6C200]" : "text-slate-400"}`} />
                    <span className="text-sm font-bold">{mode.name}</span>
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
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#E6C200] to-[#B87333] bg-clip-text text-transparent">It's Ready! 💖</h2>
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
                target="_blank"
                className="text-sm text-[#B87333] hover:text-[#E6C200] font-bold transition-colors"
              >
                Test it yourself →
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
