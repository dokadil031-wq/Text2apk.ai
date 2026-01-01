export interface HistoryItem {
  id: string;
  appName: string;
  timestamp: string;
  token: string;
  status: 'Completed' | 'Failed';
  plan: string;
}

const HISTORY_KEY = 'text2apk_build_history';

export const saveBuildToHistory = (item: Omit<HistoryItem, 'id'>) => {
  const history = getBuildHistory();
  const newItem: HistoryItem = {
    ...item,
    id: Math.random().toString(36).substr(2, 9),
  };
  
  // Add to beginning and keep only last 5
  const newHistory = [newItem, ...history].slice(0, 5);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
};

export const getBuildHistory = (): HistoryItem[] => {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};
