'use client';

import { useEffect } from 'react';
import { initSyncListener } from '@/lib/syncManager';

export default function SyncInit() {
  useEffect(() => {
    initSyncListener();
  }, []);

  return null;
}