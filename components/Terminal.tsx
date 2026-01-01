import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Terminal as TerminalIcon } from 'lucide-react';

interface TerminalProps {
  logs: LogEntry[];
}

export const Terminal: React.FC<TerminalProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] rounded-lg border border-slate-700 overflow-hidden shadow-2xl">
      <div className="flex items-center px-4 py-2 bg-[#2d2d2d] border-b border-black/50">
        <TerminalIcon className="w-4 h-4 text-emerald-400 mr-2" />
        <span className="text-xs font-mono text-slate-300">build_output.log</span>
      </div>
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto font-mono text-xs md:text-sm space-y-1"
      >
        {logs.length === 0 && (
          <span className="text-slate-500 italic">Waiting for build process...</span>
        )}
        {logs.map((log) => (
          <div key={log.id} className="flex">
            <span className="text-slate-500 mr-3 select-none">[{log.timestamp}]</span>
            <span className={`${
              log.type === 'error' ? 'text-red-500' :
              log.type === 'success' ? 'text-emerald-400' :
              log.type === 'warning' ? 'text-yellow-400' :
              'text-slate-300'
            }`}>
              {log.type === 'info' && '> '}
              {log.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};