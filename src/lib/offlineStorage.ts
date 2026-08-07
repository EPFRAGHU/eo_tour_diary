import { useEffect, useState } from 'react';

const OFFLINE_DRAFTS_KEY = 'epfo_offline_diary_drafts';

export interface OfflineDraftItem {
  id: string;
  savedAt: string;
  data: any;
}

/**
 * Custom hook to monitor real-time online/offline network connectivity.
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

/**
 * Saves a draft to local offline storage.
 */
export const saveOfflineDraft = (id: string, data: any): void => {
  try {
    const existing = getOfflineDrafts();
    const filtered = existing.filter((d) => d.id !== id);
    const updated: OfflineDraftItem[] = [
      { id, savedAt: new Date().toISOString(), data },
      ...filtered,
    ];
    localStorage.setItem(OFFLINE_DRAFTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save offline draft:', e);
  }
};

/**
 * Retrieves all offline drafts from storage.
 */
export const getOfflineDrafts = (): OfflineDraftItem[] => {
  try {
    const raw = localStorage.getItem(OFFLINE_DRAFTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

/**
 * Clears an offline draft.
 */
export const clearOfflineDraft = (id: string): void => {
  try {
    const existing = getOfflineDrafts();
    const updated = existing.filter((d) => d.id !== id);
    localStorage.setItem(OFFLINE_DRAFTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to clear offline draft:', e);
  }
};
