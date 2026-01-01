import React, { useState } from 'react';
import { GeneratedFile } from '../types';
import { FileCode, FileJson, LayoutTemplate, Copy, Check } from 'lucide-react';

interface CodePreviewProps {
  files: GeneratedFile[];
}

export const CodePreview: React.FC<CodePreviewProps> = ({ files }) => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeFile = files[activeFileIndex];

  const handleCopy = () => {
    if (activeFile) {
      navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getIcon = (fileName: string) => {
    if (fileName.endsWith('.kt')) return <FileCode className="w-4 h-4 text-purple-400" />;
    if (fileName.endsWith('.xml')) return <LayoutTemplate className="w-4 h-4 text-orange-400" />;
    if (fileName.endsWith('.json')) return <FileJson className="w-4 h-4 text-yellow-400" />;
    return <FileJson className="w-4 h-4 text-blue-400" />;
  };

  if (!files || files.length === 0) return null;

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] rounded-lg border border-slate-700 overflow-hidden shadow-2xl w-full">
      {/* Tabs */}
      <div className="flex bg-[#252526] overflow-x-auto scrollbar-hide">
        {files.map((file, index) => (
          <button
            key={file.fileName}
            onClick={() => setActiveFileIndex(index)}
            className={`flex items-center px-4 py-3 text-xs md:text-sm border-r border-[#1e1e1e] hover:bg-[#2d2d2d] transition-colors whitespace-nowrap ${
              activeFileIndex === index 
                ? 'bg-[#1e1e1e] text-slate-100 border-t-2 border-t-emerald-500' 
                : 'text-slate-500'
            }`}
          >
            <span className="mr-2">{getIcon(file.fileName)}</span>
            {file.fileName}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex justify-end px-4 py-2 bg-[#1e1e1e] border-b border-slate-800">
         <button 
           onClick={handleCopy}
           className="flex items-center space-x-2 text-xs text-slate-400 hover:text-white transition-colors"
         >
           {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
           <span>{copied ? 'Copied' : 'Copy Content'}</span>
         </button>
      </div>

      {/* Code Area */}
      <div className="flex-1 overflow-auto bg-[#1e1e1e] p-4 min-h-[300px] max-h-[500px]">
        <pre className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
          <code>{activeFile?.content}</code>
        </pre>
      </div>
    </div>
  );
};