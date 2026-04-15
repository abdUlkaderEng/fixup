'use client';

import React, { useState } from 'react';
import {
   Search,
   Filter,
   Briefcase,
   MapPin,
   User,
   Calendar,
} from 'lucide-react';
import {
   AdminModal,
   ModalActions,
   CloseButton,
   type BaseModalProps,
} from './base-modal';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { MOCK_JOBS, JOB_STATUS_LABELS } from '@/lib/admin/mock-data';
import type { Job, JobStatus } from '@/types/admin';

/**
 * Status badge component - Arabic labels
 */
function StatusBadge({ status }: { status: JobStatus }) {
   const variants = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      'in-progress': 'bg-blue-500/20 text-blue-400',
      completed: 'bg-emerald-500/20 text-emerald-400',
      cancelled: 'bg-red-500/20 text-red-400',
   };

   const labels = JOB_STATUS_LABELS;

   return (
      <Badge
         variant="secondary"
         className={`${variants[status]} hover:opacity-80`}
      >
         {labels[status]}
      </Badge>
   );
}

/**
 * Jobs management modal
 * View and manage all job listings
 */
export function JobsModal({ open }: BaseModalProps) {
   const [searchQuery, setSearchQuery] = useState('');
   const [statusFilter, setStatusFilter] = useState<string>('all');

   const filteredJobs = MOCK_JOBS.filter((job) => {
      const matchesSearch =
         job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         job.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
         job.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
         statusFilter === 'all' || job.status === statusFilter;
      return matchesSearch && matchesStatus;
   });

   return (
      <AdminModal
         open={open}
         title="إدارة الوظائف"
         description="متابعة وإدارة جميع أنشطة الوظائف"
      >
         <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
               <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                     placeholder="البحث بالمعرف، العنوان، أو العميل..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="pl-10 bg-zinc-900 border-white/10 text-white placeholder:text-white/40"
                  />
               </div>
               <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40 bg-zinc-900 border-white/10 text-white">
                     <Filter className="h-4 w-4 mr-2 text-white/40" />
                     <SelectValue placeholder="تصفية حسب الحالة" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10">
                     <SelectItem value="all">جميع الحالات</SelectItem>
                     <SelectItem value="pending">معلق</SelectItem>
                     <SelectItem value="in-progress">قيد التنفيذ</SelectItem>
                     <SelectItem value="completed">مكتمل</SelectItem>
                     <SelectItem value="cancelled">ملغي</SelectItem>
                  </SelectContent>
               </Select>
            </div>

            {/* Jobs Table */}
            <div className="border border-white/10 rounded-md overflow-hidden">
               <Table>
                  <TableHeader>
                     <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-white/60">
                           معرف الوظيفة
                        </TableHead>
                        <TableHead className="text-white/60">
                           التفاصيل
                        </TableHead>
                        <TableHead className="text-white/60">الخدمة</TableHead>
                        <TableHead className="text-white/60">العامل</TableHead>
                        <TableHead className="text-white/60">الحالة</TableHead>
                        <TableHead className="text-white/60">السعر</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredJobs.map((job) => (
                        <TableRow
                           key={job.id}
                           className="border-white/10 hover:bg-white/5"
                        >
                           <TableCell className="font-mono text-sm text-white/60">
                              {job.id}
                           </TableCell>
                           <TableCell>
                              <div className="space-y-1">
                                 <p className="font-medium text-white">
                                    {job.title}
                                 </p>
                                 <div className="flex items-center gap-2 text-xs text-white/40">
                                    <User className="h-3 w-3" />
                                    {job.customer}
                                 </div>
                                 <div className="flex items-center gap-2 text-xs text-white/40">
                                    <MapPin className="h-3 w-3" />
                                    {job.location}
                                 </div>
                                 <div className="flex items-center gap-2 text-xs text-white/40">
                                    <Calendar className="h-3 w-3" />
                                    {job.date}
                                 </div>
                              </div>
                           </TableCell>
                           <TableCell>
                              <div className="flex items-center gap-2">
                                 <Briefcase className="h-4 w-4 text-white/40" />
                                 <span className="text-white/80">
                                    {job.service}
                                 </span>
                              </div>
                           </TableCell>
                           <TableCell className="text-white/80">
                              {job.worker || (
                                 <span className="text-white/40 italic">
                                    غير معين
                                 </span>
                              )}
                           </TableCell>
                           <TableCell>
                              <StatusBadge status={job.status} />
                           </TableCell>
                           <TableCell className="font-medium text-white">
                              {job.price}
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
