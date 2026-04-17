'use client';

import React, { useState } from 'react';
import { Search, Star, User, Briefcase, Trash2, Eye } from 'lucide-react';
import {
   AdminModal,
   ModalActions,
   CloseButton,
   type BaseModalProps,
} from './base-modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { MOCK_REVIEWS, REVIEW_STATUS_LABELS } from '@/lib/admin/mock-data';
import type { ReviewStatus } from '@/types/admin';

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

/**
 * Status badge component - Arabic labels
 */
function StatusBadge({ status }: { status: ReviewStatus }) {
   const styles = {
      approved: 'bg-emerald-100 text-emerald-700',
      pending: 'bg-yellow-100 text-yellow-700',
      rejected: 'bg-red-100 text-red-700',
   };

   const labels = REVIEW_STATUS_LABELS;

   return (
      <Badge variant="secondary" className={`${styles[status]}`}>
         {labels[status]}
      </Badge>
   );
}

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
      <AdminModal
         open={open}
         title="تقييمات العمال"
         description="مراجعة وإدارة تقييمات العملاء للعمال"
      >
         <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
               <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                     placeholder="البحث بالعامل، العميل، أو الوظيفة..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  />
               </div>
               <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40 bg-white border-gray-300 text-gray-900">
                     <SelectValue placeholder="تصفية حسب الحالة" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300">
                     <SelectItem value="all">جميع الحالات</SelectItem>
                     <SelectItem value="approved">معتمد</SelectItem>
                     <SelectItem value="pending">معلق</SelectItem>
                     <SelectItem value="rejected">مرفوض</SelectItem>
                  </SelectContent>
               </Select>
            </div>

            {/* Reviews Table */}
            <div className="border border-gray-200 rounded-md overflow-hidden">
               <Table>
                  <TableHeader>
                     <TableRow className="border-gray-200 hover:bg-transparent">
                        <TableHead className="text-gray-500">العامل</TableHead>
                        <TableHead className="text-gray-500">التقييم</TableHead>
                        <TableHead className="text-gray-500">التقييم</TableHead>
                        <TableHead className="text-gray-500">الحالة</TableHead>
                        <TableHead className="text-gray-500 text-right">
                           الإجراءات
                        </TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredReviews.map((review) => (
                        <TableRow
                           key={review.id}
                           className="border-gray-200 hover:bg-gray-50"
                        >
                           <TableCell>
                              <div className="flex items-center gap-3">
                                 <Avatar className="h-9 w-9 bg-gray-200">
                                    <AvatarFallback className="bg-gray-200 text-gray-700 text-sm">
                                       {review.workerName
                                          .split(' ')
                                          .map((n) => n[0])
                                          .join('')}
                                    </AvatarFallback>
                                 </Avatar>
                                 <div>
                                    <p className="font-medium text-gray-900">
                                       {review.workerName}
                                    </p>
                                    <p className="text-xs text-gray-400 font-mono">
                                       {review.workerId}
                                    </p>
                                 </div>
                              </div>
                           </TableCell>
                           <TableCell>
                              <div className="space-y-1">
                                 <p className="text-sm text-gray-700 max-w-xs truncate">
                                    &ldquo;{review.comment}&rdquo;
                                 </p>
                                 <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <User className="h-3 w-3" />
                                    {review.customerName}
                                 </div>
                                 <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <Briefcase className="h-3 w-3" />
                                    {review.jobTitle}
                                 </div>
                              </div>
                           </TableCell>
                           <TableCell>
                              <StarRating rating={review.rating} />
                           </TableCell>
                           <TableCell>
                              <StatusBadge status={review.status} />
                           </TableCell>
                           <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                 >
                                    <Eye className="h-4 w-4" />
                                 </Button>
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-100"
                                 >
                                    <Trash2 className="h-4 w-4" />
                                 </Button>
                              </div>
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </div>

            <ModalActions>
               <CloseButton />
            </ModalActions>
         </div>
      </AdminModal>
   );
}
