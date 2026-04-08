'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import {
   CircleCheckIcon,
   InfoIcon,
   TriangleAlertIcon,
   OctagonXIcon,
   Loader2Icon,
} from 'lucide-react';

const Toaster = ({ ...props }: ToasterProps) => {
   const { theme = 'system' } = useTheme();

   return (
      <Sonner
         theme={theme as ToasterProps['theme']}
         className="toaster group"
         icons={{
            success: <CircleCheckIcon className="size-5 text-green-600" />,
            info: <InfoIcon className="size-5 text-primary" />,
            warning: <TriangleAlertIcon className="size-5 text-primary" />,
            error: <OctagonXIcon className="size-5 text-destructive" />,
            loading: (
               <Loader2Icon className="size-5 animate-spin text-primary" />
            ),
         }}
         style={
            {
               '--normal-bg': 'var(--popover)',
               '--normal-text': 'var(--popover-foreground)',
               '--normal-border': 'var(--border)',
               '--border-radius': 'var(--radius)',
            } as React.CSSProperties
         }
         toastOptions={{
            classNames: {
               toast: 'group toast flex w-full items-center gap-3 overflow-hidden rounded-lg border p-4 shadow-lg',
               title: 'text-sm font-semibold leading-none',
               description: 'text-sm text-muted-foreground leading-relaxed',
               actionButton:
                  'inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90',
               cancelButton:
                  'inline-flex h-8 items-center justify-center rounded-md bg-muted px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/80',
               closeButton:
                  'absolute right-2 top-2 rounded-md m-3 text-muted-foreground/50 opacity-0 transition-opacity hover:text-muted-foreground group-hover:opacity-100',
               success:
                  'group-[.toaster]:bg-green-50 group-[.toaster]:border-green-200 group-[.toaster]:text-green-900 dark:group-[.toaster]:bg-green-950 dark:group-[.toaster]:border-green-800',
               info: 'group-[.toaster]:bg-primary/5 group-[.toaster]:border-primary/20',
               warning:
                  'group-[.toaster]:bg-primary/5 group-[.toaster]:border-primary/20',
               error: 'group-[.toaster]:bg-destructive/10',
            },
         }}
         {...props}
      />
   );
};

export { Toaster };
