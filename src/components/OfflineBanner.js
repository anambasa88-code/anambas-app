'use client';

import { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, AlertCircle } from 'lucide-react'; // <-- Import ikon di sini

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    setIsOffline(!navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const checkPending = () => {
      try {
        const queue = localStorage.getItem('offline-transaction-queue');
        if (queue) {
          const items = JSON.parse(queue);
          setPendingCount(items.length);
        } else {
          setPendingCount(0);
        }
      } catch (e) {
        setPendingCount(0);
      }
    };

    checkPending();
    const interval = setInterval(checkPending, 3000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  if (!isOffline && pendingCount === 0) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-[9999] w-full py-3 px-4 text-center text-[13px] font-semibold shadow-md transition-all duration-300 ${
      isOffline 
        ? 'bg-rose-600 text-white border-b border-rose-700' // <-- Merah tegas & statis
        : 'bg-emerald-600 text-white'
    }`}>
      <div className="flex items-center justify-center gap-2 flex-wrap max-w-md mx-auto">
        {isOffline ? (
          <>
            <WifiOff className="w-4 h-4 text-rose-200" />
            <span>Kamu sedang offline. Transaksi disimpan lokal.</span>
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4 text-emerald-200 animate-spin" />
            <span>Koneksi kembali online. Menyinkronkan data...</span>
          </>
        )}
        
        {pendingCount > 0 && (
          <span className="flex items-center gap-1 bg-black/20 text-white px-2.5 py-0.5 rounded-full text-xs font-bold">
            <AlertCircle className="w-3 h-3" />
            {pendingCount} Antrean
          </span>
        )}
      </div>
    </div>
  );
}