import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function Hero() {
   return (
      <section className="relative flex items-center justify-center w-full min-h-screen pt-16">
         <Image
            src="/hero-image.jpg"
            alt="خدمات المنزل الاحترافية"
            width={1920}
            height={1080}
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-75 blur-xs"
            priority
         />
         <div className="absolute inset-0 bg-black/50 z-10"></div>
         <div className="flex  items-center justify-center w-full z-20">
            <div className="container flex flex-col items-center justify-center space-y-6 text-center w-full mx-auto px-4 py-20 z-20">
               <h1 className="text-4xl lg:text-6xl text-right font-bold  text-white ">
                  خدمات منزلية موثوقة بين يديك
               </h1>
               <p className="text-xl text-secondary-foreground text-right    max-w-2xl text-white">
                  فريق محترفين جاهز لتنفيذ أعمال الصيانة والإصلاح بخبرة دقيقة
                  وجودة عالية. من الكهرباء والسباكة إلى التحسينات المنزلية،
                  نساعدك تحصل على خدمة سريعة وآمنة وبأسعار واضحة.
               </p>
               <Button
                  size="lg"
                  className="text-lg w-fit px-8 py-6 mt-8 cursor-pointer hover:bg-transparent hover:border-accent-foreground    "
               >
                  احجز الآن{' '}
               </Button>
            </div>

            <div className="w-[90%]  flex items-center justify-center">
               <Image
                  src="/man.png"
                  alt="محترف خدمات منزلية"
                  width={400}
                  height={400}
                  className="opacity-90  "
                  priority
               />
            </div>
         </div>
      </section>
   );
}
