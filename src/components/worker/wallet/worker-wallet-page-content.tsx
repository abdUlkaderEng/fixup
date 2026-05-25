'use client';

import { useCallback } from 'react';
import { History, Wallet as WalletIcon } from 'lucide-react';
import { useAuthToken } from '@/hooks';
import { useWorkerWallet, useWorkerWalletTransactions } from '@/hooks/worker';
import {
   AuthDashboardListSection,
   AuthDashboardPageShell,
} from '@/components/AuthDashboard';
import { EmptyState, PaginationControls } from '@/components/ui';
import { WalletBalanceCard } from './wallet-balance-card';
import { TransactionListItem } from './transaction-list-item';

/**
 * Worker wallet page.
 *
 * Two stacked sections:
 *  1. Balance card (current balance + totals).
 *  2. Transaction history with numbered pagination.
 *
 * Both sections use the worker theme via AuthDashboardPageShell.
 */
export function WorkerWalletPageContent() {
   useAuthToken();

   const {
      wallet,
      isLoading: isLoadingWallet,
      refetch: refetchWallet,
   } = useWorkerWallet();

   const {
      transactions,
      isLoading: isLoadingTransactions,
      currentPage,
      totalPages,
      totalItems,
      goToPage,
      refetch: refetchTransactions,
   } = useWorkerWalletTransactions({ perPage: 20 });

   // Single refetch that re-syncs both wallet snapshot and ledger.
   const handleRefreshAll = useCallback(() => {
      refetchWallet();
      refetchTransactions();
   }, [refetchWallet, refetchTransactions]);

   return (
      <AuthDashboardPageShell theme="worker">
         <div className="space-y-6">
            <WalletBalanceCard
               balance={wallet?.balance ?? 0}
               totalCharged={wallet?.total_charged ?? 0}
               totalSpent={wallet?.total_spent ?? 0}
               status={wallet?.status}
               isLoading={isLoadingWallet && !wallet}
            />

            <AuthDashboardListSection
               theme="worker"
               title="حركات المحفظة"
               icon={<History className="h-5 w-5" />}
               isLoading={isLoadingTransactions && transactions.length === 0}
               loadingText="جاري تحميل حركات المحفظة..."
            >
               {transactions.length === 0 ? (
                  <EmptyState
                     icon={<WalletIcon className="h-10 w-10" />}
                     title="لا توجد حركات بعد"
                     description="عند شحن محفظتك أو قبول طلب، ستظهر تفاصيل الحركة هنا."
                     action={
                        <button
                           type="button"
                           onClick={handleRefreshAll}
                           className="text-sm font-medium text-primary hover:underline"
                        >
                           تحديث
                        </button>
                     }
                  />
               ) : (
                  <div className="space-y-4">
                     <div className="space-y-2.5">
                        {transactions.map((tx) => (
                           <TransactionListItem key={tx.id} transaction={tx} />
                        ))}
                     </div>

                     {totalPages > 1 && (
                        <div className="flex flex-col items-center gap-2 pt-2">
                           <PaginationControls
                              currentPage={currentPage}
                              totalPages={totalPages}
                              onPageChange={goToPage}
                              disabled={isLoadingTransactions}
                           />
                           <p className="text-xs text-muted-foreground">
                              صفحة {currentPage} من {totalPages} • إجمالي{' '}
                              {totalItems} حركة
                           </p>
                        </div>
                     )}
                  </div>
               )}
            </AuthDashboardListSection>
         </div>
      </AuthDashboardPageShell>
   );
}

export default WorkerWalletPageContent;
