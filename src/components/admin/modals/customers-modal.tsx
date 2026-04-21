'use client';

import React, { useState } from 'react';
import { Search, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import { AppModal } from '@/components/ui/app-modal';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MOCK_CUSTOMERS } from '@/lib/admin/mock-data';
import type { Customer } from '@/types/admin';
import type { BaseModalProps } from './base-modal';

/**
 * Customers management modal
 * View and manage customer accounts
 */
const columns = [
   {
      key: 'customer',
      header: 'العميل',
      cell: (customer: Customer) => (
         <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
               <AvatarFallback className="bg-gray-100 text-gray-700 text-sm">
                  {customer.name
                     .split(' ')
                     .map((n) => n[0])
                     .join('')}
               </AvatarFallback>
            </Avatar>
            <div>
               <p className="font-medium text-gray-900">{customer.name}</p>
               <p className="text-xs text-gray-500 font-mono">{customer.id}</p>
            </div>
         </div>
      ),
   },
   {
      key: 'contact',
      header: 'جهة الاتصال',
      cell: (customer: Customer) => (
         <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-900">
               <Mail className="h-3 w-3 text-gray-400" />
               {customer.email}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-900">
               <Phone className="h-3 w-3 text-gray-400" />
               {customer.phone}
            </div>
         </div>
      ),
   },
   {
      key: 'location',
      header: 'الموقع',
      cell: (customer: Customer) => (
         <div className="flex items-center gap-2 text-sm text-gray-900">
            <MapPin className="h-3 w-3 text-gray-400" />
            {customer.location}
         </div>
      ),
   },
   {
      key: 'jobs',
      header: 'الوظائف',
      cell: (customer: Customer) => (
         <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900">{customer.jobsCount}</span>
         </div>
      ),
   },
   {
      key: 'status',
      header: 'الحالة',
      cell: (customer: Customer) => (
         <StatusBadge
            status={customer.isActive ? 'active' : 'inactive'}
            label={customer.isActive ? 'نشط' : 'غير نشط'}
         />
      ),
   },
];

export function CustomersModal({ open }: BaseModalProps) {
   const [searchQuery, setSearchQuery] = useState('');

   const filteredCustomers = MOCK_CUSTOMERS.filter(
      (customer) =>
         customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
         customer.phone.includes(searchQuery)
   );

   return (
      <AppModal
         open={open}
         title="إدارة العملاء"
         description="عرض وإدارة حسابات العملاء"
         closeHref="/admin/dashboard"
         closeButtonText="إغلاق"
      >
         <div className="space-y-4">
            <DataTable
               data={filteredCustomers}
               columns={columns}
               keyExtractor={(customer) => customer.id}
               searchQuery={searchQuery}
               onSearchChange={setSearchQuery}
               searchPlaceholder="البحث بالاسم، البريد، أو الهاتف..."
               emptyState={{
                  icon: <Search className="h-10 w-10" />,
                  title: 'لا يوجد عملاء',
                  description: 'لم يتم العثور على عملاء مطابقين لبحثك',
               }}
            />
         </div>
      </AppModal>
   );
}
