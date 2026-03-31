import {
   Card,
   CardContent,
   CardDescription,
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
} from 'lucide-react';

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
      <section className="py-20 bg-white">
         <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  استعراض فئات الخدمات
               </h2>
               <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                        className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-gray-200"
                     >
                        <CardHeader className="text-center pb-4">
                           <div
                              className={`mx-auto w-16 h-16 rounded-full ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                           >
                              <IconComponent className="w-8 h-8 text-white" />
                           </div>
                           <CardTitle className="text-xl font-semibold text-gray-900">
                              {category.title}
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <CardDescription className="text-center text-gray-600 leading-relaxed">
                              {category.description}
                           </CardDescription>
                        </CardContent>
                     </Card>
                  );
               })}
            </div>
         </div>
      </section>
   );
}
