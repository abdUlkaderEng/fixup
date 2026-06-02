'use client';

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
            <CustomerOrdersStatusTabs careers={careers} areas={areas} />
         </div>
      </AuthDashboardPageShell>
   );
}

export default CustomerOrdersPageContent;
