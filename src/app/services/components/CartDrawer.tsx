'use client';

import { useCartStore } from '@/app/store/cartStore';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingCart } from 'lucide-react';

interface CartDrawerProps {
   open: boolean;
   setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CartDrawer({ open, setOpen }: CartDrawerProps) {
   const { items, clearCart } = useCartStore();

   const total = items.reduce((t, i) => t + i.price * i.qty, 0);

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogContent className="sm:max-w-md backdrop-blur-sm">
            <DialogHeader className="flex items-center">
               <DialogTitle className=" gap-2 text-2xl mb-4">
                  الخدمات المطلوبة
               </DialogTitle>
               <DialogDescription>
                  {items.length === 0
                     ? 'لا يوجد خدمات'
                     : `${items.reduce((sum, i) => sum + i.qty, 0)} خدمة`}
               </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
               {items.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                     أضف بعض الخدمات إلى السلة
                  </div>
               ) : (
                  <>
                     <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-modern">
                        {items.map((i) => (
                           <div
                              key={i.id}
                              className="flex justify-between items-center p-3  rounded-lg"
                           >
                              <div className="flex flex-col">
                                 <span className="font-medium">{i.name}</span>
                                 <span className="text-sm text-muted-foreground">
                                    العدد: {i.qty}
                                 </span>
                              </div>
                              <span className="font-bold ">
                                 {i.price * i.qty} ل.س
                              </span>
                           </div>
                        ))}
                     </div>

                     <div className="flex justify-between items-center font-bold pt-4 border-t">
                        <span className="text-lg">المجموع</span>
                        <span className="text-xl ">{total} ل.س</span>
                     </div>

                     <Button
                        onClick={clearCart}
                        className=" h-10 w-15 bg-transparent text-destructive border border-destructive hover:bg-destructive hover:text-white"
                     >
                        <Trash2 className="w-10 h-10 " />
                     </Button>
                  </>
               )}
            </div>
         </DialogContent>
      </Dialog>
   );
}
