'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useWorkers, useWorkerMutations } from '@/hooks';
import type { Worker } from '@/types/entities/worker';

export function useWorkerRequests(open: boolean) {
   const { status: sessionStatus } = useSession();
   const hasFetchedRef = useRef(false);
   const prevFilterRef = useRef<string | undefined>(undefined);

   const workersQuery = useWorkers({
      perPage: 10,
      status: 'waiting',
      autoFetch: false,
   });
   const {
      workers,
      isLoading,
      error,
      currentPage,
      totalPages,
      totalWorkers,
      statusFilter,
      setStatusFilter,
      nextPage,
      prevPage,
      refetch,
      fetch,
      hasNextPage,
      hasPrevPage,
   } = workersQuery;

   const mutations = useWorkerMutations(refetch);

   // Reset fetch gate when filter changes
   useEffect(() => {
      if (prevFilterRef.current !== statusFilter) {
         prevFilterRef.current = statusFilter;
         hasFetchedRef.current = false;
      }
   }, [statusFilter]);

   // Fetch once when modal opens and session is ready
   useEffect(() => {
      if (sessionStatus !== 'authenticated') return;
      if (open && !hasFetchedRef.current) {
         hasFetchedRef.current = true;
         fetch();
      }
      if (!open) {
         hasFetchedRef.current = false;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [open, sessionStatus]);

   const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
   const [deletingWorker, setDeletingWorker] = useState<Worker | null>(null);

   const confirmDelete = async () => {
      if (!deletingWorker) return;
      const success = await mutations.deleteWorker(deletingWorker.id);
      if (success) setDeletingWorker(null);
   };

   return {
      // List state
      workers,
      isLoading,
      error,
      currentPage,
      totalPages,
      totalWorkers,
      statusFilter,
      setStatusFilter,
      nextPage,
      prevPage,
      refetch,
      hasNextPage,
      hasPrevPage,
      // Mutations
      isUpdating: mutations.isUpdating,
      isDeleting: mutations.isDeleting,
      updateWorker: mutations.updateWorker,
      approveWorker: mutations.approveWorker,
      blockWorker: mutations.blockWorker,
      // Dialog state
      editingWorker,
      setEditingWorker,
      deletingWorker,
      setDeletingWorker,
      confirmDelete,
   };
}
