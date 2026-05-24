'use client';

import { useState } from 'react';
import { MessageSquare, Tag } from 'lucide-react';
import { AppModal } from '@/components/ui/app-modal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TopicsTab } from './topics-tab';
import { TemplatesTab } from './templates-tab';
import type { BaseModalProps } from '../base-modal';

type MessagesTabValue = 'topics' | 'templates';

/**
 * Messages management modal — two tabs:
 *  - Topics: CRUD on chat reply categories (shared across customer & worker).
 *  - Templates: CRUD on canned replies filtered by topic + sender_type.
 */
export function MessagesModal({ open }: BaseModalProps) {
   const [tab, setTab] = useState<MessagesTabValue>('topics');

   return (
      <AppModal
         open={open}
         title="إدارة الرسائل والمواضيع"
         description="إدارة مواضيع وقوالب رسائل الدردشة"
         closeHref="/admin/dashboard"
         closeButtonText="إغلاق"
      >
         <Tabs
            dir="rtl"
            value={tab}
            onValueChange={(v) => setTab(v as MessagesTabValue)}
            className="w-full"
         >
            <TabsList className="w-full h-auto p-5 bg-gray-100 rounded-lg flex gap-1">
               <TabsTrigger
                  value="topics"
                  className="flex-1 gap-2  py-4 rounded-md text-sm font-medium text-gray-600! hover:text-gray-900! data-active:bg-white! data-active:text-gray-900! data-active:shadow-sm!"
               >
                  <Tag className="h-4 w-4" />
                  المواضيع
               </TabsTrigger>
               <TabsTrigger
                  value="templates"
                  className="flex-1 gap-2  py-4 rounded-md text-sm font-medium text-gray-600! hover:text-gray-900! data-active:bg-white! data-active:text-gray-900! data-active:shadow-sm!"
               >
                  <MessageSquare className="h-4 w-4" />
                  قوالب الرسائل
               </TabsTrigger>
            </TabsList>

            <TabsContent value="topics" className="mt-4">
               <TopicsTab />
            </TabsContent>
            <TabsContent value="templates" className="mt-4">
               <TemplatesTab />
            </TabsContent>
         </Tabs>
      </AppModal>
   );
}
