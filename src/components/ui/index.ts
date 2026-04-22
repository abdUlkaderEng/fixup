/**
 * UI Components - Barrel export
 * Reusable UI components for the entire application
 */

// Form & Input Components
export { SearchInput } from './search-input';
export { RadioCardGroup } from './radio-card-group';
export type { RadioCardOption } from './radio-card-group';
export { SectionPanel } from './section-panel';

// Status & Feedback Components
export { StatusBadge, useStatusBadge } from './status-badge';
export type { StatusVariant, StatusConfig } from './status-badge';

// Loading & Empty States
export { LoadingState } from './loading-state';
export { EmptyState } from './empty-state';
export { ItemCount } from './item-count';

// Data Display Components
export { DataTable } from './data-table';
export type { Column } from './data-table';

// Modal Components
export {
   AppModal,
   ModalActions,
   ModalPrimaryButton,
   ModalSecondaryButton,
} from './app-modal';
export { ConfirmDialog, DeleteConfirmDialog } from './confirm-dialog';
export type { ConfirmDialogProps } from './confirm-dialog';

// Keep existing shadcn component exports
export * from './avatar';
export * from './badge';
export * from './button';
export * from './card';
export * from './checkbox';
export * from './dialog';
export * from './drawer';
export * from './dropdown-menu';
export * from './floating-input';
export * from './form';
export * from './input';
export * from './label';
export * from './scroll-area';
export * from './select';
export * from './separator';
export * from './sheet';
export * from './slider';
export * from './sonner';
export * from './switch';
export * from './table';
export * from './tabs';
export * from './textarea';
export * from './theme-toggle';
export * from './tooltip';
