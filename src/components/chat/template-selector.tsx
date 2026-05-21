'use client';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MessageTemplate } from '@/types/chat';

interface TemplateSelectorProps {
   templates: MessageTemplate[];
   onSelect: (templateId: number) => void;
   disabled?: boolean;
   isSending?: boolean;
}

export function TemplateSelector({
   templates,
   onSelect,
   disabled = false,
   isSending = false,
}: TemplateSelectorProps) {
   // Last-clicked id. Stale values are harmless because the spinner only renders
   // while isSending is true (i.e. the most recent click is the one in flight).
   const [lastClicked, setLastClicked] = useState<number | null>(null);
   const activeId = isSending ? lastClicked : null;

   const handleClick = (id: number) => {
      setLastClicked(id);
      onSelect(id);
   };

   return (
      <div className="max-h-40 overflow-y-auto">
         <div className="flex flex-wrap gap-2 p-4">
            {templates.map((template) => {
               const showSpinner = isSending && activeId === template.id;
               return (
                  <Button
                     key={template.id}
                     variant="outline"
                     size="sm"
                     disabled={disabled}
                     onClick={() => handleClick(template.id)}
                     className="h-auto whitespace-normal text-right leading-snug"
                  >
                     {showSpinner && (
                        <Loader2 className="ml-1 h-3 w-3 animate-spin" />
                     )}
                     {template.text}
                  </Button>
               );
            })}
         </div>
      </div>
   );
}
