'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/app/store/cartStore';
import { Service } from '@/app/types/service';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

interface Props {
   service: Service;
}

export default function ServiceCard({ service }: Props) {
   const addItem = useCartStore((s) => s.addItem);
   const removeItem = useCartStore((s) => s.removeItem);
   const items = useCartStore((s) => s.items);
   const current = items.find((i) => i.id === service.id);

   return (
      <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card">
         {/* Image Container */}
         <div className="relative h-48 w-full overflow-hidden">
            <Image
               src={`/service-${service.id}.jpg`}
               alt={service.name}
               fill
               className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

            {/* Price Badge */}
            <div className="absolute top-3 right-3 bg-secondary text-secondary-foreground px-3 py-1 rounded-full font-bold text-sm shadow-lg">
               {service.price.toLocaleString()} ل.س
            </div>
         </div>

         <CardContent className="p-5">
            {/* Title */}
            <h3 className="text-xl font-bold mb-2 text-foreground">
               {service.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-5 line-clamp-2">
               {service.description}
            </p>

            {/* Add to Cart Section */}
            <div className="flex items-center justify-between gap-3">
               <div className="flex items-center w-full gap-2">
                  <Button
                     size="icon"
                     variant="outline"
                     disabled={current ? false : true}
                     className="h-10 w-10 rounded-full border-destructive/50 hover:bg-destructive/20  hover:border-destructive"
                     onClick={() => removeItem(service.id)}
                  >
                     <Minus className="w-4 h-4 text-destructive" />
                  </Button>

                  <div
                     className={`flex-1 flex items-center justify-center gap-2 bg-muted rounded-full py-2 px-4 h-10`}
                  >
                     <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                     <span className="font-bold text-lg">{current?.qty}</span>
                  </div>

                  <Button
                     size="icon"
                     variant="outline"
                     className="h-10 w-10 rounded-full border-secondary/50 hover:bg-secondary/20 hover:border-secondary"
                     onClick={() => addItem(service)}
                  >
                     <Plus className="w-4 h-4 text-secondary" />
                  </Button>
               </div>
            </div>
         </CardContent>
      </Card>
   );
}
