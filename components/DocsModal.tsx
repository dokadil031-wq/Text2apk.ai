import React from 'react';
import { X, Terminal, Server, Coffee, Layers, Box, FileCode } from 'lucide-react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1e1e1e] w-full max-w-4xl max-h-[90vh] rounded-xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-[#252526]">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-100">Server Environment Setup</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 text-slate-300">
            
          <section>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-blue-400" />
              1. System Requirements (Ubuntu)
            </h3>
            <p className="mb-4 text-sm leading-relaxed">
              To host the Text2APK build engine, we recommend a fresh installation of <strong>Ubuntu 22.04 LTS</strong> or <strong>24.04 LTS</strong>.
            </p>
            <div className="bg-black/30 rounded-lg p-4 border border-slate-700 font-mono text-xs md:text-sm text-emerald-400">
              sudo apt update && sudo apt upgrade -y<br/>
              sudo apt install -y curl zip unzip git wget
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Coffee className="w-5 h-5 text-orange-400" />
              2. Install Java 17 (OpenJDK)
            </h3>
            <p className="mb-4 text-sm">Android Gradle Plugin (AGP) 8.0+ strictly requires JDK 17 to compile projects.</p>
            <div className="bg-black/30 rounded-lg p-4 border border-slate-700 font-mono text-xs md:text-sm text-emerald-400">
              sudo apt install -y openjdk-17-jdk<br/>
              <span className="text-slate-500"># Verify installation</span><br/>
              java -version
            </div>
          </section>

          <section>
             <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-green-400" />
              3. Android SDK & Command Line Tools
            </h3>
            <p className="mb-4 text-sm">Set up the headless Android SDK environment. This is critical for generating APKs without Android Studio.</p>
             <div className="bg-black/30 rounded-lg p-4 border border-slate-700 font-mono text-xs md:text-sm text-slate-300">
              <span className="text-slate-500"># Create SDK directory structure</span><br/>
              mkdir -p ~/android-sdk/cmdline-tools<br/>
              cd ~/android-sdk/cmdline-tools<br/>
              <br/>
              <span className="text-slate-500"># Download Command Line Tools (Check official site for latest URL)</span><br/>
              wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip<br/>
              unzip commandlinetools-linux-*.zip<br/>
              <span className="text-slate-500"># Rename to 'latest' as per SDK requirements</span><br/>
              mv cmdline-tools latest<br/>
              <br/>
              <span className="text-slate-500"># Configure Environment Variables (Add to ~/.bashrc)</span><br/>
              <span className="text-emerald-400">export ANDROID_HOME=$HOME/android-sdk</span><br/>
              <span className="text-emerald-400">export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin</span><br/>
              <span className="text-emerald-400">export PATH=$PATH:$ANDROID_HOME/platform-tools</span><br/>
              <br/>
              <span className="text-slate-500"># Reload bash and Accept SDK Licenses</span><br/>
              source ~/.bashrc<br/>
              yes | sdkmanager --licenses
             </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FileCode className="w-5 h-5 text-purple-400" />
              4. Install Gradle
            </h3>
             <p className="mb-4 text-sm">While the generated projects use the Gradle Wrapper (`gradlew`), a system installation is useful for caching.</p>
             <div className="bg-black/30 rounded-lg p-4 border border-slate-700 font-mono text-xs md:text-sm text-emerald-400">
                sudo apt install -y gradle<br/>
                gradle -v
             </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Box className="w-5 h-5 text-yellow-400" />
              5. Install Node.js 20 & Docker
            </h3>
            <p className="mb-4 text-sm">Node.js is used for the web dashboard, and Docker for containerizing the build agents.</p>
            <div className="bg-black/30 rounded-lg p-4 border border-slate-700 font-mono text-xs md:text-sm text-emerald-400">
               <span className="text-slate-500"># Install Node.js 20 LTS</span><br/>
               curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -<br/>
               sudo apt-get install -y nodejs<br/>
               <br/>
               <span className="text-slate-500"># Install Docker Engine</span><br/>
               sudo apt install -y docker.io<br/>
               sudo usermod -aG docker $USER
            </div>
          </section>

        </div>
        
        <div className="p-4 border-t border-slate-700 bg-[#1e1e1e] flex justify-end">
           <button 
             onClick={onClose}
             className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors font-medium text-sm shadow-lg shadow-emerald-500/20"
           >
             I Have Set This Up
           </button>
        </div>
      </div>
    </div>
  );
};