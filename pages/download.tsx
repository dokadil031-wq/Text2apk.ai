import React, { useEffect, useState } from 'react';
import { Download, CheckCircle2, ArrowRight, Smartphone, FileBox, AlertTriangle, Clock } from 'lucide-react';
import { useLocation, useRoute } from 'wouter';
import { verifySecureToken, getTimeRemaining } from '../services/secureStorage';

export default function DownloadPage({ params }: { params: { token: string } }) {
  const [, setLocation] = useLocation();
  const [valid, setValid] = useState<boolean | null>(null);
  const [apkPath, setApkPath] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    // 1. Verify Token
    if (!params?.token) {
        setValid(false);
        setErrorMsg("No download token provided.");
        return;
    }

    const { isValid, path, error } = verifySecureToken(params.token);

    if (isValid && path) {
        setValid(true);
        setApkPath(path);
        setTimeLeft(getTimeRemaining(params.token));
    } else {
        setValid(false);
        setErrorMsg(error || "Invalid download link.");
    }
  }, [params?.token]);

  const handleDownload = () => {
    // In a real app, this would hit GET /download/:token
    alert(`Securely downloading from: ${apkPath}\n\nToken verified.`);
  };

  if (valid === false) {
     return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 animate-in fade-in duration-500">
           <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center max-w-lg w-full">
               <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
               <h2 className="text-2xl font-bold text-white mb-2">Download Unavailable</h2>
               <p className="text-slate-400 mb-6">{errorMsg}</p>
               <button 
                onClick={() => setLocation('/')}
                className="px-6 py-3 bg-[#1e1e1e] hover:bg-[#2d2d2d] text-white border border-slate-700 rounded-lg transition-colors"
               >
                Build New App
               </button>
           </div>
        </div>
     );
  }

  if (valid === null) {
      return <div className="min-h-[60vh] flex items-center justify-center text-slate-500">Verifying security token...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 animate-in zoom-in-95 duration-500">
      
      <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden max-w-4xl w-full">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Smartphone className="w-48 h-48" />
        </div>
        
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mb-6 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        
        <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Build Successful</h2>
        <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
           The Android application has been successfully compiled, signed, and packaged.
        </p>

        {/* Security Warning */}
        <div className="flex items-center justify-center gap-2 text-amber-400 bg-amber-400/10 px-4 py-2 rounded-full mb-8 text-sm w-fit mx-auto border border-amber-400/20">
           <Clock className="w-4 h-4" />
           <span>Link expires in {timeLeft}. Auto-deletion scheduled.</span>
        </div>

        {/* File Card */}
        <div className="bg-[#1e1e1e] border border-slate-700 rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between max-w-2xl mx-auto w-full shadow-lg gap-4">
          <div className="flex items-center gap-4 w-full">
            <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileBox className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="flex-1 text-left overflow-hidden">
                <div className="text-white font-mono text-sm truncate" title={apkPath || 'app-release.apk'}>
                    {apkPath ? apkPath.split('/').pop() : 'app-release.apk'}
                </div>
                <div className="text-slate-500 text-xs font-mono truncate mt-1" title={apkPath}>
                    {apkPath || 'Generating path...'}
                </div>
            </div>
          </div>
          <div className="text-slate-400 text-xs whitespace-nowrap bg-slate-800/50 px-3 py-1 rounded">
            14.2 MB
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <button 
            onClick={handleDownload}
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-xl font-bold text-lg flex items-center gap-3 shadow-xl hover:shadow-emerald-500/20 transition-all w-full md:w-auto justify-center"
          >
            <Download className="w-5 h-5" />
            Download APK
          </button>
          
          <button 
            onClick={() => setLocation('/')}
            className="px-8 py-4 bg-[#1e1e1e] hover:bg-[#2d2d2d] text-white border border-slate-700 rounded-xl font-medium flex items-center gap-2 transition-all w-full md:w-auto justify-center"
          >
            Create Another App
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}