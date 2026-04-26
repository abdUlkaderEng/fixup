'use client';

import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { createOrderSchema, type CreateOrderFormValues } from './schema';
import { CreateOrderDetailsSection } from '@/components/orders/create/create-order-details-section';
import { CreateOrderHeader } from '@/components/orders/create/create-order-header';
import { CreateOrderLocationSection } from '@/components/orders/create/create-order-location-section';
import { CreateOrderServicesSection } from '@/components/orders/create/create-order-services-section';
import { CreateOrderSettingsSection } from '@/components/orders/create/create-order-settings-section';
import { CreateOrderSummary } from '@/components/orders/create/create-order-summary';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { usePublicAreas, usePublicCareers, usePublicServices } from '@/hooks';
import { useSearchParams } from 'next/navigation';

export default function CreateOrderPage() {
   const searchParams = useSearchParams();
   const queryCareerId = Number(searchParams.get('careerId'));
   const queryCareerName = searchParams.get('careerName');

   const [selectedCareerId, setSelectedCareerId] = useState<number | undefined>(
      Number.isFinite(queryCareerId) && queryCareerId > 0
         ? queryCareerId
         : undefined
   );
   const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
   const [hasMapSelection, setHasMapSelection] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);

   const mapTilerKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;

   const { careers } = usePublicCareers();

   const { services } = usePublicServices({
      careerId: selectedCareerId,
      perPage: 100,
      autoFetch: Boolean(selectedCareerId),
   });

   const { areas, isLoading: isLoadingAreas } = usePublicAreas({
      perPage: 100,
   });

   const form = useForm<CreateOrderFormValues>({
      resolver: zodResolver(createOrderSchema),
      defaultValues: {
         description: '',
         priority: 'normal',
         budgetTier: 'economic',
         areaAddressId: 0,
         detailedAddress: '',
         latitude: 0,
         longitude: 0,
         image: undefined,
      },
   });

   useEffect(() => {
      if (Number.isFinite(queryCareerId) && queryCareerId > 0) {
         setSelectedCareerId(queryCareerId);
      }
   }, [queryCareerId]);

   useEffect(() => {
      setSelectedServiceIds([]);
   }, [selectedCareerId]);

   const selectedCareer = useMemo(() => {
      if (!selectedCareerId) return undefined;
      return careers.find((career) => career.id === selectedCareerId);
   }, [careers, selectedCareerId]);

   const selectedCareerDisplayName =
      selectedCareer?.name ?? queryCareerName ?? 'غير محدد';

   const selectedServices = useMemo(() => {
      const selectedSet = new Set(selectedServiceIds);
      return services.filter((service) => selectedSet.has(service.id));
   }, [services, selectedServiceIds]);

   const clearSelections = () => {
      setSelectedServiceIds([]);
   };

   const onSubmit = async (values: CreateOrderFormValues) => {
      if (!selectedCareerId) {
         toast.error('يرجى اختيار تصنيف مهني أولاً');
         return;
      }

      if (selectedServiceIds.length === 0) {
         toast.error('يرجى اختيار خدمة واحدة على الأقل');
         return;
      }

      if (!hasMapSelection) {
         toast.error('يرجى تحديد الموقع من الخريطة');
         return;
      }

      setIsSubmitting(true);

      try {
         const payload = {
            career_id: selectedCareerId,
            services: selectedServiceIds.map((serviceId) => ({
               service_id: serviceId,
               quantity: 1,
            })),
            description: values.description,
            priority: values.priority,
            budget_tier: values.budgetTier,
            area_address_id: values.areaAddressId,
            detailed_address: values.detailedAddress,
            latitude: values.latitude,
            longitude: values.longitude,
            has_image: Boolean(values.image),
         };

         console.log('Create order payload:', payload);

         toast.success('تم تجهيز الطلب بنجاح', {
            description: 'تم حفظ بيانات الطلب مبدئياً، وجاهز لربط API الإرسال.',
         });

         form.reset({
            description: '',
            priority: 'normal',
            budgetTier: 'economic',
            areaAddressId: 0,
            detailedAddress: '',
            latitude: 0,
            longitude: 0,
            image: undefined,
         });
         setHasMapSelection(false);
         clearSelections();
      } catch {
         toast.error('تعذر تجهيز الطلب', {
            description: 'حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى.',
         });
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className="app-page-gradient app-page-spacing">
         <div className="container mx-auto px-4">
            <CreateOrderHeader
               selectedCareerDisplayName={selectedCareerDisplayName}
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="space-y-6"
                  >
                     <CreateOrderServicesSection
                        selectedCareerId={selectedCareerId}
                        onCareerChange={setSelectedCareerId}
                        selectedServiceIds={selectedServiceIds}
                        onServicesChange={setSelectedServiceIds}
                     />

                     <CreateOrderDetailsSection control={form.control} />

                     <CreateOrderSettingsSection control={form.control} />

                     <CreateOrderLocationSection
                        control={form.control}
                        setValue={form.setValue}
                        areas={areas}
                        isLoadingAreas={isLoadingAreas}
                        mapTilerKey={mapTilerKey}
                        hasMapSelection={hasMapSelection}
                        onMapSelectionChange={setHasMapSelection}
                     />

                     <Button
                        type="submit"
                        className="h-11 w-full text-base font-semibold"
                        disabled={isSubmitting}
                     >
                        {isSubmitting ? (
                           <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              جاري تجهيز الطلب...
                           </>
                        ) : (
                           'إرسال الطلب'
                        )}
                     </Button>
                  </form>
               </Form>

               <CreateOrderSummary
                  selectedServices={selectedServices}
                  selectedCareerDisplayName={selectedCareerDisplayName}
                  onClear={clearSelections}
               />
            </div>
         </div>
      </div>
   );
}
