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
   return <Icon className="h-4 w-4 text-white/40" />;
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
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
               <Input
                  placeholder="البحث بالشارع، المدينة، أو المالك..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-zinc-900 border-white/10 text-white placeholder:text-white/40"
               />
            </div>

            {/* Addresses Table */}
            <div className="border border-white/10 rounded-md overflow-hidden">
               <Table>
                  <TableHeader>
                     <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-white/60">التسمية</TableHead>
                        <TableHead className="text-white/60">العنوان</TableHead>
                        <TableHead className="text-white/60">الموقع</TableHead>
                        <TableHead className="text-white/60">المالك</TableHead>
                        <TableHead className="text-white/60">النوع</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredAddresses.map((address) => (
                        <TableRow
                           key={address.id}
                           className="border-white/10 hover:bg-white/5"
                        >
                           <TableCell>
                              <div className="flex items-center gap-2">
                                 <AddressTypeIcon type={address.type} />
                                 <span className="font-medium text-white">
                                    {address.label}
                                 </span>
                                 {address.isDefault && (
                                    <Badge className="bg-white/10 text-white/80 text-xs">
                                       افتراضي
                                    </Badge>
                                 )}
                              </div>
                           </TableCell>
                           <TableCell>
                              <p className="text-white/80">{address.street}</p>
                              <p className="text-xs text-white/40 font-mono">
                                 {address.id}
                              </p>
                           </TableCell>
                           <TableCell>
                              <p className="text-white/80">
                                 {address.city}, {address.region}
                              </p>
                              <p className="text-xs text-white/40">
                                 {address.zipCode}
                              </p>
                           </TableCell>
                           <TableCell>
                              <div className="flex items-center gap-2">
                                 <User className="h-3 w-3 text-white/40" />
                                 <span className="text-white/80">
                                    {address.owner}
                                 </span>
                              </div>
                           </TableCell>
                           <TableCell>
                              <Badge
                                 variant="secondary"
                                 className="bg-white/10 text-white/80 capitalize"
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
