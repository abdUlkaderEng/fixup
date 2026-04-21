'use client';

import React, { Suspense } from 'react';
import { StatCard, QuickActionCard } from '@/components/admin/ui';
import { ModalController } from '@/components/admin/modals/modal-controller';
import { DASHBOARD_STATS, QUICK_ACTIONS } from '@/lib/admin/mock-data';

/**
 * Admin Dashboard Page
 * Main dashboard with statistics and management modals
 * Refactored: Components and data extracted to separate files
 */
export default function AdminDashboardPage() {
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
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DASHBOARD_STATS.map((stat) => (
               <StatCard key={stat.title} {...stat} />
            ))}
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
