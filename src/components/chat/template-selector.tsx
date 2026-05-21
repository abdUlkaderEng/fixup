import { Button } from '@/components/ui/button';
import type { MessageTemplate } from '@/types/chat';

interface TemplateSelectorProps {
   templates: MessageTemplate[];
   onSelect: (templateId: number) => void;
   disabled?: boolean;
}

export function TemplateSelector({
   templates,
   onSelect,
   disabled = false,
}: TemplateSelectorProps) {
   return (
      <div className="flex flex-wrap gap-2 p-4">
         {templates.map((template) => (
            <Button
               key={template.id}
               variant="outline"
               size="sm"
               disabled={disabled}
               onClick={() => onSelect(template.id)}
               className="h-auto whitespace-normal text-right leading-snug"
            >
               {template.text}
            </Button>
         ))}
      </div>
   );
}
