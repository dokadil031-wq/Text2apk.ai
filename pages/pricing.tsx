import React from 'react';
import { Check, Star, Zap, Briefcase, Crown, Shield } from 'lucide-react';
import { useLocation } from 'wouter';
import { PlanType } from '../types';
import { getUserPlan, setUserPlan } from '../services/usageService';
import { initiatePayment } from '../services/paymentService';

export default function PricingPage() {
  const [, setLocation] = useLocation();
  const currentPlan = getUserPlan();

  const handleUpgrade = async (plan: PlanType, price: number) => {
    if (plan === currentPlan) return;
    
    const success = await initiatePayment(plan, price);
    if (success) {
      setUserPlan(plan);
      alert(`Successfully upgraded to ${plan}!`);
      setLocation('/build');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 animate-in fade-in duration-500 max-w-7xl mx-auto w-full">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Choose Your Stack</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Scale your Android development with AI-powered tiers designed for hobbyists, pros, and agencies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        
        {/* Free Plan */}
        <div className={`relative bg-[#1e1e1e] rounded-2xl p-8 border ${currentPlan === PlanType.FREE ? 'border-emerald-500 shadow-emerald-500/20 shadow-lg' : 'border-slate-700'} flex flex-col`}>
          {currentPlan === PlanType.FREE && (
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-slate-900 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
               Current Plan
             </div>
          )}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
            <div className="flex items-baseline gap-1">
               <span className="text-4xl font-bold text-white">₹0</span>
               <span className="text-slate-500">/forever</span>
            </div>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-slate-300">
              <Check className="w-5 h-5 text-emerald-500" />
              1 APK Build per day
            </li>
            <li className="flex items-center gap-3 text-slate-300">
              <Check className="w-5 h-5 text-emerald-500" />
              Standard Speed
            </li>
            <li className="flex items-center gap-3 text-slate-500">
              <Shield className="w-5 h-5" />
              Contains Watermark
            </li>
            <li className="flex items-center gap-3 text-slate-500">
              <Shield className="w-5 h-5" />
              No Offline Support
            </li>
          </ul>
          <button 
            disabled={currentPlan === PlanType.FREE}
            className="w-full py-3 rounded-xl border border-slate-700 text-white font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentPlan === PlanType.FREE ? 'Active' : 'Downgrade'}
          </button>
        </div>

        {/* Pro Plan */}
        <div className={`relative bg-gradient-to-b from-[#1e1e1e] to-slate-900 rounded-2xl p-8 border ${currentPlan === PlanType.PRO ? 'border-emerald-500 shadow-emerald-500/20 shadow-lg' : 'border-slate-700'} flex flex-col transform hover:-translate-y-2 transition-transform duration-300`}>
          {currentPlan === PlanType.PRO && (
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-slate-900 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
               Current Plan
             </div>
          )}
          <div className="absolute top-4 right-4 text-emerald-400">
            <Star className="w-6 h-6 fill-emerald-400/20" />
          </div>
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
            <div className="flex items-baseline gap-1">
               <span className="text-4xl font-bold text-white">₹499</span>
               <span className="text-slate-500">/app</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">One-time payment per project</p>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-white">
              <Check className="w-5 h-5 text-emerald-400" />
              <strong>Unlimited Screens</strong>
            </li>
            <li className="flex items-center gap-3 text-white">
              <Check className="w-5 h-5 text-emerald-400" />
              Offline DB Support
            </li>
            <li className="flex items-center gap-3 text-white">
              <Check className="w-5 h-5 text-emerald-400" />
              Dark Mode Theme
            </li>
            <li className="flex items-center gap-3 text-white">
              <Check className="w-5 h-5 text-emerald-400" />
              No Watermark
            </li>
            <li className="flex items-center gap-3 text-white">
              <Zap className="w-5 h-5 text-yellow-400" />
              Priority Build Queue
            </li>
          </ul>
          <button 
            onClick={() => handleUpgrade(PlanType.PRO, 499)}
            disabled={currentPlan === PlanType.PRO}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
          >
            {currentPlan === PlanType.PRO ? 'Active' : 'Upgrade to Pro'}
          </button>
        </div>

        {/* Agency Plan */}
        <div className={`relative bg-[#1e1e1e] rounded-2xl p-8 border ${currentPlan === PlanType.AGENCY ? 'border-purple-500 shadow-purple-500/20 shadow-lg' : 'border-slate-700'} flex flex-col`}>
          {currentPlan === PlanType.AGENCY && (
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
               Current Plan
             </div>
          )}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">Agency</h3>
            <div className="flex items-baseline gap-1">
               <span className="text-4xl font-bold text-white">₹1999</span>
               <span className="text-slate-500">/month</span>
            </div>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-slate-300">
              <Crown className="w-5 h-5 text-purple-400" />
              <strong>Unlimited APK Builds</strong>
            </li>
            <li className="flex items-center gap-3 text-slate-300">
              <Check className="w-5 h-5 text-purple-400" />
              White-label Apps
            </li>
             <li className="flex items-center gap-3 text-slate-300">
              <Check className="w-5 h-5 text-purple-400" />
              Commercial Usage License
            </li>
            <li className="flex items-center gap-3 text-slate-300">
              <Zap className="w-5 h-5 text-yellow-400" />
              Ultra-Fast Build Speed
            </li>
          </ul>
          <button 
            onClick={() => handleUpgrade(PlanType.AGENCY, 1999)}
            disabled={currentPlan === PlanType.AGENCY}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-500/20 transition-all disabled:opacity-50 disabled:bg-slate-700 disabled:shadow-none"
          >
            {currentPlan === PlanType.AGENCY ? 'Active' : 'Get Agency Plan'}
          </button>
        </div>

      </div>
    </div>
  );
}
