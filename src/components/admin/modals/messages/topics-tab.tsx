'use client';

import { useCallback, useState } from 'react';
import { Tag } from 'lucide-react';
import { LoadingState } from '@/components/ui/loading-state';
import { EmptyState } from '@/components/ui/empty-state';
import { ItemCount } from '@/components/ui/item-count';
import { DeleteConfirmDialog } from '@/components/ui/confirm-dialog';
import { InlineAddRow } from '@/components/admin/ui/inline-add-row';
import { EditableListItemRow } from '@/components/admin/ui/editable-list-item-row';
import { useMessageTopics } from '@/hooks/admin';
import type { MessageTopic } from '@/types/admin/messages';

export function TopicsTab() {
   const {
      topics,
      isLoading,
      isAdding,
      isUpdating,
      isDeleting,
      addTopic,
      updateTopic,
      deleteTopic,
   } = useMessageTopics();

   const [editingId, setEditingId] = useState<number | null>(null);
   const [editValue, setEditValue] = useState('');
   const [deletingTopic, setDeletingTopic] = useState<MessageTopic | null>(
      null
   );

   const handleAdd = useCallback(
      async (value: string) => {
         try {
            await addTopic(value);
         } catch {
            // Error already toasted by hook
         }
      },
      [addTopic]
   );

   const handleEditStart = useCallback((topic: MessageTopic) => {
      setEditingId(topic.id);
      setEditValue(topic.topic);
   }, []);

   const handleEditCancel = useCallback(() => {
      setEditingId(null);
      setEditValue('');
   }, []);

   const handleEditSave = useCallback(async () => {
      if (!editingId || !editValue.trim()) return;
      try {
         await updateTopic(editingId, editValue);
         setEditingId(null);
         setEditValue('');
      } catch {
         // Error already toasted by hook; keep editor open for retry
      }
   }, [editingId, editValue, updateTopic]);

   const handleConfirmDelete = useCallback(async () => {
      if (!deletingTopic) return;
      try {
         await deleteTopic(deletingTopic.id);
         setDeletingTopic(null);
      } catch {
         // Error already toasted by hook
      }
   }, [deletingTopic, deleteTopic]);

   return (
      <>
         <div className="space-y-3">
            <InlineAddRow
               triggerLabel="إضافة موضوع جديد"
               placeholder="اكتب اسم الموضوع..."
               icon={<Tag className="h-5 w-5 text-gray-500" />}
               onSave={handleAdd}
               isSaving={isAdding}
               disabled={isLoading}
            />

            <div className="space-y-2">
               {isLoading ? (
                  <LoadingState message="جاري تحميل المواضيع..." size="md" />
               ) : topics.length === 0 ? (
                  <EmptyState
                     icon={<Tag className="h-10 w-10" />}
                     title="لا توجد مواضيع"
                  />
               ) : (
                  topics.map((topic) => (
                     <EditableListItemRow
                        key={topic.id}
                        id={topic.id}
                        value={topic.topic}
                        icon={<Tag className="h-5 w-5 text-gray-500" />}
                        isEditing={editingId === topic.id}
                        editValue={editValue}
                        onEditStart={() => handleEditStart(topic)}
                        onEditChange={setEditValue}
                        onEditSave={handleEditSave}
                        onEditCancel={handleEditCancel}
                        onDelete={() => setDeletingTopic(topic)}
                        isUpdating={isUpdating && editingId === topic.id}
                        isDeleting={isDeleting}
                        editPlaceholder="اسم الموضوع..."
                     />
                  ))
               )}
            </div>

            <ItemCount
               count={topics.length}
               label="موضوع"
               isLoading={isLoading}
               className="pt-4 border-t border-gray-200"
            />
         </div>

         <DeleteConfirmDialog
            open={!!deletingTopic}
            onOpenChange={(open) => !open && setDeletingTopic(null)}
            onConfirm={handleConfirmDelete}
            isLoading={isDeleting}
            title="تأكيد الحذف"
            confirmLabel="حذف"
            variant="destructive"
            isAdmin
            description={
               <>
                  هل أنت متأكد من حذف الموضوع{' '}
                  <span className="font-medium text-foreground">
                     {deletingTopic?.topic}
                  </span>
                  ؟ سيتم حذف جميع القوالب المرتبطة به. لا يمكن التراجع عن هذا
                  الإجراء.
               </>
            }
         />
      </>
   );
}
