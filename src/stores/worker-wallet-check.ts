'use client';

import { useEffect } from 'react';
import { create } from 'zustand';
// no extra types required
import { useWorkerWallet } from '@/hooks/worker';
import { useCareerFee } from '@/hooks/worker';

interface WorkerWalletCheckState {
   balance: number | null;
   fee: number | null;
   setBalance: (v: number | null) => void;
   setFee: (v: number | null) => void;
}

export const useWorkerWalletCheckStore = create<WorkerWalletCheckState>(
   (set) => ({
      balance: null,
      fee: null,
      setBalance: (v: number | null) => set(() => ({ balance: v })),
      setFee: (v: number | null) => set(() => ({ fee: v })),
   })
);

/**
 * Hook to synchronize values from worker hooks into the central store.
 * Call this from a top-level worker component (e.g., sidebar or layout)
 * so the values are kept up-to-date for any component that needs them.
 */
export function useWorkerWalletCheckSync() {
   const { wallet } = useWorkerWallet();
   const { fee } = useCareerFee();

   const setBalance = useWorkerWalletCheckStore((s) => s.setBalance);
   const setFee = useWorkerWalletCheckStore((s) => s.setFee);

   useEffect(() => {
      setBalance(wallet?.balance ?? null);
   }, [wallet, setBalance]);

   useEffect(() => {
      setFee(fee ?? null);
   }, [fee, setFee]);
}

export default useWorkerWalletCheckStore;
