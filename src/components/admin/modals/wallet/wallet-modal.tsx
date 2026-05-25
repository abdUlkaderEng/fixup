'use client';

import { useState } from 'react';
import { Banknote, Wallet } from 'lucide-react';
import { AppModal } from '@/components/ui/app-modal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JobFeesTab } from './job-fees-tab';
import { TopupTab } from './topup-tab';
import type { BaseModalProps } from '../base-modal';

type WalletTabValue = 'fees' | 'topup';

/**
 * Wallet management modal — two tabs:
 *  - رسوم المهن: per-career fee CRUD (POST / PUT).
 *  - شحن المحفظة: credit a worker's wallet (POST topup).
 */
export function WalletModal({ open }: BaseModalProps) {
   const [tab, setTab] = useState<WalletTabValue>('fees');

   return (
      <AppModal
         open={open}
         title="إدارة المحفظة"
         description="إدارة رسوم المهن وشحن محافظ العمال"
         closeHref="/admin/dashboard"
         closeButtonText="إغلاق"
      >
         <Tabs
            dir="rtl"
            value={tab}
            onValueChange={(v) => setTab(v as WalletTabValue)}
            className="w-full"
         >
            <TabsList className="w-full h-auto p-5 bg-gray-100 rounded-lg flex gap-1">
               <TabsTrigger
                  value="fees"
                  className="flex-1 gap-2 py-4 rounded-md text-sm font-medium text-gray-600! hover:text-gray-900! data-active:bg-white! data-active:text-gray-900! data-active:shadow-sm!"
               >
                  <Banknote className="h-4 w-4" />
                  رسوم المهن
               </TabsTrigger>
               <TabsTrigger
                  value="topup"
                  className="flex-1 gap-2 py-4 rounded-md text-sm font-medium text-gray-600! hover:text-gray-900! data-active:bg-white! data-active:text-gray-900! data-active:shadow-sm!"
               >
                  <Wallet className="h-4 w-4" />
                  شحن المحفظة
               </TabsTrigger>
            </TabsList>

            <TabsContent value="fees" className="mt-4">
               <JobFeesTab />
            </TabsContent>
            <TabsContent value="topup" className="mt-4">
               <TopupTab />
            </TabsContent>
         </Tabs>
      </AppModal>
   );
}
