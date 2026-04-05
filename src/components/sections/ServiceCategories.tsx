import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import {
   Wrench,
   Zap,
   PaintBucket,
   Hammer,
   Package,
   Droplets,
   Lightbulb,
   Shield,
   ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

const categories = [
   {
      id: 1,
      title: 'السباكة',
      description: 'خدمات سباكة احترافية للإصلاحات والتركيبات والصيانة',
      icon: Droplets,
      color: 'bg-blue-500',
   },
   {
      id: 2,
      title: 'الكهرباء',
      description: 'عمل كهربائي احترافي من التوصيلات إلى ترقية لوحات التحكم',
      icon: Zap,
      color: 'bg-yellow-500',
   },
   {
      id: 3,
      title: 'الطلاء',
      description: 'خدمات طلاء داخلية وخارجية بجودة عالية',
      icon: PaintBucket,
      color: 'bg-purple-500',
   },
   {
      id: 4,
      title: 'النجارة',
      description: 'نجارة مخصصة وأعمال خشبية لمشاريع منزلك',
      icon: Package,
      color: 'bg-amber-600',
   },
   {
      id: 5,
      title: 'الإصلاحات العامة',
      description: 'خدمات الصيانة المنزلية لجميع احتياجات الإصلاح',
      icon: Wrench,
      color: 'bg-gray-600',
   },
   {
      id: 6,
      title: 'البناء',
      description: 'خدمات التجديد والبناء المنزلي',
      icon: Hammer,
      color: 'bg-red-600',
   },
   {
      id: 7,
      title: 'الإضاءة',
      description: 'خدمات تركيب وتصميم الإضاءة',
      icon: Lightbulb,
      color: 'bg-orange-500',
   },
   {
      id: 8,
      title: 'فحص المنزل',
      description: 'خدمات فحص وصيانة شاملة للمنزل',
      icon: Shield,
      color: 'bg-green-600',
   },
];

export function ServiceCategories() {
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
               {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                     <Card
                        key={category.id}
                        className="group transition-all duration-500 border-border bg-card relative  hover:border-transparent max-h-80 flex flex-col"
                        style={
                           {
                              '--hover-bg': category.color
                                 .replace('bg-', '')
                                 .replace('-500', ''),
                           } as React.CSSProperties
                        }
                     >
                        <div
                           className={`absolute inset-0 ${category.color} opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none`}
                        ></div>
                        <CardHeader className="text-center pb-4 transition-all duration-500">
                           <div className="flex items-center flex-col  justify-center transition-all duration-500">
                              <div
                                 className={`mx-auto w-16 h-16 rounded-full ${category.color} flex items-center justify-center mb-4 
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
                                 <h1>{category.title}</h1>
                              </CardTitle>
                           </div>
                        </CardHeader>
                        <CardContent className=" flex flex-col">
                           <CardDescription
                              className="flex flex-col h-full  text-center text-muted-foreground leading-relaxed
                                                       group-hover:-translate-y-[60%] group-hover:text-foreground
                                                       transition-all duration-500"
                           >
                              <span>{category.description}</span>
                           </CardDescription>
                        </CardContent>
                        <CardFooter
                           className="bg-transparent border-2 border-transparent z-20 
                                                  translate-y-full group-hover:translate-y-0 transition-all duration-500 pt-0 flex justify-start mt-auto pb-4"
                        >
                           <Link
                              href="/services"
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
