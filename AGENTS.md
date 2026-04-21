<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

---

## Agent Instructions for Fixup Project

### Before You Start

1. **Read CLAUDE.md** - Contains project structure, patterns, and conventions specific to this codebase
2. **Check Next.js version** - This is Next.js 16 with React 19. Do not assume standard Next.js patterns work
3. **Understand the architecture** - Modular API layer, custom hooks pattern, parallel route modals

### Coding Guidelines

#### When Adding API Functions

- Place in `src/api/admin/{domain}.ts` (e.g., `addresses.ts`, `services.ts`)
- Export from `src/api/admin/index.ts`
- Use shared HTTP helpers from `src/api/admin/shared.ts`
- Follow existing pattern: `getAll()`, `create()`, `update()`, `delete()`
- Include proper TypeScript types for request/response

#### When Adding Hooks

- Place in `src/hooks/admin/use-{plural}.ts`
- Use shared utilities: `useFetch`, `useMutation`, `generateRequestKey`
- Provide `Use{X}Return` interface with loading states
- Include Arabic toast messages for mutations
- Export from `src/hooks/admin/index.ts`

#### When Adding Modals

- Create in `src/components/admin/modals/{name}-modal.tsx`
- Use `AppModal` with `closeHref` prop for navigation
- Include `DeleteConfirmDialog` for destructive actions
- Use `BaseModalProps` interface: `{ open: boolean }`
- Add parallel route in `app/admin/dashboard/@modal/(.{name})/page.tsx`

#### When Adding UI Components

- shadcn/ui primitives go in `src/components/ui/`
- Admin-specific UI goes in `src/components/admin/ui/`
- Follow existing patterns: `ListItemRow`, `InlineAddRow`
- Always RTL-friendly (Arabic text, logical CSS properties)

#### TypeScript Conventions

- Types in `src/types/{domain}.ts` or `src/types/admin/{name}.ts`
- Use `PaginatedResponse<T>` for lists from Laravel backend
- Export interfaces, not just types
- Include JSDoc for complex interfaces

### RTL & Arabic Specifics

- **Language**: Arabic (`lang="ar" dir="rtl"`)
- **Toast messages**: Always in Arabic
- **Icons**: Lucide icons, positioned appropriately for RTL
- **Forms**: Labels and placeholders in Arabic
- **Empty states**: Arabic text with appropriate icons

### Error Handling

```typescript
// API layer - throw AdminApiError with context
// Hooks - catch and show toast notification
// Components - catch for local state only
try {
   await deleteItem(id);
} catch {
   // Error already handled by hook
}
```

### Testing Changes

1. Run `npm run dev` to start dev server
2. Verify no TypeScript errors (`npm run lint` or check IDE)
3. Test RTL layout looks correct
4. Verify toast notifications appear for mutations

### Common Import Paths

```typescript
// API
import { addressesApi } from '@/api/admin';

// Hooks
import { useAddresses } from '@/hooks/admin';

// UI Components
import { AppModal, Button } from '@/components/ui';

// Admin Components
import { ListItemRow } from '@/components/admin/ui';

// Types
import type { Address } from '@/types/address';
import type { PaginatedResponse } from '@/types/admin/shared';

// Utils
import { cn } from '@/lib/utils';
```

### Files to Check When Modifying...

| Feature | Files to Review                                               |
| ------- | ------------------------------------------------------------- |
| API     | `src/api/admin/index.ts`, `src/api/admin/{domain}.ts`         |
| Hooks   | `src/hooks/admin/index.ts`, `src/hooks/admin/shared/*`        |
| Modals  | `src/components/admin/modals/`, `app/admin/dashboard/@modal/` |
| Types   | `src/types/admin/shared.ts`, `src/types/{domain}.ts`          |
| UI      | `src/components/ui/index.ts`, `src/components/admin/ui/`      |
