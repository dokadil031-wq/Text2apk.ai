interface BuildRecord {
  path: string;
  expiresAt: number;
}

const STORAGE_PREFIX = 'text2apk_build_';

export const createSecureToken = (apkPath: string): string => {
  // Generate a random token
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  // Set expiry to 24 hours from now
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  
  const record: BuildRecord = {
    path: apkPath,
    expiresAt
  };

  try {
    localStorage.setItem(`${STORAGE_PREFIX}${token}`, JSON.stringify(record));
  } catch (e) {
    console.error("Failed to save secure token", e);
  }

  return token;
};

export const verifySecureToken = (token: string): { isValid: boolean; path: string | null; error?: string } => {
  const key = `${STORAGE_PREFIX}${token}`;
  const data = localStorage.getItem(key);

  if (!data) {
    return { isValid: false, path: null, error: "Download link not found." };
  }

  try {
    const record: BuildRecord = JSON.parse(data);
    
    if (Date.now() > record.expiresAt) {
      // Clean up expired token
      localStorage.removeItem(key);
      return { isValid: false, path: null, error: "This download link has expired." };
    }

    return { isValid: true, path: record.path };
  } catch (e) {
    return { isValid: false, path: null, error: "Invalid token data." };
  }
};

/**
 * Helper to get formatted time remaining
 */
export const getTimeRemaining = (token: string): string => {
   const key = `${STORAGE_PREFIX}${token}`;
   const data = localStorage.getItem(key);
   if (!data) return "Expired";
   
   const record: BuildRecord = JSON.parse(data);
   const msRemaining = record.expiresAt - Date.now();
   
   if (msRemaining <= 0) return "Expired";
   
   const hours = Math.floor(msRemaining / (1000 * 60 * 60));
   const minutes = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60));
   
   return `${hours}h ${minutes}m`;
};
