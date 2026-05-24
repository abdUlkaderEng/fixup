import { Hero } from '@/components/sections/hero';
import { ServiceCategories } from '@/components/sections/service-categories';
import { Footer } from '@/components/sections/footer';

export default function Home() {
   return (
      <>
         <Hero />
         <ServiceCategories />
         <Footer />
      </>
   );
}
