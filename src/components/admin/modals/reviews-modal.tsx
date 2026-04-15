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
                     : 'text-white/20'
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
      approved: 'bg-emerald-500/20 text-emerald-400',
      pending: 'bg-yellow-500/20 text-yellow-400',
      rejected: 'bg-red-500/20 text-red-400',
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
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                     placeholder="البحث بالعامل، العميل، أو الوظيفة..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="pl-10 bg-zinc-900 border-white/10 text-white placeholder:text-white/40"
                  />
               </div>
               <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40 bg-zinc-900 border-white/10 text-white">
                     <SelectValue placeholder="تصفية حسب الحالة" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10">
                     <SelectItem value="all">جميع الحالات</SelectItem>
                     <SelectItem value="approved">معتمد</SelectItem>
                     <SelectItem value="pending">معلق</SelectItem>
                     <SelectItem value="rejected">مرفوض</SelectItem>
                  </SelectContent>
               </Select>
            </div>

            {/* Reviews Table */}
            <div className="border border-white/10 rounded-md overflow-hidden">
               <Table>
                  <TableHeader>
                     <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-white/60">العامل</TableHead>
                        <TableHead className="text-white/60">التقييم</TableHead>
                        <TableHead className="text-white/60">التقييم</TableHead>
                        <TableHead className="text-white/60">الحالة</TableHead>
                        <TableHead className="text-white/60 text-right">
                           الإجراءات
                        </TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredReviews.map((review) => (
                        <TableRow
                           key={review.id}
                           className="border-white/10 hover:bg-white/5"
                        >
                           <TableCell>
                              <div className="flex items-center gap-3">
                                 <Avatar className="h-9 w-9 bg-white/10">
                                    <AvatarFallback className="bg-white/10 text-white text-sm">
                                       {review.workerName
                                          .split(' ')
                                          .map((n) => n[0])
                                          .join('')}
                                    </AvatarFallback>
                                 </Avatar>
                                 <div>
                                    <p className="font-medium text-white">
                                       {review.workerName}
                                    </p>
                                    <p className="text-xs text-white/40 font-mono">
                                       {review.workerId}
                                    </p>
                                 </div>
                              </div>
                           </TableCell>
                           <TableCell>
                              <div className="space-y-1">
                                 <p className="text-sm text-white/80 max-w-xs truncate">
                                    &ldquo;{review.comment}&rdquo;
                                 </p>
                                 <div className="flex items-center gap-2 text-xs text-white/40">
                                    <User className="h-3 w-3" />
                                    {review.customerName}
                                 </div>
                                 <div className="flex items-center gap-2 text-xs text-white/40">
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
                                    className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
                                 >
                                    <Eye className="h-4 w-4" />
                                 </Button>
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-white/60 hover:text-red-400 hover:bg-red-500/10"
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
