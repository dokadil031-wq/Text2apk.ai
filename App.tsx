import React, { useState } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import IndexPage from './pages/index';
import BuildPage from './pages/build';
import DownloadPage from './pages/download';
import PricingPage from './pages/pricing';
import DashboardPage from './pages/dashboard';
import ChatPage from './pages/chat';
import { Smartphone, LayoutDashboard } from 'lucide-react';
import { DocsModal } from './components/DocsModal';
import { AuthModal } from './components/AuthModal';

const App = () => {
  const [showDocs, setShowDocs] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<{name: string, email: string} | null>(null);
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30">
        {/* Persistent Layout Header */}
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div 
              onClick={() => setLocation('/')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
                <Smartphone className="w-5 h-5 text-slate-900" />
              </div>
              <span className="font-bold text-xl tracking-tight">Text2APK<span className="text-emerald-400">.ai</span></span>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
               <button 
                 onClick={() => setLocation('/dashboard')}
                 className="hidden md:flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors"
               >
                 <LayoutDashboard className="w-4 h-4" />
                 Dashboard
               </button>
               <button 
                 onClick={() => setShowDocs(true)}
                 className="hidden md:inline hover:text-white cursor-pointer transition-colors"
               >
                 Documentation
               </button>
               <span 
                 onClick={() => setLocation('/pricing')}
                 className="hidden md:inline hover:text-white cursor-pointer transition-colors"
               >
                 Pricing
               </span>
               <button 
                 onClick={() => user ? setUser(null) : setShowAuth(true)}
                 className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full border border-slate-700 transition-all text-xs flex items-center gap-2"
               >
                 {user ? (
                   <>
                     <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-400 flex items-center justify-center text-[10px] text-slate-900 font-bold uppercase">
                       {user.name[0]}
                     </div>
                     <span className="hidden md:inline">Sign Out</span>
                   </>
                 ) : (
                   "Sign In"
                 )}
               </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 w-full mx-auto">
          <Switch>
            <Route path="/" component={IndexPage} />
            <Route path="/build" component={BuildPage} />
            <Route path="/chat" component={ChatPage} />
            <Route path="/pricing" component={PricingPage} />
            <Route path="/dashboard" component={DashboardPage} />
            <Route path="/download/:token" component={DownloadPage} />
            {/* Fallback for bare /download */}
            <Route path="/download">
               {() => <div className="flex items-center justify-center h-[50vh] text-slate-500">Missing download token.</div>}
            </Route>
            <Route>
              <div className="flex items-center justify-center h-[50vh] text-slate-500">404 - Page Not Found</div>
            </Route>
          </Switch>
        </main>

        {/* Persistent Layout Footer */}
        <footer className="border-t border-slate-800 py-8 mt-auto bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Text2APK.ai. Powered by Google Gemini.</p>
            <div className="flex gap-6">
                <span className="hover:text-emerald-400 cursor-pointer transition-colors">Terms</span>
                <span className="hover:text-emerald-400 cursor-pointer transition-colors">Privacy</span>
                <span className="hover:text-emerald-400 cursor-pointer transition-colors">API</span>
            </div>
            </div>
        </footer>

        <DocsModal isOpen={showDocs} onClose={() => setShowDocs(false)} />
        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onLogin={(u) => setUser(u)} />
    </div>
  );
};

export default App;