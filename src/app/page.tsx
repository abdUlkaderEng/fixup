import { Hero } from '@/components/sections/Hero';
import { ServiceCategories } from '@/components/sections/ServiceCategories';
import { Footer } from '@/components/sections/Footer';

export default function Home() {
   return (
      <main>
         <Hero />
         <ServiceCategories />
         <Footer />
      </main>
   );
}
