@AGENTS.md

---

## Fixup Project Guide

### Project Overview

**Fixup** is a Next.js 16 application (Arabic RTL) connecting customers with local service professionals. It features a customer-facing interface and an admin dashboard for managing workers, services, addresses, and careers.

### Tech Stack

- **Framework**: Next.js 16.2.1 (App Router, React 19.2.4)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **UI Primitives**: Radix UI + Lucide icons
- **Forms**: React Hook Form + Zod 4
- **State**: Zustand + next-themes
- **Auth**: NextAuth 4
- **HTTP**: Axios
- **Maps**: MapLibre GL + MapTiler

> **CRITICAL**: Next.js 16 has breaking changes from standard Next.js. Always check `node_modules/next/dist/docs/` for current APIs.

---

### Project Structure

```
src/
├── api/                    # HTTP layer
│   ├── admin/             # Modular admin API (careers, services, addresses, workers)
│   ├── auth.ts            # Authentication endpoints
│   └── user.ts            # User profile endpoints
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard (modals as parallel routes)
│   ├── api/               # API routes (NextAuth)
│   ├── auth/              # Login/register pages
│   ├── customer/          # Customer profile
│   ├── services/          # Service listings
│   ├── worker/            # Worker profile
│   ├── layout.tsx         # Root layout (RTL, fonts, providers)
│   └── page.tsx           # Landing page
├── components/
│   ├── admin/             # Admin-specific components
│   │   ├── modals/        # Parallel route modals (addresses, services, careers, workers)
│   │   └── ui/            # Admin UI components (ListItemRow, InlineAddRow)
│   ├── layout/            # Layout components (navbar, footer)
│   ├── profile/           # Profile form components
│   ├── providers/         # Context providers
│   ├── sections/          # Landing page sections
│   └── ui/                # shadcn/ui components
├── hooks/
│   ├── admin/             # Admin data hooks (useAddresses, useServices, etc.)
│   └── *.ts               # Shared hooks (useAuthToken, useLogout)
├── types/                  # TypeScript definitions
│   ├── admin/             # Admin-specific types (PaginatedResponse, etc.)
│   ├── address.ts
│   ├── auth.ts
│   ├── service.ts
│   └── worker.ts
└── middleware.ts          # Route protection
```

---

### Architecture Patterns

#### 1. Modular API Layer (`src/api/admin/`)

**Pattern**: Domain-separated modules with shared utilities.

```typescript
// api/admin/index.ts - Main entry point
export { workersApi, servicesApi, careersApi, addressesApi } from './workers';
export { AdminApiError, handleApiError, get, post, put, del } from './shared';

// Legacy aggregate for backward compatibility (deprecated)
export const adminApi = { getWorkers: workersApi.getAll, ... };
```

**Structure per domain** (`api/admin/workers.ts`):

- API functions: `getAll()`, `getPending()`, `update()`, `delete()`
- Type exports: `UpdateWorkerRequest`, `WorkerFilters`
- Uses shared HTTP helpers from `shared.ts`

#### 2. Data Hooks Pattern (`src/hooks/admin/`)

**Pattern**: Custom hooks combining fetch + mutations with optimistic updates.

```typescript
// hooks/admin/use-addresses.ts
export function useAddresses(options = {}) {
   // 1. Fetch with caching key
   const { data, isLoading, error, refetch, setData } = useFetch<Address[]>(
      fetcher,
      generateRequestKey('addresses-list'),
      { autoFetch, errorMessage: '...' }
   );

   // 2. Mutations with toast notifications
   const addMutation = useMutation(
      async (name) => {
         return await addressesApi.create({ area_name: name });
      },
      {
         successMessage: 'تم إضافة المنطقة بنجاح',
         onSuccess: (result) => {
            setData((prev) => [result, ...prev]);
         },
      }
   );

   // 3. Expose unified interface
   return { addresses: data ?? [], isLoading, addAddress, deleteAddress };
}
```

**Shared utilities** (`hooks/admin/shared/`):

- `useFetch.ts`: SWR-like fetching with request deduplication
- `useMutation.ts`: Mutations with loading states and toast notifications
- `request-cache.ts`: In-memory request deduplication
- `types.ts`: Shared hook interfaces

#### 3. Modal System (Parallel Routes)

**Pattern**: Modals as parallel routes using Next.js intercepting routes.

```
app/admin/dashboard/
├── @modal/                 # Parallel route slot
│   ├── (.)addresses/      # Intercepted route (shows as modal)
│   │   └── page.tsx       # Renders <AddressesModal open />
│   └── default.tsx        # No modal state
├── layout.tsx             # Includes {modal} slot
└── page.tsx               # Main dashboard
```

**Modal components** (`components/admin/modals/`):

- Use `AppModal` component with `closeHref` for navigation
- Include `DeleteConfirmDialog` for destructive actions
- Props interface: `BaseModalProps { open: boolean }`

#### 4. UI Component Patterns

**shadcn/ui base**: All UI components in `components/ui/` are shadcn primitives.

**Admin UI components** (`components/admin/ui/`):

- `ListItemRow`: Display item with delete action
- `InlineAddRow`: Collapsible add form with save/cancel

**Common composition pattern**:

```typescript
// Modal with loading, empty, and list states
<div className="space-y-3">
  <InlineAddRow ... />
  {isLoading ? <LoadingState /> : items.length === 0 ?
    <EmptyState /> : items.map(...)}
  <ItemCount count={items.length} label="عنوان" />
</div>
```

#### 5. Type Definitions

**Shared types** (`types/admin/shared.ts`):

```typescript
export interface PaginatedResponse<T> {
   current_page: number;
   data: T[];
   last_page: number;
   total: number;
   // ... Laravel-style pagination
}
```

**Domain types**: Single-file per entity (`types/address.ts`, `types/worker.ts`)

---

### Key Conventions

#### Arabic (RTL) Setup

```typescript
// layout.tsx
<html lang="ar" dir="rtl" suppressHydrationWarning>
<body className="min-h-full flex flex-col font-sans">
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <AuthProvider>
      <ConditionalNavbar />
      <main className="flex-1">{children}</main>
      <Toaster position="top-center" richColors />
    </AuthProvider>
  </ThemeProvider>
</body>
</html>
```

#### Error Handling Pattern

```typescript
// API layer throws AdminApiError with context
// Hooks catch and convert to toast messages
// Components catch for local state only (forms)
const handleDelete = async () => {
   try {
      await deleteAddress(id);
   } catch {
      // Error already toasted by hook, local state handles UI
   }
};
```

#### Form Pattern (React Hook Form + Zod)

```typescript
const form = useForm<FormValues>({
  resolver: zodResolver(schema),
  defaultValues: { ... },
});

// Floating inputs with labels
<FloatingInput id="name" label="الاسم" {...form.register('name')} />
{form.formState.errors.name && <FormMessage>{...}</FormMessage>}
```

---

### Quick Reference

| Task          | Import Path                         |
| ------------- | ----------------------------------- |
| Admin API     | `@/api/admin`                       |
| Admin Hooks   | `@/hooks/admin`                     |
| UI Components | `@/components/ui`                   |
| Admin Modals  | `@/components/admin/modals`         |
| Types         | `@/types/*`                         |
| Utils         | `@/lib/utils` (`cn()` for Tailwind) |

### Environment Notes

- Node.js + npm (lockfile present)
- Husky pre-commit runs Prettier
- ESLint 9 + flat config (`eslint.config.mjs`)
- Tailwind v4 uses `@tailwindcss/postcss`
