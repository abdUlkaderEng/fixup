'use client';

import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

import { createOrderSchema, type CreateOrderFormValues } from './schema';
import { useAuthToken } from '@/hooks/use-auth-token';
import { CreateOrderDetailsSection } from '@/components/orders/create/create-order-details-section';
import { CreateOrderHeader } from '@/components/orders/create/create-order-header';
import { CreateOrderLocationSection } from '@/components/orders/create/create-order-location-section';
import { CreateOrderServicesSection } from '@/components/orders/create/create-order-services-section';
import {
   CreateOrderSummary,
   OrderSummaryData,
} from '@/components/orders/create/create-order-summary';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import {
   usePublicAreas,
   usePublicCareers,
   usePublicServices,
   useCreateOrder,
} from '@/hooks';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import CreateOrderSettingsSection from '@/components/orders/create/create-order-settings-section';

export default function CreateOrderPage() {
   useAuthToken();

   const router = useRouter();
   const searchParams = useSearchParams();
   const queryCareerId = Number(searchParams.get('careerId'));
   const queryCareerName = searchParams.get('careerName');
   const { data: session } = useSession();

   const { createOrder, isLoading: isSubmitting } = useCreateOrder();

   const initialCareerId =
      Number.isFinite(queryCareerId) && queryCareerId > 0
         ? queryCareerId
         : undefined;

   const [selectedCareerId, setSelectedCareerId] = useState<number | undefined>(
      initialCareerId
   );
   // Track which career the current service selection belongs to so we can reset on change
   const [servicesCareerId, setServicesCareerId] = useState<number | undefined>(
      initialCareerId
   );
   const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
   const [mapPicked, setMapPicked] = useState(false);
   const [reviewValues, setReviewValues] =
      useState<CreateOrderFormValues | null>(null);

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

   const user = session?.user;
   const areaAddressId = user?.area_address_id;
   const defaultLatitude = user?.latitude ? parseFloat(user.latitude) : 0;
   const defaultLongitude = user?.longitude ? parseFloat(user.longitude) : 0;
   const hasUserLocation = defaultLatitude !== 0 && defaultLongitude !== 0;

   // Derived: map is considered selected if user has saved coords OR manually picked
   const hasMapSelection = hasUserLocation || mapPicked;

   const defaultValues: CreateOrderFormValues = {
      description: '',
      priority: 'normal',
      areaAddressId: typeof areaAddressId === 'number' ? areaAddressId : 0,
      detailedAddress: user?.detailed_address ?? '',
      latitude: defaultLatitude,
      longitude: defaultLongitude,
      images: [],
   };

   const form = useForm<CreateOrderFormValues>({
      resolver: zodResolver(createOrderSchema),
      defaultValues,
   });

   const formValues = useWatch({ control: form.control });

   const hasFormChangedSinceReview =
      !reviewValues ||
      formValues.description !== reviewValues.description ||
      formValues.areaAddressId !== reviewValues.areaAddressId ||
      formValues.detailedAddress !== reviewValues.detailedAddress ||
      formValues.latitude !== reviewValues.latitude ||
      formValues.longitude !== reviewValues.longitude ||
      (formValues.images?.length ?? 0) !== reviewValues.images.length;

   const handleCareerChange = (careerId: number) => {
      setSelectedCareerId(careerId);
      // Reset services only when career actually changes
      if (careerId !== servicesCareerId) {
         setSelectedServiceIds([]);
         setServicesCareerId(careerId);
      }
   };

   const selectedCareer = useMemo(
      () => careers.find((career) => career.id === selectedCareerId),
      [careers, selectedCareerId]
   );

   const selectedCareerDisplayName =
      selectedCareer?.name ?? queryCareerName ?? 'غير محدد';

   const selectedServices = useMemo(() => {
      const selectedSet = new Set(selectedServiceIds);
      return services.filter((service) => selectedSet.has(service.id));
   }, [services, selectedServiceIds]);

   const clearSelections = () => setSelectedServiceIds([]);

   const resetOrderForm = () => {
      setReviewValues(null);
      form.reset({
         description: '',
         priority: 'normal',
         areaAddressId: 0,
         detailedAddress: '',
         latitude: 0,
         longitude: 0,
         images: [],
      });
      setMapPicked(false);
      clearSelections();
   };

   const validateOrderBeforeReview = () => {
      if (!selectedCareerId) {
         toast.error('يرجى اختيار تصنيف مهني أولاً');
         return false;
      }
      if (selectedServiceIds.length === 0) {
         toast.error('يرجى اختيار خدمة واحدة على الأقل');
         return false;
      }
      if (!hasMapSelection) {
         toast.error('يرجى تحديد الموقع من الخريطة');
         return false;
      }
      return true;
   };

   const handleOpenReview = (values: CreateOrderFormValues) => {
      if (!validateOrderBeforeReview()) {
         return;
      }
      setReviewValues(values);
   };

   const reviewData = useMemo<OrderSummaryData | null>(() => {
      if (!reviewValues) return null;
      return {
         careerName: selectedCareerDisplayName,
         services: selectedServices,
         description: reviewValues.description,
         area: areas.find((area) => area.id === reviewValues.areaAddressId),
         detailedAddress: reviewValues.detailedAddress,
         latitude: reviewValues.latitude,
         longitude: reviewValues.longitude,
         imagesCount: reviewValues.images.length,
         priority: reviewValues.priority,
      };
   }, [areas, reviewValues, selectedCareerDisplayName, selectedServices]);

   const submitOrder = async () => {
      if (!reviewValues || !selectedCareerId) return;

      const scheduledAt = new Date();
      scheduledAt.setDate(scheduledAt.getDate() + 1);

      const result = await createOrder({
         description: reviewValues.description,
         scheduled_at: scheduledAt.toISOString().slice(0, 19),
         priority: reviewValues.priority === 'urgent',
         career_id: selectedCareerId,
         services: selectedServiceIds,
         address: {
            latitude: reviewValues.latitude,
            longitude: reviewValues.longitude,
            detailed_address: reviewValues.detailedAddress,
            area_address_id: reviewValues.areaAddressId,
         },
         images: reviewValues.images,
      });

      if (result) {
         resetOrderForm();
         router.push('/customer/orders');
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
                     onSubmit={form.handleSubmit(handleOpenReview)}
                     className="space-y-6"
                  >
                     <CreateOrderServicesSection
                        selectedCareerId={selectedCareerId}
                        onCareerChange={handleCareerChange}
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
                        onMapSelectionChange={setMapPicked}
                     />

                     <Button
                        type="submit"
                        className="h-11 w-full text-base font-semibold"
                        disabled={isSubmitting || !hasFormChangedSinceReview}
                     >
                        {isSubmitting ? (
                           <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              جاري تجهيز الطلب...
                           </>
                        ) : (
                           'مراجعة الطلب'
                        )}
                     </Button>
                  </form>
               </Form>

               <CreateOrderSummary
                  selectedServices={selectedServices}
                  selectedCareerDisplayName={selectedCareerDisplayName}
                  onClear={clearSelections}
                  reviewData={reviewData}
                  onConfirm={submitOrder}
                  isSubmitting={isSubmitting}
               />
            </div>
         </div>
      </div>
   );
}
