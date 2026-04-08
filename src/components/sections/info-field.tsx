import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InfoFieldProps {
   icon: React.ReactNode;
   title: string;
   children: React.ReactNode;
   className?: string;
}

export const InfoField = ({
   icon,
   title,
   children,
   className,
}: InfoFieldProps) => (
   <Card className={className}>
      <CardHeader className="pb-3">
         <CardTitle className="text-lg flex items-center gap-2">
            {icon}
            {title}
         </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
   </Card>
);

export default InfoField;
