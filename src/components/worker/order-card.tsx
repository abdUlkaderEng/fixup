'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
   MapPin,
   Clock,
   ChevronLeft,
   ChevronRight,
   DollarSign,
   Wrench,
   AlertCircle,
   CheckCircle2,
   XCircle,
   Hourglass,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type {
   WorkerOrder,
   OrderStatus,
   WorkerOrderImage,
} from '@/types/entities/order';

// ── Types ────────────────────────────────────────────────────────────────────

interface OrderCardProps {
   order: WorkerOrder;
   onSendOffer: (orderId: number) => void;
}

// ── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
   OrderStatus,
   { label: string; Icon: React.ElementType; className: string }
> = {
   pending: {
      label: 'بانتظار العروض',
      Icon: Hourglass,
      className: 'worker-badge-pending',
   },
   accepted: {
      label: 'مقبول',
      Icon: CheckCircle2,
      className: 'worker-badge-active',
   },
   completed: {
      label: 'مكتمل',
      Icon: CheckCircle2,
      className: 'worker-badge-done',
   },
   cancelled: {
      label: 'ملغي',
      Icon: XCircle,
      className: 'worker-badge-cancelled',
   },
};

// ── Sub-components ────────────────────────────────────────────────────────────

function ImageGallery({ images }: { images: WorkerOrderImage[] }) {
   const [current, setCurrent] = useState(0);

   const prev = () =>
      setCurrent((c) => (c - 1 + images.length) % images.length);
   const next = () => setCurrent((c) => (c + 1) % images.length);

   return (
      <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl bg-muted group">
         <Image
            src={images[current].url}
            alt={`صورة الطلب ${current + 1}`}
            fill
            className="object-cover transition-opacity duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
         />

         {images.length > 1 && (
            <>
               <button
                  onClick={prev}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black/60 transition-all"
                  aria-label="السابق"
               >
                  <ChevronRight className="h-4 w-4" />
               </button>
               <button
                  onClick={next}
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black/60 transition-all"
                  aria-label="التالي"
               >
                  <ChevronLeft className="h-4 w-4" />
               </button>

               <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, i) => (
                     <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={cn(
                           'h-1.5 rounded-full transition-all',
                           i === current
                              ? 'w-4 bg-white'
                              : 'w-1.5 bg-white/50 hover:bg-white/80'
                        )}
                        aria-label={`الانتقال للصورة ${i + 1}`}
                     />
                  ))}
               </div>
            </>
         )}

         <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-medium">
            {current + 1}/{images.length}
         </div>
      </div>
   );
}

function NoImagePlaceholder() {
   return (
      <div className="aspect-video w-full bg-muted/50 rounded-t-2xl flex items-center justify-center">
         <Wrench className="h-10 w-10 text-muted-foreground/20" />
      </div>
   );
}

function ExpiryInfo({ expiresAt }: { expiresAt: string }) {
   const diffMs = new Date(expiresAt).getTime() - Date.now();
   const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
   const diffDays = Math.floor(diffHrs / 24);

   if (diffMs <= 0) {
      return (
         <span className="text-xs text-destructive font-semibold flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            منتهي
         </span>
      );
   }

   return (
      <span
         className={cn(
            'text-xs font-medium',
            diffHrs < 24 ? 'text-orange-500' : 'text-muted-foreground'
         )}
      >
         {diffDays > 0 ? `${diffDays} يوم` : `${diffHrs} ساعة`}
      </span>
   );
}

// ── Main Component ─────────────────────────────────────────────────────────

export function OrderCard({ order, onSendOffer }: OrderCardProps) {
   const statusCfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
   const { Icon: StatusIcon } = statusCfg;
   const canSendOffer = order.status === 'pending';

   return (
      <article className="worker-order-card group flex flex-col rounded-2xl overflow-hidden border border-border/60 shadow-sm hover:shadow-md transition-all duration-300">
         {order.images.length > 0 ? (
            <ImageGallery images={order.images} />
         ) : (
            <NoImagePlaceholder />
         )}

         <div className="flex flex-col flex-1 p-4 gap-3">
            {/* Status & ID */}
            <div className="flex items-center justify-between">
               <span
                  className={cn(
                     'worker-badge inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full',
                     statusCfg.className
                  )}
               >
                  <StatusIcon className="h-3 w-3" />
                  {statusCfg.label}
               </span>
               <span className="text-xs text-muted-foreground/60">
                  #{order.id}
               </span>
            </div>

            {/* Description */}
            <p className="text-sm text-foreground leading-relaxed line-clamp-3 flex-1">
               {order.description}
            </p>

            {/* Services */}
            {order.services.length > 0 && (
               <div className="flex flex-wrap gap-1.5">
                  {order.services.map((service) => (
                     <span
                        key={service.id}
                        className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-secondary/10 text-secondary-foreground/80 border border-secondary/25"
                     >
                        <Wrench className="h-2.5 w-2.5" />
                        {service.name}
                     </span>
                  ))}
               </div>
            )}

            {/* Meta */}
            <div className="space-y-1.5 pt-1">
               <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-secondary" />
                  <span className="truncate">
                     {order.address.area_address.name}
                  </span>
               </div>
               <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 shrink-0 text-secondary" />
                  <span>ينتهي خلال:</span>
                  <ExpiryInfo expiresAt={order.expires_at} />
               </div>
            </div>

            {/* CTA */}
            <div className="mt-auto pt-3 border-t border-border/40">
               <Button
                  size="sm"
                  disabled={!canSendOffer}
                  onClick={() => canSendOffer && onSendOffer(order.id)}
                  className={cn(
                     'w-full h-9 gap-2 rounded-xl font-semibold text-sm transition-all duration-200',
                     canSendOffer
                        ? 'worker-offer-btn hover:shadow-md hover:-translate-y-px active:translate-y-0'
                        : 'opacity-50 cursor-not-allowed bg-muted text-muted-foreground border-transparent'
                  )}
               >
                  <DollarSign className="h-4 w-4" />
                  {canSendOffer ? 'إرسال عرض سعر' : 'مغلق'}
               </Button>
            </div>
         </div>
      </article>
   );
}
