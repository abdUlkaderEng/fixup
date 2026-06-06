'use client';

import { Suspense } from 'react';
import { useAuthToken, usePublicAreas, usePublicCareers } from '@/hooks';
import { AuthDashboardPageShell } from '@/components/AuthDashboard';
import { CustomerOrdersHeader } from './customer-orders-header';
import { CustomerOrdersStatusTabs } from './customer-orders-status-tabs';

export function CustomerOrdersPageContent() {
   useAuthToken();

   const { careers } = usePublicCareers();
   const { areas } = usePublicAreas();

   return (
      <AuthDashboardPageShell theme="customer">
         <CustomerOrdersHeader />

         <div className="space-y-6">
            <Suspense fallback={null}>
               <CustomerOrdersStatusTabs careers={careers} areas={areas} />
            </Suspense>
         </div>
      </AuthDashboardPageShell>
   );
}

export default CustomerOrdersPageContent;
