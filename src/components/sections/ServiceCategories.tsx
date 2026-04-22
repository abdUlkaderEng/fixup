'use client';

import { useMemo, type CSSProperties } from 'react';
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { usePublicCareers } from '@/hooks';
import {
   Wrench,
   Zap,
   PaintBucket,
   Hammer,
   Package,
   Droplets,
   Lightbulb,
   Shield,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface CareerGridItem {
   id: number;
   title: string;
   description: string;
   icon: LucideIcon;
   color: string;
}

type CareerGridMeta = Omit<CareerGridItem, 'id' | 'title'>;

const fallbackIcons: LucideIcon[] = [
   Droplets,
   Zap,
   PaintBucket,
   Package,
   Wrench,
   Hammer,
   Lightbulb,
   Shield,
];

const fallbackColors = [
   'bg-blue-500',
   'bg-yellow-500',
   'bg-purple-500',
   'bg-amber-600',
   'bg-gray-600',
   'bg-red-600',
   'bg-orange-500',
   'bg-green-600',
];

const careersGridMetaByName: Record<string, CareerGridMeta> = {
   السباكة: {
      description: 'خدمات سباكة احترافية للإصلاحات والتركيبات والصيانة',
      icon: Droplets,
      color: 'bg-blue-500',
   },
   الكهرباء: {
      description: 'عمل كهربائي احترافي من التوصيلات إلى ترقية لوحات التحكم',
      icon: Zap,
      color: 'bg-yellow-500',
   },
   الطلاء: {
      description: 'خدمات طلاء داخلية وخارجية بجودة عالية',
      icon: PaintBucket,
      color: 'bg-purple-500',
   },
   النجارة: {
      description: 'نجارة مخصصة وأعمال خشبية لمشاريع منزلك',
      icon: Package,
      color: 'bg-amber-600',
   },
   'الإصلاحات العامة': {
      description: 'خدمات الصيانة المنزلية لجميع احتياجات الإصلاح',
      icon: Wrench,
      color: 'bg-gray-600',
   },
   البناء: {
      description: 'خدمات التجديد والبناء المنزلي',
      icon: Hammer,
      color: 'bg-red-600',
   },
   الإضاءة: {
      description: 'خدمات تركيب وتصميم الإضاءة',
      icon: Lightbulb,
      color: 'bg-orange-500',
   },
   'فحص المنزل': {
      description: 'خدمات فحص وصيانة شاملة للمنزل',
      icon: Shield,
      color: 'bg-green-600',
   },
};

export function ServiceCategories() {
   const { careers } = usePublicCareers();

   const careersGrid = useMemo<CareerGridItem[]>(() => {
      return careers.map((career, index) => {
         const fallbackMeta: CareerGridMeta = {
            description: `خدمات ${career.name} احترافية بأفضل جودة`,
            icon: fallbackIcons[index % fallbackIcons.length],
            color: fallbackColors[index % fallbackColors.length],
         };

         const selectedMeta =
            careersGridMetaByName[career.name] ?? fallbackMeta;

         return {
            id: career.id,
            title: career.name,
            ...selectedMeta,
         };
      });
   }, [careers]);

   return (
      <section className="py-20 bg-background min-h-full">
         <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  استعراض فئات الخدمات
               </h2>
               <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  اعثر على المحترف المثالي لاحتياجات خدمات المنزل. خبراؤنا
                  الموثوقون يغطون كل فئة.
               </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {careersGrid.map((career) => {
                  const IconComponent = career.icon;
                  return (
                     <Card
                        key={career.id}
                        className="group transition-all duration-500 border-border bg-card relative  hover:border-transparent max-h-80 flex flex-col"
                        style={
                           {
                              '--hover-bg': career.color
                                 .replace('bg-', '')
                                 .replace('-500', ''),
                           } as CSSProperties
                        }
                     >
                        <div
                           className={`absolute inset-0 ${career.color} opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none`}
                        ></div>
                        <CardHeader className="text-center pb-4 transition-all duration-500">
                           <div className="flex items-center flex-col  justify-center transition-all duration-500">
                              <div
                                 className={`mx-auto w-16 h-16 rounded-full ${career.color} flex items-center justify-center mb-4 
                                    group-hover:w-10 group-hover:h-10 group-hover:translate-x-[275%]
                                    transition-all duration-500`}
                              >
                                 <IconComponent className="w-8 h-8 text-white group-hover:w-6 group-hover:h-6 transition-all duration-500" />
                              </div>
                              <CardTitle
                                 className="text-3xl   text-foreground   
                                                    group-hover:text-foreground group-hover:font-regular  group-hover:-translate-y-[145%]  
                                                    transition-all duration-500"
                              >
                                 <h1>{career.title}</h1>
                              </CardTitle>
                           </div>
                        </CardHeader>
                        <CardContent className=" flex flex-col">
                           <CardDescription
                              className="flex flex-col h-full  text-center text-muted-foreground leading-relaxed
                                                       group-hover:-translate-y-[60%] group-hover:text-foreground
                                                       transition-all duration-500"
                           >
                              <span>{career.description}</span>
                           </CardDescription>
                        </CardContent>
                        <CardFooter
                           className="bg-transparent border-2 border-transparent z-20 
                                                  translate-y-full group-hover:translate-y-0 transition-all duration-500 pt-0 flex justify-start mt-auto pb-4"
                        >
                           <Link
                              href={`/orders/create?careerId=${career.id}&careerName=${encodeURIComponent(career.title)}`}
                              className="group/link flex items-center gap-2 text-sm text-card-foreground/60 font-medium transition-all duration-300 hover:gap-4 hover:text-card-foreground"
                           >
                              <span className="relative">
                                 معاينة الخدمات
                                 <span className="absolute bottom-0 right-0 w-0 h-px  bg-foreground group-hover/link:w-full transition-all duration-300"></span>
                              </span>
                           </Link>
                        </CardFooter>
                     </Card>
                  );
               })}
            </div>
         </div>
      </section>
   );
}
