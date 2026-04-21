'use client';

import { ReactNode } from 'react';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { SearchInput } from '@/components/ui/search-input';
import { LoadingState } from '@/components/ui/loading-state';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';

export interface Column<T> {
   key: string;
   header: string;
   cell: (item: T) => ReactNode;
   className?: string;
   headerClassName?: string;
}

interface DataTableProps<T> {
   data: T[];
   columns: Column<T>[];
   keyExtractor: (item: T) => string | number;
   searchQuery?: string;
   onSearchChange?: (value: string) => void;
   searchPlaceholder?: string;
   loading?: boolean;
   loadingMessage?: string;
   emptyState?: {
      icon?: ReactNode;
      title: string;
      description?: string;
      action?: ReactNode;
   };
   className?: string;
   tableClassName?: string;
   headerClassName?: string;
   rowClassName?: string;
   showSearch?: boolean;
   searchable?: boolean;
   searchFields?: (keyof T)[];
}

export function DataTable<T>({
   data,
   columns,
   keyExtractor,
   searchQuery,
   onSearchChange,
   searchPlaceholder = 'Search...',
   loading = false,
   loadingMessage = 'Loading...',
   emptyState,
   className,
   tableClassName,
   headerClassName,
   rowClassName,
   showSearch = true,
   searchable = true,
}: DataTableProps<T>) {
   const displayData = data;

   if (loading) {
      return <LoadingState message={loadingMessage} />;
   }

   if (!displayData.length && emptyState) {
      return (
         <EmptyState
            icon={emptyState.icon}
            title={emptyState.title}
            description={emptyState.description}
            action={emptyState.action}
         />
      );
   }

   return (
      <div className={cn('space-y-4', className)}>
         {showSearch && searchable && onSearchChange && (
            <SearchInput
               value={searchQuery || ''}
               onChange={onSearchChange}
               placeholder={searchPlaceholder}
            />
         )}

         <div className="border border-border rounded-md overflow-hidden">
            <Table className={tableClassName}>
               <TableHeader className={headerClassName}>
                  <TableRow>
                     {columns.map((column) => (
                        <TableHead
                           key={column.key}
                           className={cn(
                              'text-muted-foreground font-medium',
                              column.headerClassName
                           )}
                        >
                           {column.header}
                        </TableHead>
                     ))}
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {displayData.map((item) => (
                     <TableRow
                        key={keyExtractor(item)}
                        className={cn('hover:bg-muted/50', rowClassName)}
                     >
                        {columns.map((column) => (
                           <TableCell
                              key={`${keyExtractor(item)}-${column.key}`}
                              className={column.className}
                           >
                              {column.cell(item)}
                           </TableCell>
                        ))}
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </div>
      </div>
   );
}
