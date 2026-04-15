'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, MessageSquare, Send } from 'lucide-react';
import {
   AdminModal,
   ModalActions,
   CloseButton,
   PrimaryButton,
   type BaseModalProps,
} from './base-modal';
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

/**
 * Category badge component - Arabic labels
 */
function CategoryBadge({ category }: { category: MessageCategory }) {
   const styles = {
      greeting: 'bg-blue-500/20 text-blue-400',
      status: 'bg-yellow-500/20 text-yellow-400',
      notification: 'bg-purple-500/20 text-purple-400',
      system: 'bg-zinc-500/20 text-zinc-400',
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
      <AdminModal
         open={open}
         title="رسائل الدردشة الثابتة"
         description="إدارة قوالب الرسائل للردود الآلية"
      >
         <div className="space-y-4">
            {/* Search and Add */}
            <div className="flex items-center gap-3">
               <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                     placeholder="البحث بالمفتاح أو المحتوى..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="pl-10 bg-zinc-900 border-white/10 text-white placeholder:text-white/40"
                  />
               </div>
               <Button className="bg-white text-black hover:bg-white/90 gap-2">
                  <Plus className="h-4 w-4" />
                  إضافة رسالة
               </Button>
            </div>

            {/* Messages Table */}
            <div className="border border-white/10 rounded-md overflow-hidden">
               <Table>
                  <TableHeader>
                     <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-white/60">المفتاح</TableHead>
                        <TableHead className="text-white/60">الرسالة</TableHead>
                        <TableHead className="text-white/60">الفئة</TableHead>
                        <TableHead className="text-white/60">
                           الاستخدام
                        </TableHead>
                        <TableHead className="text-white/60 text-right">
                           الإجراءات
                        </TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredMessages.map((message) => (
                        <TableRow
                           key={message.id}
                           className="border-white/10 hover:bg-white/5"
                        >
                           <TableCell>
                              <div className="flex items-center gap-2">
                                 <MessageSquare className="h-4 w-4 text-white/40" />
                                 <span className="font-mono text-sm text-white/80">
                                    {message.key}
                                 </span>
                              </div>
                              <p className="text-xs text-white/40 mt-1">
                                 {message.id}
                              </p>
                           </TableCell>
                           <TableCell>
                              <p className="text-white/80 max-w-xs truncate">
                                 {message.content}
                              </p>
                           </TableCell>
                           <TableCell>
                              <CategoryBadge category={message.category} />
                           </TableCell>
                           <TableCell>
                              <div className="flex items-center gap-2">
                                 <Send className="h-3 w-3 text-white/40" />
                                 <span className="text-white/80">
                                    {message.usage}
                                 </span>
                                 <span className="text-xs text-white/40">
                                    ({message.lastUsed})
                                 </span>
                              </div>
                           </TableCell>
                           <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
                                 >
                                    <Edit2 className="h-4 w-4" />
                                 </Button>
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-white/60 hover:text-red-400 hover:bg-red-500/10"
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
            <div className="border border-white/10 rounded-md p-4 bg-zinc-900/50">
               <h4 className="text-sm font-medium text-white mb-2">معاينة</h4>
               <Textarea
                  readOnly
                  value="اختر رسالة للمعاينة..."
                  className="bg-zinc-900 border-white/10 text-white/80 min-h-20 resize-none"
               />
            </div>

            <ModalActions>
               <CloseButton />
               <PrimaryButton>حفظ التغييرات</PrimaryButton>
            </ModalActions>
         </div>
      </AdminModal>
   );
}
