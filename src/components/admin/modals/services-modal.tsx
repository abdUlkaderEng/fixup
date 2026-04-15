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
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                     placeholder="البحث في الخدمات..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="pl-10 bg-zinc-900 border-white/10 text-white placeholder:text-white/40"
                  />
               </div>
               <Button className="bg-white text-black hover:bg-white/90 gap-2">
                  <Plus className="h-4 w-4" />
                  إضافة خدمة
               </Button>
            </div>

            {/* Services Table */}
            <div className="border border-white/10 rounded-md overflow-hidden">
               <Table>
                  <TableHeader>
                     <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-white/60">الخدمة</TableHead>
                        <TableHead className="text-white/60">الفئة</TableHead>
                        <TableHead className="text-white/60">
                           نطاق السعر
                        </TableHead>
                        <TableHead className="text-white/60">العمال</TableHead>
                        <TableHead className="text-white/60">الحالة</TableHead>
                        <TableHead className="text-white/60 text-right">
                           الإجراءات
                        </TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredServices.map((service) => (
                        <TableRow
                           key={service.id}
                           className="border-white/10 hover:bg-white/5"
                        >
                           <TableCell>
                              <div className="flex items-center gap-3">
                                 <div className="h-8 w-8 bg-white/10 rounded flex items-center justify-center">
                                    <Wrench className="h-4 w-4 text-white/60" />
                                 </div>
                                 <div>
                                    <p className="font-medium text-white">
                                       {service.name}
                                    </p>
                                    <p className="text-xs text-white/40">
                                       {service.description}
                                    </p>
                                 </div>
                              </div>
                           </TableCell>
                           <TableCell className="text-white/80">
                              {service.category}
                           </TableCell>
                           <TableCell className="text-white/80">
                              {service.price}
                           </TableCell>
                           <TableCell className="text-white/80">
                              {service.workers}
                           </TableCell>
                           <TableCell>
                              <Badge
                                 variant={
                                    service.isActive ? 'default' : 'secondary'
                                 }
                                 className={
                                    service.isActive
                                       ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                       : 'bg-zinc-500/20 text-zinc-400 hover:bg-zinc-500/30'
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
                                    className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
                                    onClick={() =>
                                       handleToggleStatus(service.id)
                                    }
                                 >
                                    <Edit2 className="h-4 w-4" />
                                 </Button>
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-white/60 hover:text-red-400 hover:bg-red-500/10"
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
