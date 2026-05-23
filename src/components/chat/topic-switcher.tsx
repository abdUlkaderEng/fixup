'use client';

import { Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopicSwitcherProps {
   topics: { id: number; topic: string }[];
   selectedTopicId: number | null;
   onChangeTopic: (topicId: number) => void;
   disabled?: boolean;
}

export function TopicSwitcher({
   topics,
   selectedTopicId,
   onChangeTopic,
   disabled = false,
}: TopicSwitcherProps) {
   return (
      <div className="border-b bg-muted/30 px-3 py-2" dir="rtl">
         <div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Tag className="h-3 w-3" />
            <span>اختر الموضوع</span>
         </div>
         <div className="flex flex-wrap gap-1.5">
            {topics.map((t) => {
               const isActive = t.id === selectedTopicId;
               return (
                  <button
                     key={t.id}
                     type="button"
                     onClick={() => onChangeTopic(t.id)}
                     disabled={disabled}
                     className={cn(
                        'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        isActive
                           ? 'border-primary bg-primary text-primary-foreground'
                           : 'border-border bg-background text-foreground hover:bg-muted'
                     )}
                  >
                     {t.topic}
                  </button>
               );
            })}
         </div>
      </div>
   );
}
