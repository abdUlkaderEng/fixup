'use client';
import ServicesGrid from './components/ServicesGrid';
import CartDrawer from './components/CartDrawer';
import { useState } from 'react';
import FiltersSidebar from './components/FiltersSideBar';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/app/store/cartStore';

export default function ServicesPage() {
   const [filters, setFilters] = useState({ budget: 200000, rating: 4 });
   const [openCart, setOpenCart] = useState(false);
   const items = useCartStore((s) => s.items);
   const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

   const services = [
      {
         id: 1,
         name: 'تصليح مجلى',
         description: 'تبديل شطب وتنظيف',
         price: 80000,
      },
      { id: 2, name: 'فك حنفية', description: 'مع التبديل', price: 40000 },
   ];

   return (
      <div className="flex  mt-20 relative">
         <FiltersSidebar filters={filters} setFilters={setFilters} />
         <ServicesGrid services={services} />

         {/* Cart Button */}
         <Button
            className="fixed bottom-6 left-6 z-50  shadow-lg bg-secondary "
            size="lg"
            onClick={() => setOpenCart(true)}
         >
            <ShoppingCart className="w-10 h-10 ml-1 text-foreground/90 " />

            {totalItems > 0 && (
               <span className="  text-foreground/90   py-0.5 text-xs font-bold ">
                  {totalItems}
               </span>
            )}
         </Button>

         <CartDrawer open={openCart} setOpen={setOpenCart} />
      </div>
   );
}
