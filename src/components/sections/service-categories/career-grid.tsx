'use client';

import { useMemo } from 'react';
import { Wrench } from 'lucide-react';

import { usePublicCareers } from '@/hooks';

import { CareerCard } from './career-card';
import { resolveCareer } from './data';

const SKELETON_COUNT = 8;

function LoadingSkeletons() {
   return (
      <>
         {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div
               key={i}
               className="h-52 animate-pulse rounded-2xl border border-border bg-card/50"
            />
         ))}
      </>
   );
}

function EmptyState() {
   return (
      <div className="col-span-full rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center">
         <Wrench className="mx-auto size-8 text-muted-foreground/60" />
         <p className="mt-3 text-muted-foreground">
            لا توجد تصنيفات متاحة حالياً
         </p>
      </div>
   );
}

export function CareerGrid() {
   const { careers, isLoading } = usePublicCareers();

   const items = useMemo(
      () =>
         careers.map((career, index) => ({
            id: career.id,
            name: career.name,
            ...resolveCareer(career.name, index),
         })),
      [careers]
   );

   return (
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
         {isLoading ? (
            <LoadingSkeletons />
         ) : items.length === 0 ? (
            <EmptyState />
         ) : (
            items.map((item) => <CareerCard key={item.id} {...item} />)
         )}
      </div>
   );
}
