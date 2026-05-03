'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
   Check,
   Edit2,
   Trash2,
   Ban,
   Briefcase,
   Wrench,
   Star,
   Calendar,
   User,
   Phone,
   Mail,
   MapPin,
   Images,
   ChevronDown,
   ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { ImageSlideshow } from '@/components/ui/image-slideshow';
import { resolveImageUrl } from '@/lib/resolve-image-url';
import type { Worker, WorkerStatus } from '@/types/entities/worker';

const STATUS_BADGE_MAP: Record<
   WorkerStatus,
   { label: string; variant: 'pending' | 'active' | 'error' }
> = {
   waiting: { label: 'قيد الانتظار', variant: 'pending' },
   active: { label: 'نشط', variant: 'active' },
   blocked: { label: 'محظور', variant: 'error' },
};

function calculateAge(birthDate: string | null): string | null {
   if (!birthDate) return null;
   const age = Math.floor(
      (Date.now() - new Date(birthDate).getTime()) /
         (1000 * 60 * 60 * 24 * 365.25)
   );
   return isNaN(age) ? null : `${age} سنة`;
}

export interface WorkerCardProps {
   worker: Worker;
   onApprove: (id: number) => void;
   onBlock: (id: number) => void;
   onEdit: (worker: Worker) => void;
   onDelete: (worker: Worker) => void;
   isUpdating: boolean;
}

export function WorkerCard({
   worker,
   onApprove,
   onBlock,
   onEdit,
   onDelete,
   isUpdating,
}: WorkerCardProps) {
   const [showImages, setShowImages] = useState(false);

   const badge = STATUS_BADGE_MAP[worker.status];
   const avatarSrc = resolveImageUrl(worker.user.profile_image);
   const age = calculateAge(worker.user.birth_date);
   const area = worker.user.address?.area_address?.area_name;
   const detailedAddress = worker.user.address?.detailed_address;

   const slideshowImages = worker.images.map((img) => ({
      id: img.id,
      url: resolveImageUrl(img.path) ?? '',
   }));

   return (
      <div className="admin-panel p-4 space-y-4">
         {/* Header: avatar + name + status */}
         <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
               {avatarSrc ? (
                  <div className="relative h-12 w-12 shrink-0">
                     <Image
                        src={avatarSrc}
                        alt={worker.user.name}
                        fill
                        unoptimized
                        className="rounded-full object-cover border border-gray-200"
                     />
                  </div>
               ) : (
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200">
                     <User className="h-5 w-5 text-gray-400" />
                  </div>
               )}
               <div className="min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">
                     {worker.user.name}
                  </h4>
                  <p className="text-xs text-gray-400">#{worker.id}</p>
               </div>
            </div>
            <StatusBadge status={badge.variant} label={badge.label} />
         </div>

         {/* Contact & personal info */}
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <InfoRow icon={<Mail />} label="البريد" value={worker.user.email} />
            {worker.user.phone_number && (
               <InfoRow
                  icon={<Phone />}
                  label="الهاتف"
                  value={worker.user.phone_number}
               />
            )}
            {age && <InfoRow icon={<User />} label="العمر" value={age} />}
            <InfoRow
               icon={<Briefcase />}
               label="المهنة"
               value={worker.career.name}
            />
            <InfoRow
               icon={<Star />}
               label="الخبرة"
               value={
                  worker.years_experience != null
                     ? `${worker.years_experience} سنة`
                     : '—'
               }
            />
            <InfoRow
               icon={<Calendar />}
               label="تاريخ التسجيل"
               value={new Date(worker.created_at).toLocaleDateString('ar-SA')}
            />
            {area && <InfoRow icon={<MapPin />} label="المنطقة" value={area} />}
            {detailedAddress && (
               <InfoRow
                  icon={<MapPin />}
                  label="العنوان التفصيلي"
                  value={detailedAddress}
                  fullWidth
               />
            )}
            {worker.about && (
               <InfoRow
                  icon={<Wrench />}
                  label="نبذة"
                  value={worker.about}
                  fullWidth
               />
            )}
         </div>

         {/* Services */}
         {worker.services.length > 0 && (
            <div className="space-y-1.5">
               <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <Wrench className="h-3.5 w-3.5" />
                  الخدمات ({worker.services.length})
               </p>
               <div className="flex flex-wrap gap-1.5">
                  {worker.services.map((svc) => (
                     <span
                        key={svc.id}
                        className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium"
                     >
                        {svc.name}
                     </span>
                  ))}
               </div>
            </div>
         )}

         {/* Portfolio images toggle */}
         {slideshowImages.length > 0 && (
            <div className="space-y-2">
               <button
                  type="button"
                  onClick={() => setShowImages((prev) => !prev)}
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
               >
                  <Images className="h-4 w-4" />
                  {showImages
                     ? 'إخفاء الصور'
                     : `عرض صور الأعمال (${slideshowImages.length})`}
                  {showImages ? (
                     <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                     <ChevronDown className="h-3.5 w-3.5" />
                  )}
               </button>
               {showImages && (
                  <div className="w-full sm:w-2/3">
                     <ImageSlideshow
                        images={slideshowImages}
                        aspectRatio="video"
                        showThumbnails={slideshowImages.length > 1}
                        enableLightbox
                     />
                  </div>
               )}
            </div>
         )}

         {/* Actions */}
         <div className="flex items-center justify-end gap-2 pt-1 border-t ">
            {worker.status === 'waiting' && (
               <Button
                  size="sm"
                  onClick={() => onApprove(worker.id)}
                  disabled={isUpdating}
                  className="bg-emerald-600/90 hover:bg-emerald-700 text-white gap-1"
               >
                  <Check className="h-3.5 w-3.5" />
                  قبول
               </Button>
            )}
            {worker.status === 'active' && (
               <Button
                  size="sm"
                  onClick={() => onBlock(worker.id)}
                  disabled={isUpdating}
                  className="bg-red-600 hover:bg-red-700 text-white gap-1"
               >
                  <Ban className="h-3.5 w-3.5" />
                  حظر
               </Button>
            )}
            <Button
               size="sm"
               variant="outline"
               onClick={() => onEdit(worker)}
               className="admin-btn-secondary gap-1"
            >
               <Edit2 className="h-3.5 w-3.5" />
               تعديل
            </Button>
            <Button
               size="sm"
               variant="outline"
               onClick={() => onDelete(worker)}
               className="admin-btn-danger gap-1"
            >
               <Trash2 className="h-3.5 w-3.5" />
               حذف
            </Button>
         </div>
      </div>
   );
}

// ─── Shared info row ───────────────────────────────────────────────────────────

interface InfoRowProps {
   icon: React.ReactNode;
   label: string;
   value: string;
   fullWidth?: boolean;
}

function InfoRow({ icon, label, value, fullWidth }: InfoRowProps) {
   return (
      <div
         className={`flex items-start gap-2 text-gray-700 ${fullWidth ? 'col-span-full sm:col-span-2' : ''}`}
      >
         <span className="mt-0.5 shrink-0 text-gray-400 [&>svg]:h-3.5 [&>svg]:w-3.5">
            {icon}
         </span>
         <span className="text-gray-400 shrink-0">{label}:</span>
         <span className="font-medium wrap-break-word">{value}</span>
      </div>
   );
}
