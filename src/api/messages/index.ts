/**
 * Shared Messages API — Topics & Templates (read-only).
 *
 * GET endpoints consumed by admin, customer, and worker apps alike.
 * Mutations live in `@/api/admin/messages` and are admin-only.
 */
export { messageTopicsApi } from './topics';
export { messageTemplatesApi } from './templates';
export { MESSAGE_ENDPOINTS } from './endpoints';
