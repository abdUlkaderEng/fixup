'use client';

import React, { useState } from 'react';
import { Search, Mail, Phone, MapPin } from 'lucide-react';
import {
   AdminModal,
   ModalActions,
   CloseButton,
   type BaseModalProps,
} from './base-modal';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { MOCK_CUSTOMERS } from '@/lib/admin/mock-data';
import type { Customer } from '@/types/admin';

/**
 * Customers management modal
 * View and manage customer accounts
 */
export function CustomersModal({ open }: BaseModalProps) {
   const [searchQuery, setSearchQuery] = useState('');

   const filteredCustomers = MOCK_CUSTOMERS.filter(
      (customer) =>
         customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
         customer.phone.includes(searchQuery)
   );

   return (
      <AdminModal
         open={open}
         title="إدارة العملاء"
         description="عرض وإدارة حسابات العملاء"
      >
         <div className="space-y-4">
            {/* Search */}
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
               <Input
                  placeholder="البحث بالاسم، البريد، أو الهاتف..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-zinc-900 border-white/10 text-white placeholder:text-white/40"
               />
            </div>

            {/* Customers Table */}
            <div className="border border-white/10 rounded-md overflow-hidden">
               <Table>
                  <TableHeader>
                     <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-white/60">العميل</TableHead>
                        <TableHead className="text-white/60">
                           جهة الاتصال
                        </TableHead>
                        <TableHead className="text-white/60">الموقع</TableHead>
                        <TableHead className="text-white/60">الوظائف</TableHead>
                        <TableHead className="text-white/60">الحالة</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredCustomers.map((customer) => (
                        <TableRow
                           key={customer.id}
                           className="border-white/10 hover:bg-white/5"
                        >
                           <TableCell>
                              <div className="flex items-center gap-3">
                                 <Avatar className="h-9 w-9 bg-white/10">
                                    <AvatarFallback className="bg-white/10 text-white text-sm">
                                       {customer.name
                                          .split(' ')
                                          .map((n) => n[0])
                                          .join('')}
                                    </AvatarFallback>
                                 </Avatar>
                                 <div>
                                    <p className="font-medium text-white">
                                       {customer.name}
                                    </p>
                                    <p className="text-xs text-white/40 font-mono">
                                       {customer.id}
                                    </p>
                                 </div>
                              </div>
                           </TableCell>
                           <TableCell>
                              <div className="space-y-1">
                                 <div className="flex items-center gap-2 text-sm text-white/80">
                                    <Mail className="h-3 w-3 text-white/40" />
                                    {customer.email}
                                 </div>
                                 <div className="flex items-center gap-2 text-sm text-white/80">
                                    <Phone className="h-3 w-3 text-white/40" />
                                    {customer.phone}
                                 </div>
                              </div>
                           </TableCell>
                           <TableCell>
                              <div className="flex items-center gap-2 text-sm text-white/80">
                                 <MapPin className="h-3 w-3 text-white/40" />
                                 {customer.location}
                              </div>
                           </TableCell>
                           <TableCell>
                              <div className="flex items-center gap-2">
                                 <BriefcaseIcon className="h-4 w-4 text-white/40" />
                                 <span className="text-white/80">
                                    {customer.jobsCount}
                                 </span>
                              </div>
                           </TableCell>
                           <TableCell>
                              <Badge
                                 variant={
                                    customer.isActive ? 'default' : 'secondary'
                                 }
                                 className={
                                    customer.isActive
                                       ? 'bg-emerald-500/20 text-emerald-400'
                                       : 'bg-zinc-500/20 text-zinc-400'
                                 }
                              >
                                 {customer.isActive ? 'نشط' : 'غير نشط'}
                              </Badge>
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

// Briefcase icon component
function BriefcaseIcon({ className }: { className?: string }) {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
         className={className}
      >
         <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
         <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
   );
}
