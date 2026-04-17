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
      pending: 'bg-yellow-100 text-yellow-700',
      'in-progress': 'bg-blue-100 text-blue-700',
      completed: 'bg-emerald-100 text-emerald-700',
      cancelled: 'bg-red-100 text-red-700',
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
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                     placeholder="البحث بالمعرف، العنوان، أو العميل..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  />
               </div>
               <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40 bg-white border-gray-300 text-gray-900">
                     <Filter className="h-4 w-4 mr-2 text-gray-400" />
                     <SelectValue placeholder="تصفية حسب الحالة" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300">
                     <SelectItem value="all">جميع الحالات</SelectItem>
                     <SelectItem value="pending">معلق</SelectItem>
                     <SelectItem value="in-progress">قيد التنفيذ</SelectItem>
                     <SelectItem value="completed">مكتمل</SelectItem>
                     <SelectItem value="cancelled">ملغي</SelectItem>
                  </SelectContent>
               </Select>
            </div>

            {/* Jobs Table */}
            <div className="border border-gray-200 rounded-md overflow-hidden">
               <Table>
                  <TableHeader>
                     <TableRow className="border-gray-200 hover:bg-transparent">
                        <TableHead className="text-gray-500">
                           معرف الوظيفة
                        </TableHead>
                        <TableHead className="text-gray-500">
                           التفاصيل
                        </TableHead>
                        <TableHead className="text-gray-500">الخدمة</TableHead>
                        <TableHead className="text-gray-500">العامل</TableHead>
                        <TableHead className="text-gray-500">الحالة</TableHead>
                        <TableHead className="text-gray-500">السعر</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredJobs.map((job) => (
                        <TableRow
                           key={job.id}
                           className="border-gray-200 hover:bg-gray-50"
                        >
                           <TableCell className="font-mono text-sm text-gray-500">
                              {job.id}
                           </TableCell>
                           <TableCell>
                              <div className="space-y-1">
                                 <p className="font-medium text-gray-900">
                                    {job.title}
                                 </p>
                                 <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <User className="h-3 w-3" />
                                    {job.customer}
                                 </div>
                                 <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <MapPin className="h-3 w-3" />
                                    {job.location}
                                 </div>
                                 <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <Calendar className="h-3 w-3" />
                                    {job.date}
                                 </div>
                              </div>
                           </TableCell>
                           <TableCell>
                              <div className="flex items-center gap-2">
                                 <Briefcase className="h-4 w-4 text-gray-400" />
                                 <span className="text-gray-700">
                                    {job.service}
                                 </span>
                              </div>
                           </TableCell>
                           <TableCell className="text-gray-700">
                              {job.worker || (
                                 <span className="text-gray-400 italic">
                                    غير معين
                                 </span>
                              )}
                           </TableCell>
                           <TableCell>
                              <StatusBadge status={job.status} />
                           </TableCell>
                           <TableCell className="font-medium text-gray-900">
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
