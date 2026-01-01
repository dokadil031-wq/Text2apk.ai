import React, { useEffect, useState } from 'react';
import { Activity, Server, Users, Layers, ExternalLink, RefreshCw, HardDrive, FileText, CheckCircle2, Shield } from 'lucide-react';
import { useLocation } from 'wouter';
import { getBuildHistory, HistoryItem } from '../services/historyService';
import { getUserPlan } from '../services/usageService';

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'status' | 'history' | 'deploy'>('status');
  
  // Simulated System Stats
  const [stats, setStats] = useState({
      cpu: 12,
      memory: 34,
      queue: 2,
      activeUsers: 843
  });

  useEffect(() => {
    setHistory(getBuildHistory());
    
    // Simulate live updates
    const interval = setInterval(() => {
        setStats(prev => ({
            cpu: Math.min(100, Math.max(5, prev.cpu + (Math.random() * 10 - 5))),
            memory: Math.min(100, Math.max(20, prev.memory + (Math.random() * 5 - 2))),
            queue: Math.floor(Math.random() * 5),
            activeUsers: prev.activeUsers + Math.floor(Math.random() * 3 - 1)
        }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const plan = getUserPlan();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Launch Control Center</h1>
                <p className="text-slate-400">Production environment status and build logs.</p>
            </div>
            <div className="flex gap-2">
                 <button 
                   onClick={() => setActiveTab('status')}
                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'status' ? 'bg-emerald-500 text-slate-900' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                 >
                    System Status
                 </button>
                 <button 
                   onClick={() => setActiveTab('history')}
                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'history' ? 'bg-emerald-500 text-slate-900' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                 >
                    Build History
                 </button>
                 <button 
                   onClick={() => setActiveTab('deploy')}
                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'deploy' ? 'bg-emerald-500 text-slate-900' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                 >
                    Server Config
                 </button>
            </div>
        </div>

        {activeTab === 'status' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                {/* Server Health */}
                <div className="bg-[#1e1e1e] border border-slate-700 rounded-xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity className="w-16 h-16 text-emerald-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                            <Server className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h3 className="text-slate-200 font-semibold">System Health</h3>
                    </div>
                    <div className="space-y-3">
                         <div className="flex justify-between text-sm">
                             <span className="text-slate-400">CPU Load</span>
                             <span className="text-emerald-400 font-mono">{stats.cpu.toFixed(1)}%</span>
                         </div>
                         <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                             <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${stats.cpu}%` }}></div>
                         </div>
                         <div className="flex justify-between text-sm">
                             <span className="text-slate-400">Memory</span>
                             <span className="text-blue-400 font-mono">{stats.memory.toFixed(1)}%</span>
                         </div>
                         <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                             <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${stats.memory}%` }}></div>
                         </div>
                    </div>
                </div>

                {/* Queue Status */}
                <div className="bg-[#1e1e1e] border border-slate-700 rounded-xl p-6 relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                            <Layers className="w-5 h-5 text-orange-400" />
                        </div>
                        <h3 className="text-slate-200 font-semibold">Build Queue</h3>
                    </div>
                    <div className="mt-4">
                         <span className="text-4xl font-bold text-white">{stats.queue}</span>
                         <span className="text-slate-500 ml-2">jobs pending</span>
                    </div>
                     <p className="text-xs text-slate-500 mt-2">Average wait: 12s</p>
                </div>

                {/* Active Users */}
                <div className="bg-[#1e1e1e] border border-slate-700 rounded-xl p-6 relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                            <Users className="w-5 h-5 text-purple-400" />
                        </div>
                        <h3 className="text-slate-200 font-semibold">Active Users</h3>
                    </div>
                    <div className="mt-4">
                         <span className="text-4xl font-bold text-white">{stats.activeUsers}</span>
                         <span className="text-emerald-400 text-sm ml-2 font-medium flex inline-flex items-center">
                            <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> Live
                         </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Across 3 regions</p>
                </div>

                {/* Plan Status */}
                <div className="bg-gradient-to-br from-[#1e1e1e] to-slate-800 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="text-slate-200 font-semibold">Your Plan</h3>
                    </div>
                    <div>
                         <div className="text-2xl font-bold text-white uppercase tracking-wide mb-1">{plan}</div>
                         <button 
                           onClick={() => setLocation('/pricing')}
                           className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
                         >
                            Manage Subscription
                         </button>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'history' && (
            <div className="bg-[#1e1e1e] border border-slate-700 rounded-xl overflow-hidden animate-in fade-in duration-300">
                <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                    <h3 className="font-semibold text-white">Your Recent Builds (Last 5)</h3>
                    <span className="text-xs text-slate-500">Local History</span>
                </div>
                {history.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        No build history found. Start your first build!
                    </div>
                ) : (
                    <div className="divide-y divide-slate-800">
                        {history.map((item) => (
                            <div key={item.id} className="p-4 hover:bg-slate-800/50 transition-colors flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center text-slate-400">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">{item.appName}</h4>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <span>{new Date(item.timestamp).toLocaleString()}</span>
                                            <span>•</span>
                                            <span className="uppercase">{item.plan}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 text-emerald-400 text-sm px-2 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>Success</span>
                                    </div>
                                    <button 
                                      onClick={() => setLocation(`/download/${item.token}`)}
                                      className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                                      title="Go to Download"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        {activeTab === 'deploy' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
                <div className="bg-[#1e1e1e] border border-slate-700 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <HardDrive className="w-4 h-4 text-emerald-400" />
                        Nginx Reverse Proxy Config
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">Recommended configuration for /etc/nginx/sites-available/text2apk</p>
                    <div className="bg-black rounded-lg p-4 overflow-x-auto border border-slate-800">
                        <pre className="text-xs font-mono text-emerald-400">
{`server {
    listen 80;
    server_name text2apk.ai;
    return 301 https://$host$request_uri;
}
server {
    listen 443 ssl http2;
    server_name app.text2apk.ai;
    ssl_certificate /etc/letsencrypt/live/text2apk.ai/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/text2apk.ai/privkey.pem;
    location / {
        root /var/www/text2apk/dist;
        try_files $uri $uri/ /index.html;
    }
}`}
                        </pre>
                    </div>
                </div>

                <div className="bg-[#1e1e1e] border border-slate-700 rounded-xl p-6">
                     <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-400" />
                        PM2 Ecosystem
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">Process manager config for ecosystem.config.js</p>
                    <div className="bg-black rounded-lg p-4 overflow-x-auto border border-slate-800">
                        <pre className="text-xs font-mono text-blue-400">
{`module.exports = {
  apps: [{
    name: "text2apk-api",
    script: "./dist/server/index.js",
    instances: "max",
    env_production: {
      NODE_ENV: "production",
      PORT: 3000
    }
  }]
}`}
                        </pre>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}