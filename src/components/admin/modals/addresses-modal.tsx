'use client';

import React, { useState } from 'react';
import { Search, MapPin, Building, Home, User } from 'lucide-react';
import {
   AdminModal,
   ModalActions,
   CloseButton,
   type BaseModalProps,
} from './base-modal';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { MOCK_ADDRESSES, ADDRESS_TYPE_LABELS } from '@/lib/admin/mock-data';
import type { Address, AddressType } from '@/types/admin';

/**
 * Address type icon component
 */
function AddressTypeIcon({ type }: { type: Address['type'] }) {
   const icons = {
      home: Home,
      work: Building,
      other: MapPin,
   };
   const Icon = icons[type];
   return <Icon className="h-4 w-4 text-gray-400" />;
}

/**
 * Addresses management modal
 */
export function AddressesModal({ open }: BaseModalProps) {
   const [searchQuery, setSearchQuery] = useState('');

   const filteredAddresses = MOCK_ADDRESSES.filter(
      (addr) =>
         addr.street.toLowerCase().includes(searchQuery.toLowerCase()) ||
         addr.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
         addr.owner.toLowerCase().includes(searchQuery.toLowerCase())
   );

   return (
      <AdminModal
         open={open}
         title="إدارة العناوين"
         description="إدارة العناوين المحفوظة في المنصة"
      >
         <div className="space-y-4">
            {/* Search */}
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
               <Input
                  placeholder="البحث بالشارع، المدينة، أو المالك..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
               />
            </div>

            {/* Addresses Table */}
            <div className="border border-gray-200 rounded-md overflow-hidden">
               <Table>
                  <TableHeader>
                     <TableRow className="border-gray-200 hover:bg-transparent">
                        <TableHead className="text-gray-500">التسمية</TableHead>
                        <TableHead className="text-gray-500">العنوان</TableHead>
                        <TableHead className="text-gray-500">الموقع</TableHead>
                        <TableHead className="text-gray-500">المالك</TableHead>
                        <TableHead className="text-gray-500">النوع</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredAddresses.map((address) => (
                        <TableRow
                           key={address.id}
                           className="border-gray-200 hover:bg-gray-50"
                        >
                           <TableCell>
                              <div className="flex items-center gap-2">
                                 <AddressTypeIcon type={address.type} />
                                 <span className="font-medium text-gray-900">
                                    {address.label}
                                 </span>
                                 {address.isDefault && (
                                    <Badge className="bg-gray-100 text-gray-700 text-xs">
                                       افتراضي
                                    </Badge>
                                 )}
                              </div>
                           </TableCell>
                           <TableCell>
                              <p className="text-gray-700">{address.street}</p>
                              <p className="text-xs text-gray-400 font-mono">
                                 {address.id}
                              </p>
                           </TableCell>
                           <TableCell>
                              <p className="text-gray-700">
                                 {address.city}, {address.region}
                              </p>
                              <p className="text-xs text-gray-400">
                                 {address.zipCode}
                              </p>
                           </TableCell>
                           <TableCell>
                              <div className="flex items-center gap-2">
                                 <User className="h-3 w-3 text-gray-400" />
                                 <span className="text-gray-700">
                                    {address.owner}
                                 </span>
                              </div>
                           </TableCell>
                           <TableCell>
                              <Badge
                                 variant="secondary"
                                 className="bg-gray-100 text-gray-700 capitalize"
                              >
                                 {ADDRESS_TYPE_LABELS[address.type]}
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
