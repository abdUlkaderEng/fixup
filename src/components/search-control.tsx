'use client';

import { useRef, useEffect } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchResult } from '@/types/map';

interface SearchControlProps {
   isOpen: boolean;
   query: string;
   results: SearchResult[];
   isSearching: boolean;
   onOpen: () => void;
   onClose: () => void;
   onQueryChange: (query: string) => void;
   onSelect: (result: SearchResult) => void;
}

export function SearchControl({
   isOpen,
   query,
   results,
   isSearching,
   onOpen,
   onClose,
   onQueryChange,
   onSelect,
}: SearchControlProps) {
   const inputRef = useRef<HTMLInputElement>(null);

   useEffect(() => {
      if (isOpen && inputRef.current) {
         inputRef.current.focus();
      }
   }, [isOpen]);

   const handleClear = () => {
      onQueryChange('');
      inputRef.current?.focus();
   };

   const handleClose = () => {
      onClose();
      onQueryChange('');
   };

   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
         handleClose();
      }
   };

   return (
      <div className="absolute top-3 left-3 z-10">
         {isOpen ? (
            <div className="flex flex-col gap-1">
               <div className="flex items-center gap-2 rounded-lg bg-background/95 p-2 shadow-lg backdrop-blur">
                  <Search className="size-4 text-muted-foreground" />
                  <input
                     ref={inputRef}
                     type="text"
                     value={query}
                     onChange={(e) => onQueryChange(e.target.value)}
                     onKeyDown={handleKeyDown}
                     placeholder="ابحث عن مكان"
                     className="w-48 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                  {query && (
                     <button
                        onClick={handleClear}
                        className="rounded p-1 hover:bg-muted"
                     >
                        <X className="size-3.5" />
                     </button>
                  )}
                  <button
                     onClick={handleClose}
                     className="rounded p-1 hover:bg-muted"
                  >
                     <X className="size-4" />
                  </button>
               </div>

               {isSearching && (
                  <div className="rounded-lg bg-background/95 p-3 text-sm text-muted-foreground shadow-lg backdrop-blur">
                     جاري البحث...
                  </div>
               )}

               {results.length > 0 && (
                  <div className="max-h-60 overflow-auto rounded-lg bg-background/95 shadow-lg backdrop-blur">
                     {results.map((result, index) => (
                        <button
                           key={index}
                           onClick={() => onSelect(result)}
                           className="flex w-full items-start gap-2 border-b border-border/50 px-3 py-2 text-left text-sm transition-colors hover:bg-muted last:border-b-0"
                        >
                           <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                           <span className="line-clamp-2">
                              {result.place_name}
                           </span>
                        </button>
                     ))}
                  </div>
               )}
            </div>
         ) : (
            <Button
               variant="secondary"
               size="icon"
               onClick={onOpen}
               className="shadow-lg transition-all duration-300 ease-out hover:scale-110 hover:shadow-xl active:scale-95"
            >
               <Search className="size-4" />
            </Button>
         )}
      </div>
   );
}
