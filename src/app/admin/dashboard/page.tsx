'use client';

import React, { Suspense } from 'react';
import {
   Users,
   HardHat,
   ClipboardList,
   BadgePercent,
   Wrench,
   Briefcase,
   LogIn,
   RotateCw,
} from 'lucide-react';
import {
   StatCard,
   StatCardSkeleton,
   QuickActionCard,
} from '@/components/admin/ui';
import { ModalController } from '@/components/admin/modals/modal-controller';
import { Button } from '@/components/ui/button';
import { useStatistics } from '@/hooks/admin';
import { QUICK_ACTIONS } from '@/lib/admin/mock-data';
import type { AdminStatistics } from '@/types/admin/statistics';

/**
 * Dashboard statistics configuration.
 * Maps each metric from GET /admin/statistics to its label, icon and accent.
 */
const STATISTICS_CARDS: {
   key: keyof AdminStatistics;
   title: string;
   icon: React.ElementType;
}[] = [
   { key: 'users_count', title: 'العملاء', icon: Users },
   { key: 'workers_count', title: 'العمال', icon: HardHat },
   { key: 'orders_count', title: 'الطلبات', icon: ClipboardList },
   { key: 'offers_count', title: 'العروض', icon: BadgePercent },
   { key: 'services_count', title: 'الخدمات', icon: Wrench },
   { key: 'careers_count', title: 'المهن', icon: Briefcase },
   { key: 'login_count', title: 'عدد تسجيلات الدخول', icon: LogIn },
];

/**
 * Uniform card width per breakpoint (matches a 2/3/4-column grid) used inside a
 * centered flex-wrap row so the trailing partial row stays centered — no orphan gap.
 */
const STAT_CARD_WIDTH =
   'w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] xl:w-[calc(25%-0.75rem)]';

/**
 * Admin Dashboard Page
 * Main dashboard with live statistics and management modals.
 */
export default function AdminDashboardPage() {
   const { statistics, isLoading, error, refetch } = useStatistics();
   const showSkeleton = isLoading && !statistics;

   return (
      <div className="p-4 lg:p-6 space-y-6">
         {/* Header */}
         <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold admin-text">لوحة التحكم</h1>
            <p className="admin-text-muted">
               مرحباً بعودتك! إليك ما يحدث اليوم.
            </p>
         </div>

         {/* Statistics Grid */}
         <div className="space-y-3">
            <div className="flex items-center justify-between">
               <h2 className="text-lg font-semibold admin-text">الإحصائيات</h2>
               <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 admin-btn-ghost h-8"
                  onClick={refetch}
                  disabled={isLoading}
               >
                  <RotateCw
                     className={isLoading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'}
                  />
                  <span className="text-xs">تحديث</span>
               </Button>
            </div>

            {error && !statistics ? (
               <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
                  <p className="text-sm admin-text-muted">
                     تعذر تحميل الإحصائيات. يرجى المحاولة مرة أخرى.
                  </p>
                  <Button
                     variant="outline"
                     size="sm"
                     className="gap-2"
                     onClick={refetch}
                  >
                     <RotateCw className="h-4 w-4" />
                     إعادة المحاولة
                  </Button>
               </div>
            ) : (
               <div className="flex flex-wrap justify-center gap-4">
                  {showSkeleton
                     ? STATISTICS_CARDS.map((card) => (
                          <div key={card.key} className={STAT_CARD_WIDTH}>
                             <StatCardSkeleton />
                          </div>
                       ))
                     : STATISTICS_CARDS.map((card) => (
                          <div key={card.key} className={STAT_CARD_WIDTH}>
                             <StatCard
                                title={card.title}
                                value={statistics?.[card.key] ?? 0}
                                icon={card.icon}
                             />
                          </div>
                       ))}
               </div>
            )}
         </div>

         {/* Quick Actions */}
         <div className="space-y-3">
            <h2 className="text-lg font-semibold admin-text">إجراءات سريعة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               {QUICK_ACTIONS.map((action) => (
                  <QuickActionCard key={action.modal} {...action} />
               ))}
            </div>
         </div>

         {/* Modals */}
         <Suspense fallback={null}>
            <ModalController />
         </Suspense>
      </div>
   );
}
