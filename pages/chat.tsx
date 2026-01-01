import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Send, Zap, Bot, User, ArrowLeft, Loader2 } from 'lucide-react';
import { sendMessageToArchitect, resetChat } from '../services/geminiService';
import { AppSpecification, ChatMessage } from '../types';
import { AppPreview } from '../components/AppPreview';

export default function ChatPage() {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentSpec, setCurrentSpec] = useState<AppSpecification | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset chat on mount
    resetChat();
    // Initial greeting
    setMessages([{
        role: 'model',
        text: "Hi! I'm your AI Android Architect. Describe the app you want to build, and I'll design it for you in real-time."
    }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
        const response = await sendMessageToArchitect(userMsg, currentSpec || undefined);
        
        setMessages(prev => [...prev, { role: 'model', text: response.reply }]);
        setCurrentSpec(response.spec);
    } catch (e) {
        setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error connecting to the architect." }]);
    } finally {
        setLoading(false);
    }
  };

  const handleBuild = () => {
      if (!currentSpec) return;
      // Save full spec to local storage to be picked up by BuildPage
      localStorage.setItem('text2apk_spec', JSON.stringify(currentSpec));
      // Also save the last prompt for fallback/display
      localStorage.setItem('userPrompt', `Generated via Chat: ${currentSpec.app_name}`);
      setLocation('/build');
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-900 animate-in fade-in duration-500">
       
       {/* Left: Chat Area */}
       <div className="flex-1 flex flex-col border-r border-slate-800 max-w-2xl mx-auto w-full bg-[#0f172a]">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur">
             <div className="flex items-center gap-3">
                <button onClick={() => setLocation('/')} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h2 className="text-white font-bold">Architect Chat</h2>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs text-emerald-400">Online</span>
                    </div>
                </div>
             </div>
             {currentSpec && (
                 <button 
                   onClick={handleBuild}
                   className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                 >
                    <Zap className="w-4 h-4 fill-slate-900" />
                    Build Now
                 </button>
             )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
             {messages.map((msg, idx) => (
                 <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                     {msg.role === 'model' && (
                         <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                             <Bot className="w-5 h-5 text-emerald-400" />
                         </div>
                     )}
                     <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                         msg.role === 'user' 
                         ? 'bg-emerald-600 text-white rounded-tr-none' 
                         : 'bg-[#1e293b] text-slate-200 rounded-tl-none border border-slate-700'
                     }`}>
                         {msg.text}
                     </div>
                     {msg.role === 'user' && (
                         <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                             <User className="w-5 h-5 text-slate-300" />
                         </div>
                     )}
                 </div>
             ))}
             {loading && (
                 <div className="flex gap-4">
                     <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                         <Bot className="w-5 h-5 text-emerald-400" />
                     </div>
                     <div className="bg-[#1e293b] px-4 py-3 rounded-2xl rounded-tl-none border border-slate-700 flex items-center gap-2">
                         <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                         <span className="text-slate-400 text-xs">Thinking...</span>
                     </div>
                 </div>
             )}
             <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-800 bg-slate-900">
              <div className="relative">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message to refine your app..."
                    className="w-full bg-[#1e293b] text-white pl-4 pr-12 py-3.5 rounded-xl border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-500"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    className="absolute right-2 top-2 p-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-lg transition-colors disabled:opacity-50 disabled:bg-slate-700 disabled:text-slate-500"
                  >
                      <Send className="w-5 h-5" />
                  </button>
              </div>
          </div>
       </div>

       {/* Right: Live Preview (Hidden on mobile) */}
       <div className="hidden lg:flex w-[400px] border-l border-slate-800 bg-[#020617] flex-col items-center justify-center p-6 relative">
          <div className="absolute top-6 left-6 text-slate-500 font-medium text-sm uppercase tracking-wider">Live Preview</div>
          <div className="w-full flex-1 flex items-center justify-center">
             {currentSpec ? (
                 <AppPreview spec={currentSpec} />
             ) : (
                 <div className="text-center text-slate-500 space-y-4">
                     <div className="w-20 h-20 bg-slate-800 rounded-full mx-auto flex items-center justify-center">
                         <Zap className="w-10 h-10 text-slate-600" />
                     </div>
                     <p className="max-w-[200px]">Start chatting to see your app visualization update in real-time.</p>
                 </div>
             )}
          </div>
          {currentSpec && (
             <div className="w-full mt-6 bg-[#1e1e1e] p-4 rounded-xl border border-slate-800">
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Detected Specification</h3>
                <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                        <span className="text-slate-500">Name:</span>
                        <span className="text-emerald-400">{currentSpec.app_name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Theme:</span>
                        <span className="text-blue-400">{currentSpec.theme}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Screens:</span>
                        <span className="text-purple-400">{currentSpec.screens.length}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Offline:</span>
                        <span className={currentSpec.offline ? "text-green-400" : "text-slate-600"}>{currentSpec.offline ? 'Yes' : 'No'}</span>
                    </div>
                </div>
             </div>
          )}
       </div>

    </div>
  );
}
