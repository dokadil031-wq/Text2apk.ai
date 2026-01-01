import React from 'react';
import { AppSpecification } from '../types';
import { Wifi, Battery, Signal, User, Lock, Menu, Plus } from 'lucide-react';

interface AppPreviewProps {
  spec: AppSpecification | null;
}

export const AppPreview: React.FC<AppPreviewProps> = ({ spec }) => {
  const isDark = spec?.theme?.toLowerCase().includes('dark') || false;
  const appName = spec?.app_name || 'My App';
  const screens = spec?.screens || [];
  
  // Heuristics for preview content
  const hasLogin = screens.some(s => s.toLowerCase().includes('login') || s.toLowerCase().includes('auth'));
  const hasList = screens.some(s => s.toLowerCase().includes('list') || s.toLowerCase().includes('note') || s.toLowerCase().includes('feed'));

  return (
    <div className="relative mx-auto border-slate-800 bg-slate-900 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl overflow-hidden flex flex-col">
      {/* Notch / Status Bar */}
      <div className="h-6 bg-slate-900 w-full absolute top-0 left-0 z-20 flex items-center justify-between px-6">
         <span className="text-[10px] text-white font-medium">9:41</span>
         <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3 text-white" />
            <Wifi className="w-3 h-3 text-white" />
            <Battery className="w-3 h-3 text-white" />
         </div>
      </div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-20"></div>

      {/* App Content */}
      <div className={`flex-1 mt-6 overflow-hidden flex flex-col relative transition-colors duration-500 ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>
         
         {/* App Bar */}
         <div className={`p-4 shadow-sm z-10 flex items-center justify-between ${isDark ? 'bg-slate-700' : 'bg-emerald-500 text-white'}`}>
            <div className="flex items-center gap-3">
               <Menu className="w-5 h-5" />
               <span className="font-bold text-sm truncate w-32">{appName}</span>
            </div>
            {spec?.offline && <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse" title="Offline Capable" />}
         </div>

         {/* Body Mockup */}
         <div className="flex-1 p-4 overflow-y-auto space-y-4">
            
            {/* If spec has login, show a mock login form first */}
            {hasLogin && (
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex justify-center mb-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDark ? 'bg-slate-600' : 'bg-emerald-100'}`}>
                            <User className={`w-6 h-6 ${isDark ? 'text-slate-400' : 'text-emerald-500'}`} />
                        </div>
                    </div>
                    <div className={`h-2 w-full rounded mb-2 ${isDark ? 'bg-slate-600' : 'bg-slate-200'}`} />
                    <div className={`h-2 w-2/3 rounded mb-4 ${isDark ? 'bg-slate-600' : 'bg-slate-200'}`} />
                    <div className="w-full h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">Sign In</div>
                </div>
            )}

            {/* Mock List Items */}
            {hasList ? (
                <>
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`p-3 rounded-lg border flex items-center gap-3 ${isDark ? 'border-slate-700 bg-slate-700/50' : 'border-slate-100 bg-slate-50'}`}>
                       <div className={`w-10 h-10 rounded-md ${isDark ? 'bg-slate-600' : 'bg-slate-200'}`} />
                       <div className="flex-1 space-y-2">
                          <div className={`h-2 w-3/4 rounded ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`} />
                          <div className={`h-2 w-1/2 rounded ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`} />
                       </div>
                    </div>
                  ))}
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-32 text-center opacity-50">
                   <div className="text-xs">Your Content Here</div>
                </div>
            )}

         </div>

         {/* FAB */}
         <div className="absolute bottom-6 right-6">
            <div className="w-12 h-12 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/40 flex items-center justify-center text-white">
                <Plus className="w-6 h-6" />
            </div>
         </div>

      </div>

      {/* Bottom Nav Mockup (Optional) */}
      <div className={`h-12 border-t flex items-center justify-around px-2 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="w-8 h-1 rounded-full bg-slate-500/20"></div>
          <div className="w-8 h-1 rounded-full bg-slate-500/20"></div>
          <div className="w-8 h-1 rounded-full bg-slate-500/20"></div>
      </div>
    </div>
  );
};
