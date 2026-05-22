'use client';

import { useCallback, useMemo, useState } from 'react';
import { Loader2, MessageSquare, Tag, User, Wrench } from 'lucide-react';
import { LoadingState } from '@/components/ui/loading-state';
import { EmptyState } from '@/components/ui/empty-state';
import { ItemCount } from '@/components/ui/item-count';
import { DeleteConfirmDialog } from '@/components/ui/confirm-dialog';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
} from '@/components/ui/select';
import { InlineAddRow } from '@/components/admin/ui/inline-add-row';
import { ListItemRow } from '@/components/admin/ui/list-item-row';
import { useMessageTopics, useMessageTemplates } from '@/hooks/admin';
import { cn } from '@/lib/utils';
import type { MessageTemplate, SenderType } from '@/types/admin/messages';

// ============================================
// Sender Type Toggle (internal)
// ============================================

interface SenderTypeOption {
   value: SenderType;
   label: string;
   icon: React.ComponentType<{ className?: string }>;
}

const SENDER_OPTIONS: SenderTypeOption[] = [
   { value: 'customer', label: 'العميل', icon: User },
   { value: 'worker', label: 'العامل', icon: Wrench },
];

function SenderTypeToggle({
   value,
   onChange,
   disabled,
}: {
   value: SenderType;
   onChange: (next: SenderType) => void;
   disabled?: boolean;
}) {
   return (
      <div className="inline-flex items-center gap-1 p-1 bg-gray-100 rounded-lg w-fit">
         {SENDER_OPTIONS.map(({ value: optValue, label, icon: Icon }) => {
            const isActive = optValue === value;
            return (
               <button
                  key={optValue}
                  type="button"
                  onClick={() => onChange(optValue)}
                  disabled={disabled}
                  className={cn(
                     'flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all',
                     'disabled:opacity-50 disabled:cursor-not-allowed',
                     isActive
                        ? 'bg-white shadow-sm text-gray-900'
                        : 'text-gray-600 hover:text-gray-900'
                  )}
               >
                  <Icon className="h-4 w-4" />
                  {label}
               </button>
            );
         })}
      </div>
   );
}

// ============================================
// Templates Tab
// ============================================

export function TemplatesTab() {
   const { topics, isLoading: isLoadingTopics } = useMessageTopics();

   const [selectedTopicId, setSelectedTopicId] = useState<number | undefined>(
      undefined
   );
   const [senderType, setSenderType] = useState<SenderType>('customer');

   const selectedTopic = useMemo(
      () => topics.find((t) => t.id === selectedTopicId),
      [topics, selectedTopicId]
   );

   const {
      templates,
      isLoading: isLoadingTemplates,
      isAdding,
      isDeleting,
      addTemplate,
      deleteTemplate,
   } = useMessageTemplates({
      topicName: selectedTopic?.topic,
      topicId: selectedTopic?.id,
      senderType,
   });

   const [deletingTemplate, setDeletingTemplate] =
      useState<MessageTemplate | null>(null);

   const handleAdd = useCallback(
      async (text: string) => {
         try {
            await addTemplate(text);
         } catch {
            // Error already toasted by hook
         }
      },
      [addTemplate]
   );

   const handleConfirmDelete = useCallback(async () => {
      if (!deletingTemplate) return;
      try {
         await deleteTemplate(deletingTemplate.id);
         setDeletingTemplate(null);
      } catch {
         // Error already toasted by hook
      }
   }, [deletingTemplate, deleteTemplate]);

   const noTopicSelected = selectedTopicId === undefined;
   const isBusy = isLoadingTopics || isLoadingTemplates;

   return (
      <>
         <div className="space-y-4">
            {/* Filters: topic + sender */}
            <div className="admin-panel p-4 space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                     الموضوع
                  </label>
                  <Select
                     value={selectedTopicId?.toString() ?? ''}
                     onValueChange={(v) => setSelectedTopicId(Number(v))}
                     disabled={isLoadingTopics || topics.length === 0}
                  >
                     <SelectTrigger className="w-full admin-input h-11">
                        <div className="flex items-center justify-center gap-2 w-full">
                           {isLoadingTopics ? (
                              <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                           ) : (
                              <Tag className="h-4 w-4 text-gray-500" />
                           )}
                           <span>
                              {isLoadingTopics
                                 ? 'جاري التحميل...'
                                 : (selectedTopic?.topic ?? 'اختر الموضوع')}
                           </span>
                        </div>
                     </SelectTrigger>
                     <SelectContent position="popper" sideOffset={4}>
                        {topics.map((topic) => (
                           <SelectItem
                              key={topic.id}
                              value={topic.id.toString()}
                              className="cursor-pointer"
                           >
                              <div className="flex items-center gap-2">
                                 <Tag className="h-4 w-4 text-gray-500" />
                                 <span>{topic.topic}</span>
                              </div>
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                     نوع المرسل
                  </label>
                  <SenderTypeToggle
                     value={senderType}
                     onChange={setSenderType}
                     disabled={isBusy}
                  />
               </div>
            </div>

            {/* Empty topic state */}
            {noTopicSelected ? (
               <EmptyState
                  icon={<Tag className="h-10 w-10" />}
                  title={
                     topics.length === 0 && !isLoadingTopics
                        ? 'لا توجد مواضيع'
                        : 'اختر موضوعاً لعرض القوالب'
                  }
                  description={
                     topics.length === 0 && !isLoadingTopics
                        ? 'أضف موضوعاً من تبويب "المواضيع" أولاً.'
                        : undefined
                  }
               />
            ) : (
               <>
                  <InlineAddRow
                     triggerLabel="إضافة قالب جديد"
                     placeholder="اكتب نص الرسالة..."
                     icon={<MessageSquare className="h-5 w-5 text-gray-500" />}
                     onSave={handleAdd}
                     isSaving={isAdding}
                     disabled={isLoadingTemplates}
                  />

                  <div className="space-y-2">
                     {isLoadingTemplates ? (
                        <LoadingState
                           message="جاري تحميل القوالب..."
                           size="md"
                        />
                     ) : templates.length === 0 ? (
                        <EmptyState
                           icon={<MessageSquare className="h-10 w-10" />}
                           title="لا توجد قوالب"
                           description="ابدأ بإضافة قالب رسالة لهذا الموضوع."
                        />
                     ) : (
                        templates.map((template) => (
                           <ListItemRow
                              key={template.id}
                              id={template.id}
                              title={template.text}
                              icon={
                                 <MessageSquare className="h-5 w-5 text-gray-500" />
                              }
                              onDelete={() => setDeletingTemplate(template)}
                              isDeleting={isDeleting}
                           />
                        ))
                     )}
                  </div>

                  <ItemCount
                     count={templates.length}
                     label="قالب"
                     isLoading={isLoadingTemplates}
                     className="pt-4 border-t border-gray-200"
                  />
               </>
            )}
         </div>

         <DeleteConfirmDialog
            open={!!deletingTemplate}
            onOpenChange={(open) => !open && setDeletingTemplate(null)}
            onConfirm={handleConfirmDelete}
            isLoading={isDeleting}
            title="تأكيد الحذف"
            confirmLabel="حذف"
            variant="destructive"
            isAdmin
            description={
               <>
                  هل أنت متأكد من حذف القالب{' '}
                  <span className="font-medium text-foreground">
                     “{deletingTemplate?.text}”
                  </span>
                  ؟ لا يمكن التراجع عن هذا الإجراء.
               </>
            }
         />
      </>
   );
}
