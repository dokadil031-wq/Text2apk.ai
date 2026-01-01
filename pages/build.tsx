import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { Smartphone, AlertCircle, ArrowRight, Check, Play, Terminal as TerminalIcon, Lock, Crown } from 'lucide-react';
import { generateAppSpecification } from '../services/geminiService';
import { generateAndroidProject } from '../services/templateEngine';
import { createSecureToken } from '../services/secureStorage';
import { checkDailyLimit, incrementUsage, getUserPlan } from '../services/usageService';
import { saveBuildToHistory } from '../services/historyService';
import { CodePreview } from '../components/CodePreview';
import { Terminal } from '../components/Terminal';
import { AppSpecification, GeneratedFile, LogEntry, BuildStatus, PlanType } from '../types';

export default function BuildPage() {
  const [, setLocation] = useLocation();
  const [spec, setSpec] = useState<AppSpecification | null>(null);
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userPlan = getUserPlan();
  
  // Build State
  const [buildStatus, setBuildStatus] = useState<BuildStatus>(BuildStatus.IDLE);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logsRef = useRef<LogEntry[]>([]);

  useEffect(() => {
    async function processGeneration() {
      // 1. Check Usage Limits BEFORE generating anything
      if (!checkDailyLimit()) {
         setError("Daily build limit reached for Free Plan.");
         setLoading(false);
         return;
      }

      // 2. Check for Pre-defined Spec (from Chat) OR Raw Prompt (from Home)
      const chatSpecRaw = localStorage.getItem('text2apk_spec');
      const prompt = localStorage.getItem('userPrompt');

      if (!chatSpecRaw && !prompt) {
        setError("No prompt found. Please go back and describe your app.");
        setLoading(false);
        return;
      }

      try {
        let data: AppSpecification;

        if (chatSpecRaw) {
             // Use pre-built spec from Chat
             console.log("Using pre-defined spec from Chat");
             data = JSON.parse(chatSpecRaw);
             // Clear it so subsequent builds from home don't reuse it by mistake
             localStorage.removeItem('text2apk_spec');
        } else {
             // Generate from prompt
             console.log("Generating spec from prompt");
             data = await generateAppSpecification(prompt!);
        }

        setSpec(data);
        // Pass user plan to template engine to enforce features/restrictions
        const files = generateAndroidProject(data, userPlan);
        setGeneratedFiles(files);
      } catch (err: any) {
        setError(err.message || "Failed to generate app specification.");
      } finally {
        setLoading(false);
      }
    }

    processGeneration();
  }, []);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      message,
      type
    };
    logsRef.current = [...logsRef.current, newLog];
    setLogs([...logsRef.current]);
  };

  const startBuild = async () => {
    if (!spec) return;

    // Double check limit at start of build action
    if (!checkDailyLimit()) {
        alert("Daily limit reached. Please upgrade to Pro.");
        setLocation('/pricing');
        return;
    }

    setBuildStatus(BuildStatus.GENERATING_CODE);
    const appId = Math.floor(Math.random() * 100000).toString();
    const buildPath = `/builds/app_${appId}`;

    // Simulation Sequence
    addLog(`Initializing build environment for ${spec.app_name}...`);
    addLog(`Plan detected: ${userPlan.toUpperCase()}`, 'info');

    if (userPlan === PlanType.FREE) {
        addLog(`[Free Plan] Offline support disabled.`, 'warning');
        addLog(`[Free Plan] Watermark injection enabled.`, 'warning');
    } else {
        addLog(`[Premium] Priority build queue activated.`, 'success');
    }

    await delay(userPlan === PlanType.FREE ? 800 : 300); // Faster for Pro/Agency
    
    addLog(`Creating project structure at ${buildPath}`, 'info');
    await delay(userPlan === PlanType.FREE ? 600 : 200);
    
    addLog(`Injecting ${generatedFiles.length} template files...`, 'info');
    generatedFiles.forEach(f => {
       if(Math.random() > 0.7) addLog(`Writing ${f.fileName}...`, 'info');
    });
    await delay(userPlan === PlanType.FREE ? 1000 : 400);

    setBuildStatus(BuildStatus.COMPILING);
    addLog(`Generating keystore: debug.keystore`, 'warning');
    await delay(userPlan === PlanType.FREE ? 500 : 200);
    
    addLog(`Executing: ./gradlew assembleRelease`, 'warning');
    addLog(`> Task :app:preBuild UP-TO-DATE`);
    addLog(`> Task :app:preReleaseBuild UP-TO-DATE`);
    await delay(userPlan === PlanType.FREE ? 800 : 300);
    addLog(`> Task :app:compileReleaseKotlin`);
    await delay(userPlan === PlanType.FREE ? 1200 : 500);
    addLog(`> Task :app:mergeReleaseResources`);
    await delay(userPlan === PlanType.FREE ? 800 : 300);
    addLog(`> Task :app:packageRelease`);
    addLog(`> Task :app:assembleRelease`);
    
    setBuildStatus(BuildStatus.SIGNING);
    addLog(`Signing APK with debug key...`, 'info');
    await delay(userPlan === PlanType.FREE ? 800 : 300);

    setBuildStatus(BuildStatus.COMPLETED);
    addLog(`BUILD SUCCESSFUL`, 'success');
    const apkPath = `${buildPath}/app/build/outputs/apk/release/app-release.apk`;
    addLog(`Output: ${apkPath}`, 'success');
    
    // Increment usage
    incrementUsage();

    // Generate secure token
    const token = createSecureToken(apkPath);
    addLog(`Secure Token Generated: ${token.substring(0, 8)}...`, 'info');

    // Save to History
    saveBuildToHistory({
      appName: spec.app_name || 'Untitled App',
      timestamp: new Date().toISOString(),
      token: token,
      status: 'Completed',
      plan: userPlan
    });

    await delay(1000);
    setLocation(`/download/${token}`);
  };

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full border-4 border-slate-800 border-t-emerald-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Smartphone className="w-8 h-8 text-emerald-500 animate-pulse" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4 text-center">
          Architecting Application...
        </h2>
        <p className="text-slate-400 text-center max-w-md">
          Analyzing requirements, selecting patterns, and generating Kotlin boilerplate.
        </p>
      </div>
    );
  }

  if (error === "Daily build limit reached for Free Plan.") {
      return (
         <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4">
            <div className="bg-[#1e1e1e] border border-slate-700 p-8 rounded-2xl max-w-md text-center shadow-xl">
               <Lock className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
               <h3 className="text-2xl font-bold text-white mb-2">Daily Limit Reached</h3>
               <p className="text-slate-400 mb-8">
                 You've used your 1 free build for today. Upgrade to Pro for unlimited builds and premium features.
               </p>
               <button 
                 onClick={() => setLocation('/pricing')}
                 className="w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/20 transition-all"
               >
                 <Crown className="w-5 h-5 fill-slate-900" />
                 View Upgrade Options
               </button>
               <button 
                 onClick={() => setLocation('/')}
                 className="mt-4 text-slate-500 hover:text-white text-sm"
               >
                 Go Back Home
               </button>
            </div>
         </div>
      );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4">
        <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-xl max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Build Failed</h3>
          <p className="text-slate-300 mb-6">{error}</p>
          <button 
            onClick={() => setLocation('/')}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 animate-in fade-in duration-500 max-w-6xl mx-auto w-full">
      <div className="w-full flex items-center justify-between mb-8">
        <div>
           <h2 className="text-3xl font-bold text-white mb-2">
            Project Generated
          </h2>
          <div className="flex items-center gap-3">
             <p className="text-slate-400">
               {spec?.app_name ? `${spec.app_name} is ready for review.` : 'Your app code is ready for review.'}
             </p>
             {userPlan === PlanType.FREE && (
                 <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded border border-slate-700">Free Plan</span>
             )}
              {userPlan === PlanType.PRO && (
                 <span className="bg-emerald-900/30 text-emerald-400 text-xs px-2 py-1 rounded border border-emerald-500/30">Pro Plan</span>
             )}
          </div>
        </div>
        
        {buildStatus === BuildStatus.IDLE ? (
          <button
            onClick={startBuild}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:shadow-emerald-500/20 transition-all transform hover:scale-105"
          >
            <span>Run Build</span>
            <Play className="w-5 h-5 fill-slate-900" />
          </button>
        ) : (
          <div className="flex items-center gap-3 px-6 py-3 bg-slate-800 rounded-lg border border-slate-700">
             <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
             <span className="text-emerald-400 font-mono text-sm uppercase tracking-wider">{buildStatus}...</span>
          </div>
        )}
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* File Selection List / Build Status */}
        <div className="lg:col-span-1 bg-[#1e1e1e] border border-slate-700 rounded-xl p-4 h-fit flex flex-col gap-4">
          
          {buildStatus === BuildStatus.IDLE ? (
            <>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                Files Generated
              </h3>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {generatedFiles.map((file) => (
                  <div key={file.fileName} className="flex items-center gap-2 text-slate-300 group">
                    <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                    <span className="font-mono text-xs truncate" title={file.fileName}>
                      {file.fileName.split('/').pop()}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
             <div className="h-full flex flex-col">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2 mb-2">
                   Build Agent
                </h3>
                <div className="space-y-4">
                   <div className={`flex items-center gap-3 text-sm ${buildStatus === BuildStatus.GENERATING_CODE || logs.length > 2 ? 'text-emerald-400' : 'text-slate-500'}`}>
                      <div className={`w-2 h-2 rounded-full ${buildStatus === BuildStatus.GENERATING_CODE ? 'bg-emerald-400 animate-pulse' : 'bg-current'}`} />
                      Generating Code
                   </div>
                   <div className={`flex items-center gap-3 text-sm ${buildStatus === BuildStatus.COMPILING ? 'text-emerald-400' : logs.length > 8 ? 'text-emerald-400' : 'text-slate-500'}`}>
                      <div className={`w-2 h-2 rounded-full ${buildStatus === BuildStatus.COMPILING ? 'bg-emerald-400 animate-pulse' : 'bg-current'}`} />
                      Compiling (Gradle)
                   </div>
                   <div className={`flex items-center gap-3 text-sm ${buildStatus === BuildStatus.SIGNING ? 'text-emerald-400' : logs.length > 12 ? 'text-emerald-400' : 'text-slate-500'}`}>
                      <div className={`w-2 h-2 rounded-full ${buildStatus === BuildStatus.SIGNING ? 'bg-emerald-400 animate-pulse' : 'bg-current'}`} />
                      Signing APK
                   </div>
                </div>
             </div>
          )}
        </div>

        {/* Code Preview or Terminal */}
        <div className="lg:col-span-3 h-[600px]">
          {buildStatus === BuildStatus.IDLE ? (
             generatedFiles.length > 0 && <CodePreview files={generatedFiles} />
          ) : (
             <Terminal logs={logs} />
          )}
        </div>
      </div>
    </div>
  );
}