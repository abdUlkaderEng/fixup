'use client';

import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, MessageSquare, Send } from 'lucide-react';
import { AppModal } from '@/components/ui/app-modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { MOCK_MESSAGES, MESSAGE_CATEGORY_LABELS } from '@/lib/admin/mock-data';
import type { MessageCategory, StaticMessage } from '@/types/admin';
import type { BaseModalProps } from './base-modal';

/**
 * Category badge component - Arabic labels
 */
function CategoryBadge({ category }: { category: MessageCategory }) {
   const styles = {
      greeting: 'admin-badge-info',
      status: 'admin-badge-warning',
      notification: 'admin-badge-neutral',
      system: 'admin-badge-neutral',
   };

   const labels = MESSAGE_CATEGORY_LABELS;

   return (
      <Badge variant="secondary" className={`${styles[category]}`}>
         {labels[category]}
      </Badge>
   );
}

/**
 * Static messages management modal
 * Manage chat message templates
 */
export function MessagesModal({ open }: BaseModalProps) {
   const [searchQuery, setSearchQuery] = useState('');
   const [messages, setMessages] = useState<StaticMessage[]>(MOCK_MESSAGES);

   const filteredMessages = messages.filter(
      (msg) =>
         msg.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
         msg.content.toLowerCase().includes(searchQuery.toLowerCase())
   );

   const handleDeleteMessage = (id: string) => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
   };

   return (
      <AppModal
         open={open}
         title="رسائل الدردشة الثابتة"
         description="إدارة قوالب الرسائل للردود الآلية"
         closeHref="/admin/dashboard"
         closeButtonText="إغلاق"
      >
         <div className="space-y-4">
            {/* Search and Add */}
            <div className="flex items-center gap-3">
               <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                     placeholder="البحث بالمفتاح أو المحتوى..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="pl-10 admin-input"
                  />
               </div>
               <Button className="admin-btn-primary gap-2">
                  <Plus className="h-4 w-4" />
                  إضافة رسالة
               </Button>
            </div>

            {/* Messages Table */}
            <div className="border border-gray-200 rounded-md overflow-hidden">
               <Table>
                  <TableHeader>
                     <TableRow className="border-gray-200 hover:bg-transparent bg-gray-50">
                        <TableHead className="text-gray-500">المفتاح</TableHead>
                        <TableHead className="text-gray-500">الرسالة</TableHead>
                        <TableHead className="text-gray-500">الفئة</TableHead>
                        <TableHead className="text-gray-500">
                           الاستخدام
                        </TableHead>
                        <TableHead className="text-gray-500 text-right">
                           الإجراءات
                        </TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredMessages.map((message) => (
                        <TableRow
                           key={message.id}
                           className="border-gray-200 hover:bg-gray-50"
                        >
                           <TableCell>
                              <div className="flex items-center gap-2">
                                 <MessageSquare className="h-4 w-4 text-gray-400" />
                                 <span className="font-mono text-sm text-gray-700">
                                    {message.key}
                                 </span>
                              </div>
                              <p className="text-xs text-gray-400 mt-1">
                                 {message.id}
                              </p>
                           </TableCell>
                           <TableCell>
                              <p className="text-gray-900 max-w-xs truncate">
                                 {message.content}
                              </p>
                           </TableCell>
                           <TableCell>
                              <CategoryBadge category={message.category} />
                           </TableCell>
                           <TableCell>
                              <div className="flex items-center gap-2">
                                 <Send className="h-3 w-3 text-gray-400" />
                                 <span className="text-gray-700">
                                    {message.usage}
                                 </span>
                                 <span className="text-xs text-gray-400">
                                    ({message.lastUsed})
                                 </span>
                              </div>
                           </TableCell>
                           <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 admin-btn-ghost"
                                 >
                                    <Edit2 className="h-4 w-4" />
                                 </Button>
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 admin-btn-danger"
                                    onClick={() =>
                                       handleDeleteMessage(message.id)
                                    }
                                 >
                                    <Trash2 className="h-4 w-4" />
                                 </Button>
                              </div>
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </div>

            {/* Preview Section */}
            <div className="admin-panel p-4">
               <h4 className="text-sm font-medium text-gray-900 mb-2">
                  معاينة
               </h4>
               <Textarea
                  readOnly
                  value="اختر رسالة للمعاينة..."
                  className="min-h-20 resize-none admin-input"
               />
            </div>
         </div>
      </AppModal>
   );
}
