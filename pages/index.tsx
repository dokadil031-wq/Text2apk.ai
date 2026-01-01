import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Zap, CheckCircle2, MessageSquare } from 'lucide-react';

export default function IndexPage() {
  // Initialize state from localStorage if available
  const [prompt, setPrompt] = useState(() => localStorage.getItem('userPrompt') || '');
  const [, setLocation] = useLocation();

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    // Clear any previous chat spec to ensure we generate fresh from this prompt
    localStorage.removeItem('text2apk_spec');
    localStorage.setItem('userPrompt', prompt);
    setLocation('/build');
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-24 animate-in fade-in duration-500 max-w-7xl mx-auto px-4">
      <div className="text-center max-w-3xl px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
          Text to APK
        </h1>
        <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          Describe your dream Android app in plain English, and our AI architecture engine will write the code, compile it, and deliver a ready-to-install APK in seconds.
        </p>
      </div>

      <div className="w-full max-w-2xl px-4">
        <div className="bg-[#1e1e1e] p-2 rounded-2xl border border-slate-700 shadow-2xl relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative flex flex-col gap-2">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your app... (e.g., A fitness tracker with a dark theme that counts steps and logs water intake)"
              className="w-full bg-[#1e1e1e] text-slate-100 p-4 rounded-xl resize-none outline-none border-none placeholder:text-slate-600 text-lg min-h-[160px]"
              onKeyDown={(e) => {
                if(e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                }
              }}
            />
            <div className="flex justify-between items-center p-2 bg-[#252526] rounded-xl">
               <button 
                  onClick={() => setLocation('/chat')}
                  className="px-4 py-3 rounded-lg font-medium text-slate-400 hover:text-white flex items-center gap-2 hover:bg-slate-700 transition-colors"
               >
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">Try Chat Builder</span>
                  <span className="sm:hidden">Chat</span>
               </button>

              <button
                onClick={handleSubmit}
                disabled={!prompt.trim()}
                className={`px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-all transform active:scale-95 ${
                  !prompt.trim()
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-900 shadow-lg hover:shadow-emerald-500/25'
                }`}
              >
                <Zap className="w-5 h-5 fill-slate-900" />
                <span>Build My App</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center gap-8 text-slate-500 text-sm font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Native Kotlin</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Production Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Instant Build</span>
          </div>
        </div>
      </div>
    </div>
  );
}
