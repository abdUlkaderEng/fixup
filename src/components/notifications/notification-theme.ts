import type { AppModalTheme } from '@/components/ui/app-modal';

/**
 * Notification theme tokens — derived from the same source as AppModal
 * so all three themes stay visually consistent across the app.
 */
export type NotificationTheme = AppModalTheme;

export interface NotificationThemeTokens {
   /** Panel/dropdown container */
   panel: string;
   /** Panel header */
   header: string;
   /** Header title text */
   title: string;
   /** Unread badge */
   badge: string;
   /** Individual item — unread state */
   itemUnread: string;
   /** Individual item — read state */
   itemRead: string;
   /** Item hover */
   itemHover: string;
   /** Unread indicator dot */
   dot: string;
   /** Item title text */
   itemTitle: string;
   /** Item body text */
   itemBody: string;
   /** Item timestamp text */
   itemTime: string;
   /** Bell trigger button — active (has unread) */
   bellActive: string;
   /** Bell trigger button — idle */
   bellIdle: string;
   /** Empty state text */
   empty: string;
   /** Divider */
   divider: string;
}

export const notificationThemeTokens: Record<
   NotificationTheme,
   NotificationThemeTokens
> = {
   admin: {
      panel: 'bg-white border border-gray-200 shadow-lg dark:bg-gray-900 dark:border-gray-700',
      header:
         'bg-gray-50 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700',
      title: 'text-gray-900 dark:text-gray-100',
      badge: 'bg-[#13377b] text-white',
      itemUnread: 'bg-[#13377b]/5 dark:bg-[#13377b]/10',
      itemRead: 'bg-transparent',
      itemHover:
         'hover:bg-[#13377b]/8 dark:hover:bg-[#13377b]/15 transition-colors duration-150',
      dot: 'bg-[#13377b]',
      itemTitle: 'text-gray-900 dark:text-gray-100',
      itemBody: 'text-gray-500 dark:text-gray-400',
      itemTime: 'text-gray-400 dark:text-gray-500',
      bellActive: 'text-[#13377b] dark:text-blue-400',
      bellIdle: 'text-gray-500 dark:text-gray-400',
      empty: 'text-gray-400 dark:text-gray-500',
      divider: 'divide-gray-100 dark:divide-gray-700',
   },
   worker: {
      panel: 'bg-card border border-secondary/20 shadow-[0_8px_32px_-8px_rgba(248,198,23,0.2)]',
      header: 'bg-muted/70 border-b border-secondary/15',
      title: 'text-secondary',
      badge: 'bg-secondary text-secondary-foreground',
      itemUnread: 'bg-secondary/6',
      itemRead: 'bg-transparent',
      itemHover: 'hover:bg-secondary/10 transition-colors duration-150',
      dot: 'bg-secondary',
      itemTitle: 'text-foreground',
      itemBody: 'text-muted-foreground',
      itemTime: 'text-muted-foreground/60',
      bellActive: 'text-secondary',
      bellIdle: 'text-muted-foreground',
      empty: 'text-muted-foreground/60',
      divider: 'divide-secondary/10',
   },
   customer: {
      panel: 'bg-background border border-primary/15 shadow-[0_8px_32px_-8px_rgba(19,55,123,0.2)]',
      header: 'bg-background border-b border-primary/12',
      title: 'text-primary',
      badge: 'bg-primary text-primary-foreground',
      itemUnread: 'bg-primary/5',
      itemRead: 'bg-transparent',
      itemHover: 'hover:bg-primary/8 transition-colors duration-150',
      dot: 'bg-primary',
      itemTitle: 'text-foreground',
      itemBody: 'text-muted-foreground',
      itemTime: 'text-muted-foreground/60',
      bellActive: 'text-primary',
      bellIdle: 'text-muted-foreground',
      empty: 'text-muted-foreground/60',
      divider: 'divide-primary/10',
   },
};
