'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Wrench } from 'lucide-react';
import {
   AdminModal,
   ModalActions,
   CloseButton,
   PrimaryButton,
   type BaseModalProps,
} from './base-modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MOCK_SERVICES } from '@/lib/admin/mock-data';
import type { Service } from '@/types/admin';

/**
 * Services management modal
 * Allows CRUD operations on services catalog
 */
export function ServicesModal({ open }: BaseModalProps) {
   const [searchQuery, setSearchQuery] = useState('');
   const [services, setServices] = useState(MOCK_SERVICES);

   const filteredServices = services.filter(
      (service) =>
         service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         service.category.toLowerCase().includes(searchQuery.toLowerCase())
   );

   const handleDeleteService = (id: string) => {
      setServices((prev) => prev.filter((s) => s.id !== id));
   };

   const handleToggleStatus = (id: string) => {
      setServices((prev) =>
         prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
      );
   };

   return (
      <AdminModal
         open={open}
         title="إدارة الخدمات"
         description="إدارة كتالوج الخدمات والأسعار"
      >
         <div className="space-y-4">
            {/* Search and Add */}
            <div className="flex items-center gap-3">
               <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                     placeholder="البحث في الخدمات..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  />
               </div>
               <Button className="bg-gray-900 text-white hover:bg-gray-800 gap-2">
                  <Plus className="h-4 w-4" />
                  إضافة خدمة
               </Button>
            </div>

            {/* Services Table */}
            <div className="border border-gray-200 rounded-md overflow-hidden">
               <Table>
                  <TableHeader>
                     <TableRow className="border-gray-200 hover:bg-transparent">
                        <TableHead className="text-gray-500">الخدمة</TableHead>
                        <TableHead className="text-gray-500">الفئة</TableHead>
                        <TableHead className="text-gray-500">
                           نطاق السعر
                        </TableHead>
                        <TableHead className="text-gray-500">العمال</TableHead>
                        <TableHead className="text-gray-500">الحالة</TableHead>
                        <TableHead className="text-gray-500 text-right">
                           الإجراءات
                        </TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredServices.map((service) => (
                        <TableRow
                           key={service.id}
                           className="border-gray-200 hover:bg-gray-50"
                        >
                           <TableCell>
                              <div className="flex items-center gap-3">
                                 <div className="h-8 w-8 bg-gray-100 rounded flex items-center justify-center">
                                    <Wrench className="h-4 w-4 text-gray-500" />
                                 </div>
                                 <div>
                                    <p className="font-medium text-gray-900">
                                       {service.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                       {service.description}
                                    </p>
                                 </div>
                              </div>
                           </TableCell>
                           <TableCell className="text-gray-700">
                              {service.category}
                           </TableCell>
                           <TableCell className="text-gray-700">
                              {service.price}
                           </TableCell>
                           <TableCell className="text-gray-700">
                              {service.workers}
                           </TableCell>
                           <TableCell>
                              <Badge
                                 variant={
                                    service.isActive ? 'default' : 'secondary'
                                 }
                                 className={
                                    service.isActive
                                       ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                       : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                 }
                              >
                                 {service.isActive ? 'نشط' : 'غير نشط'}
                              </Badge>
                           </TableCell>
                           <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                    onClick={() =>
                                       handleToggleStatus(service.id)
                                    }
                                 >
                                    <Edit2 className="h-4 w-4" />
                                 </Button>
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-100"
                                    onClick={() =>
                                       handleDeleteService(service.id)
                                    }
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
               <PrimaryButton>حفظ التغييرات</PrimaryButton>
            </ModalActions>
         </div>
      </AdminModal>
   );
}
