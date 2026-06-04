'use client';

import {
   ArrowDownLeft,
   ArrowUpRight,
   History,
   ReceiptText,
} from 'lucide-react';
import { AppModal } from '@/components/ui/app-modal';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { formatDateTime, formatSAR } from '@/lib/format';
import { useAdminWalletTransactions } from '@/hooks/admin';
import { PaginationControls } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { BaseModalProps } from '../base-modal';
import type { AdminWalletTransaction } from '@/types/admin/wallet';

const TRANSACTION_TYPE_LABELS: Record<string, string> = {
   topup: 'شحن',
   job_fee: 'رسوم طلب',
};

function getTransactionTypeLabel(type: string): string {
   return TRANSACTION_TYPE_LABELS[type] ?? type;
}

function isCreditTransaction(type: string): boolean {
   return type === 'topup';
}

function TransactionTypeBadge({ type }: { type: string }) {
   const isCredit = isCreditTransaction(type);
   const Icon = isCredit ? ArrowDownLeft : ArrowUpRight;

   return (
      <Badge
         variant="outline"
         className={cn(
            'h-7 gap-1.5 rounded-full px-3',
            isCredit
               ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
               : 'border-rose-200 bg-rose-50 text-rose-700'
         )}
      >
         <Icon className="h-3.5 w-3.5" />
         {getTransactionTypeLabel(type)}
      </Badge>
   );
}

function MobileTransactionCard({
   transaction,
}: {
   transaction: AdminWalletTransaction;
}) {
   const isCredit = isCreditTransaction(transaction.type);
   const userName = transaction.wallet?.user?.name ?? 'غير معروف';

   return (
      <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
         <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
               <div className="flex items-center gap-2">
                  <ReceiptText className="h-4 w-4 shrink-0 text-[#13377b]" />
                  <p className="truncate text-sm font-semibold text-gray-900">
                     {userName}
                  </p>
               </div>
               <p className="text-xs text-gray-500">
                  #{transaction.id} • {formatDateTime(transaction.created_at)}
               </p>
            </div>
            <TransactionTypeBadge type={transaction.type} />
         </div>

         <div className="mt-4 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-lg bg-gray-50 p-3">
               <p className="text-xs text-gray-500">المبلغ</p>
               <p
                  className={cn(
                     'mt-1 text-base font-bold tabular-nums',
                     isCredit ? 'text-emerald-700' : 'text-rose-700'
                  )}
               >
                  {isCredit ? '+' : '-'}
                  {formatSAR(transaction.amount)} ل.س
               </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
               <p className="text-xs text-gray-500">الرصيد بعد</p>
               <p className="mt-1 text-base font-bold tabular-nums text-gray-900">
                  {formatSAR(transaction.balance_after)}
               </p>
            </div>
         </div>

         <div className="mt-3 grid grid-cols-2 gap-3 text-center text-xs">
            <div className="rounded-lg border border-gray-100 p-2">
               <p className="text-gray-500">الرصيد قبل</p>
               <p className="mt-1 font-medium text-gray-900">
                  {formatSAR(transaction.balance_before)}
               </p>
            </div>
            <div className="rounded-lg border border-gray-100 p-2">
               <p className="text-gray-500">أجرى العملية</p>
               <p className="mt-1 font-medium text-gray-900">
                  {transaction.performed_by ?? '-'}
               </p>
            </div>
         </div>

         {transaction.note && (
            <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-center text-xs text-gray-600">
               {transaction.note}
            </p>
         )}
      </article>
   );
}

export function WalletTransactionsModal({ open }: BaseModalProps) {
   const {
      transactions,
      isLoading,
      currentPage,
      totalPages,
      totalItems,
      goToPage,
   } = useAdminWalletTransactions({ perPage: 10 });

   const columns = [
      {
         key: 'id',
         header: 'ID',
         cell: (t: AdminWalletTransaction) => t.id,
         className: 'text-center font-medium',
         headerClassName: 'text-center',
      },
      {
         key: 'user',
         header: 'العامل',
         cell: (t: AdminWalletTransaction) => (
            <span className="font-medium">{t.wallet?.user?.name ?? '-'}</span>
         ),
         className: 'text-center',
         headerClassName: 'text-center',
      },
      {
         key: 'type',
         header: 'النوع',
         cell: (t: AdminWalletTransaction) => (
            <div className="flex justify-center">
               <TransactionTypeBadge type={t.type} />
            </div>
         ),
         className: 'text-center',
         headerClassName: 'text-center',
      },
      {
         key: 'amount',
         header: 'المبلغ',
         cell: (t: AdminWalletTransaction) => (
            <span
               className={cn(
                  'font-bold tabular-nums',
                  isCreditTransaction(t.type)
                     ? 'text-emerald-700'
                     : 'text-rose-700'
               )}
            >
               {isCreditTransaction(t.type) ? '+' : '-'}
               {formatSAR(t.amount)} ل.س
            </span>
         ),
         className: 'text-center',
         headerClassName: 'text-center',
      },
      {
         key: 'balance_before',
         header: 'الرصيد قبل',
         cell: (t: AdminWalletTransaction) => formatSAR(t.balance_before),
         className: 'text-center tabular-nums',
         headerClassName: 'text-center',
      },
      {
         key: 'balance_after',
         header: 'الرصيد بعد',
         cell: (t: AdminWalletTransaction) => formatSAR(t.balance_after),
         className: 'text-center tabular-nums font-semibold',
         headerClassName: 'text-center',
      },
      {
         key: 'performed_by',
         header: 'أجرى العملية',
         cell: (t: AdminWalletTransaction) => t.performed_by ?? '-',
         className: 'text-center',
         headerClassName: 'text-center',
      },
      {
         key: 'note',
         header: 'ملاحظة',
         cell: (t: AdminWalletTransaction) => (
            <span className="line-clamp-2 text-sm text-gray-600">
               {t.note ?? '-'}
            </span>
         ),
         className: 'max-w-[220px] text-center',
         headerClassName: 'text-center',
      },
      {
         key: 'created_at',
         header: 'التاريخ',
         cell: (t: AdminWalletTransaction) => formatDateTime(t.created_at),
         className: 'text-center whitespace-nowrap',
         headerClassName: 'text-center',
      },
   ];
   const showInitialLoading = isLoading && transactions.length === 0;
   const showEmptyState = !isLoading && transactions.length === 0;

   return (
      <AppModal
         open={open}
         title="حركات المحفظة"
         description="مراجعة حركات المحفظة لجميع العمال"
         closeHref="/admin/dashboard"
         closeButtonText="إغلاق"
         size="full"
         contentClassName="bg-gray-50 px-3 py-4 sm:px-5"
      >
         <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
               <div className="rounded-xl border border-gray-200 bg-white p-3 text-center shadow-sm">
                  <p className="text-xs text-gray-500">إجمالي الحركات</p>
                  <p className="mt-1 text-xl font-bold text-gray-900">
                     {totalItems}
                  </p>
               </div>
               <div className="rounded-xl border border-gray-200 bg-white p-3 text-center shadow-sm">
                  <p className="text-xs text-gray-500">الصفحة الحالية</p>
                  <p className="mt-1 text-xl font-bold text-gray-900">
                     {currentPage}
                  </p>
               </div>
               <div className="rounded-xl border border-gray-200 bg-white p-3 text-center shadow-sm">
                  <p className="text-xs text-gray-500">عدد الصفحات</p>
                  <p className="mt-1 text-xl font-bold text-gray-900">
                     {totalPages}
                  </p>
               </div>
               <div className="rounded-xl border border-gray-200 bg-white p-3 text-center shadow-sm">
                  <p className="text-xs text-gray-500">المعروض الآن</p>
                  <p className="mt-1 text-xl font-bold text-gray-900">
                     {transactions.length}
                  </p>
               </div>
            </div>

            {showInitialLoading ? (
               <LoadingState
                  message="جاري تحميل حركات المحفظة..."
                  className="rounded-xl border border-gray-200 bg-white"
               />
            ) : showEmptyState ? (
               <EmptyState
                  icon={<History className="h-10 w-10" />}
                  title="لا توجد حركات"
                  description="لا توجد حركات محفظة لعرضها"
                  className="rounded-xl border border-gray-200 bg-white"
               />
            ) : (
               <>
                  <div className="space-y-3 md:hidden">
                     {transactions.map((transaction) => (
                        <MobileTransactionCard
                           key={transaction.id}
                           transaction={transaction}
                        />
                     ))}
                  </div>

                  <DataTable<AdminWalletTransaction>
                     data={transactions}
                     columns={columns}
                     keyExtractor={(t) => t.id}
                     showSearch={false}
                     className="hidden overflow-x-auto rounded-xl bg-white md:block"
                     tableClassName="min-w-[1100px]"
                     headerClassName="bg-gray-50"
                     rowClassName="text-center"
                  />
               </>
            )}

            {totalPages > 1 && (
               <div className="rounded-xl border border-gray-200 bg-white p-3">
                  <PaginationControls
                     currentPage={currentPage}
                     totalPages={totalPages}
                     onPageChange={goToPage}
                     disabled={isLoading}
                  />
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                     صفحة {currentPage} من {totalPages} • إجمالي {totalItems}{' '}
                     حركة
                  </p>
               </div>
            )}
         </div>
      </AppModal>
   );
}

export default WalletTransactionsModal;
