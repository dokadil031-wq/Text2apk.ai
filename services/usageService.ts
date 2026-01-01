import { PlanType } from '../types';

const KEY_PLAN = 'text2apk_plan';
const KEY_USAGE = 'text2apk_usage';

export const getUserPlan = (): PlanType => {
  return (localStorage.getItem(KEY_PLAN) as PlanType) || PlanType.FREE;
};

export const setUserPlan = (plan: PlanType) => {
  localStorage.setItem(KEY_PLAN, plan);
};

export const checkDailyLimit = (): boolean => {
  const plan = getUserPlan();
  
  // Agency and Pro have no strict daily limits for this demo (Pro is priority)
  if (plan === PlanType.AGENCY || plan === PlanType.PRO) return true;

  // Free Plan Logic: 1 APK per day
  const usageData = JSON.parse(localStorage.getItem(KEY_USAGE) || '{}');
  const today = new Date().toDateString();
  
  if (usageData.date !== today) {
     // Reset if new day
     return true;
  }
  
  if (usageData.count >= 1) {
    return false;
  }
  
  return true;
};

export const incrementUsage = () => {
  const usageData = JSON.parse(localStorage.getItem(KEY_USAGE) || '{}');
  const today = new Date().toDateString();
  
  if (usageData.date !== today) {
    usageData.date = today;
    usageData.count = 0;
  }
  
  usageData.count = (usageData.count || 0) + 1;
  localStorage.setItem(KEY_USAGE, JSON.stringify(usageData));
};

export const getUsageStats = () => {
    const usageData = JSON.parse(localStorage.getItem(KEY_USAGE) || '{}');
    return {
        count: usageData.date === new Date().toDateString() ? usageData.count || 0 : 0,
        limit: getUserPlan() === PlanType.FREE ? 1 : '∞'
    };
};
