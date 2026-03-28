import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { TruthGapResult } from "@/src/types";
import { cn } from "@/src/lib/utils";

export default function Chat() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: "Hello, I'm Sathi. I'm here to listen and support you. How are you feeling right now?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [truthGap, setTruthGap] = useState<TruthGapResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput("");
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      // Analyze Truth Gap in parallel
      analyzeTruthGap(userMsg, ai);

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `
          You are "Sathi", a compassionate mental health assistant. 
          The user says: "${userMsg}"
          Provide a supportive, empathetic response. Keep it brief and encouraging.
          If the user seems in high distress, gently suggest professional help.
        `
      });
      
      setMessages(prev => [...prev, { role: 'ai', text: response.text || "I'm here for you." }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "I'm sorry, I'm having a bit of trouble connecting. But I'm still here for you." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const analyzeTruthGap = async (text: string, ai: GoogleGenAI) => {
    setIsAnalyzing(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `
          Analyze the "Truth Gap" for a mental health context.
          User says: "${text}"
          User's observed behavior/context: "User is interacting with a mental health chatbot."
          
          Identify if there's a mismatch between what they say and how they might be feeling.
          Provide:
          1. Risk Level (Low, Medium, High)
          2. Insight (Why is there a gap?)
          3. Suggested Action (What should the platform suggest?)
          
          Return ONLY JSON format: { "riskLevel": "Low" | "Medium" | "High", "insight": string, "suggestedAction": string }
        `,
        config: {
          responseMimeType: "application/json"
        }
      });

      const data = JSON.parse(response.text || "{}");
      setTruthGap(data);
    } catch (error) {
      console.error("Analysis Error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] pt-20 pb-24 px-4 flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col gap-6">
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5A5A40] flex items-center justify-center text-white">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="font-serif text-2xl text-[#5A5A40]">AI Sathi</h1>
              <p className="text-xs text-[#5A5A40]/60">Always here to listen</p>
            </div>
          </div>
          
          {truthGap && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                truthGap.riskLevel === 'High' ? 'bg-red-100 text-red-600' : 
                truthGap.riskLevel === 'Medium' ? 'bg-orange-100 text-orange-600' : 
                'bg-green-100 text-green-600'
              }`}
            >
              <AlertCircle size={14} />
              Truth Gap: {truthGap.riskLevel}
            </motion.div>
          )}
        </header>

        {/* Chat Area */}
        <div className="flex-1 bg-white rounded-[40px] shadow-sm border border-[#5A5A40]/10 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={cn(
                  "max-w-[80%] p-4 rounded-[24px]",
                  msg.role === 'user' 
                    ? "bg-[#5A5A40] text-white rounded-tr-none" 
                    : "bg-[#f5f5f0] text-[#5A5A40] rounded-tl-none"
                )}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#f5f5f0] p-4 rounded-[24px] rounded-tl-none flex gap-1">
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-[#5A5A40] rounded-full" />
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-[#5A5A40] rounded-full" />
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-[#5A5A40] rounded-full" />
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-[#5A5A40]/5 bg-[#f5f5f0]/30">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="w-full p-4 pr-14 rounded-full bg-white border-none focus:ring-2 focus:ring-[#5A5A40]/20 text-[#5A5A40]"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="absolute right-2 w-10 h-10 bg-[#5A5A40] text-white rounded-full flex items-center justify-center hover:bg-[#4A4A30] transition-all disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Analysis Insight */}
        <AnimatePresence>
          {truthGap && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white p-6 rounded-[32px] border border-[#5A5A40]/10 shadow-sm space-y-2"
            >
              <div className="flex items-center gap-2 text-[#5A5A40] font-serif text-lg italic">
                <Sparkles size={18} /> Sathi's Insight
              </div>
              <p className="text-sm text-[#5A5A40]/70">{truthGap.insight}</p>
              <div className="pt-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#5A5A40]/40">Recommendation</span>
                <p className="text-sm font-medium text-[#5A5A40]">{truthGap.suggestedAction}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
