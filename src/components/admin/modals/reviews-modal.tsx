'use client';

import React, { useState } from 'react';
import { Search, Star, User, Briefcase, Trash2, Eye } from 'lucide-react';
import { AppModal } from '@/components/ui/app-modal';
import { SearchInput } from '@/components/ui/search-input';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { MOCK_REVIEWS, REVIEW_STATUS_LABELS } from '@/lib/admin/mock-data';
import type { ReviewStatus } from '@/types/admin';
import type { BaseModalProps } from './base-modal';

/**
 * Star rating display component
 */
function StarRating({ rating }: { rating: number }) {
   return (
      <div className="flex items-center gap-0.5">
         {Array.from({ length: 5 }).map((_, i) => (
            <Star
               key={i}
               className={`h-4 w-4 ${
                  i < rating
                     ? 'text-yellow-400 fill-yellow-400'
                     : 'text-gray-300'
               }`}
            />
         ))}
      </div>
   );
}

const statusToVariant: Record<
   ReviewStatus,
   { variant: 'approved' | 'pending' | 'rejected'; label: string }
> = {
   approved: { variant: 'approved', label: REVIEW_STATUS_LABELS.approved },
   pending: { variant: 'pending', label: REVIEW_STATUS_LABELS.pending },
   rejected: { variant: 'rejected', label: REVIEW_STATUS_LABELS.rejected },
};

function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
   const config = statusToVariant[status];
   return <StatusBadge status={config.variant} label={config.label} />;
}

const columns = [
   {
      key: 'worker',
      header: 'العامل',
      cell: (review: (typeof MOCK_REVIEWS)[0]) => (
         <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
               <AvatarFallback className="bg-gray-100 text-gray-700 text-sm">
                  {review.workerName
                     .split(' ')
                     .map((n) => n[0])
                     .join('')}
               </AvatarFallback>
            </Avatar>
            <div>
               <p className="font-medium text-gray-900">{review.workerName}</p>
               <p className="text-xs text-gray-500 font-mono">
                  {review.workerId}
               </p>
            </div>
         </div>
      ),
   },
   {
      key: 'review',
      header: 'التقييم',
      cell: (review: (typeof MOCK_REVIEWS)[0]) => (
         <div className="space-y-1">
            <p className="text-sm text-gray-900 max-w-xs truncate">
               &ldquo;{review.comment}&rdquo;
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
               <User className="h-3 w-3" />
               {review.customerName}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
               <Briefcase className="h-3 w-3" />
               {review.jobTitle}
            </div>
         </div>
      ),
   },
   {
      key: 'rating',
      header: 'التقييم',
      cell: (review: (typeof MOCK_REVIEWS)[0]) => (
         <StarRating rating={review.rating} />
      ),
   },
   {
      key: 'status',
      header: 'الحالة',
      cell: (review: (typeof MOCK_REVIEWS)[0]) => (
         <ReviewStatusBadge status={review.status} />
      ),
   },
   {
      key: 'actions',
      header: 'الإجراءات',
      className: 'text-right',
      cell: () => (
         <div className="flex items-center justify-end gap-2">
            <Button
               variant="ghost"
               size="icon"
               className="h-8 w-8 admin-btn-ghost"
            >
               <Eye className="h-4 w-4" />
            </Button>
            <Button
               variant="ghost"
               size="icon"
               className="h-8 w-8 admin-btn-danger"
            >
               <Trash2 className="h-4 w-4" />
            </Button>
         </div>
      ),
   },
];

/**
 * Reviews management modal
 * Review and moderate worker reviews
 */
export function ReviewsModal({ open }: BaseModalProps) {
   const [searchQuery, setSearchQuery] = useState('');
   const [statusFilter, setStatusFilter] = useState<string>('all');

   const filteredReviews = MOCK_REVIEWS.filter((review) => {
      const matchesSearch =
         review.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
         review.customerName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
         review.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
         statusFilter === 'all' || review.status === statusFilter;
      return matchesSearch && matchesStatus;
   });

   return (
      <AppModal
         open={open}
         title="تقييمات العمال"
         description="مراجعة وإدارة تقييمات العملاء للعمال"
         closeHref="/admin/dashboard"
         closeButtonText="إغلاق"
      >
         <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
               <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="البحث بالعامل، العميل، أو الوظيفة..."
                  className="flex-1"
               />
               <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40 admin-input">
                     <SelectValue placeholder="تصفية حسب الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="all">جميع الحالات</SelectItem>
                     <SelectItem value="approved">معتمد</SelectItem>
                     <SelectItem value="pending">معلق</SelectItem>
                     <SelectItem value="rejected">مرفوض</SelectItem>
                  </SelectContent>
               </Select>
            </div>

            <DataTable
               data={filteredReviews}
               columns={columns}
               keyExtractor={(review) => review.id}
               searchable={false}
               showSearch={false}
               emptyState={{
                  icon: <Search className="h-10 w-10" />,
                  title: 'لا يوجد تقييمات',
                  description: 'لم يتم العثور على تقييمات مطابقة لبحثك',
               }}
            />
         </div>
      </AppModal>
   );
}
