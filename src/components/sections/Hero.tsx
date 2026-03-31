import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function Hero() {
   return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
         <div className="container mx-auto px-4 py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
               <div className="space-y-8">
                  <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                     خدمات المنزل الاحترافية في متناول يدك
                  </h1>
                  <p className="text-xl text-gray-600 max-w-2xl">
                     تواصل مع محترفين محليين موثوقين لجميع احتياجات الإصلاح
                     والصيانة المنزلية. من السباكة إلى الأعمال الكهربائية، نحن
                     نوفر لك الخبراء الموثوقين.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                     <Button size="lg" className="text-lg px-8 py-6">
                        ابدأ الآن
                     </Button>
                     <Button
                        variant="outline"
                        size="lg"
                        className="text-lg px-8 py-6"
                     >
                        استعرض الخدمات
                     </Button>
                  </div>
               </div>
               <div className="relative">
                  <div className="relative z-10">
                     <Image
                        src="/hero-image.jpg"
                        alt="خدمات المنزل الاحترافية"
                        width={600}
                        height={400}
                        className="rounded-lg shadow-2xl object-cover"
                        priority
                     />
                  </div>
                  <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                  <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
               </div>
            </div>
         </div>
      </section>
   );
}
