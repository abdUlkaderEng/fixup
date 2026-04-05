import { Service } from '@/app/types/service';
import ServiceCard from './ServiceCard';
interface Props {
   services: Service[];
}
export default function ServicesGrid({ services }: Props) {
   return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-4 flex-1">
         {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
         ))}
      </div>
   );
}
