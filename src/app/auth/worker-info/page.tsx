'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
   ArrowLeft,
   BriefcaseBusiness,
   FileImage,
   FileText,
   Loader2,
   Mail,
   Phone,
   User,
   Wrench,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import CareerSelect from '@/components/publicComponents/career-select';
import ServicesPicker from '@/components/publicComponents/services-picker';
import { ImageUploadField } from '@/components/image-upload';
import { getWorkerSignupDraft, type WorkerSignupDraft } from '../signup-flow';
import { workerInfoSchema, type WorkerInfoInput } from '../schemas';
import { useWorkerRegister } from '@/hooks/use-worker-register';
import { usePublicCareers } from '@/hooks/public/use-public-careers';

export default function WorkerInfoPage() {
   const router = useRouter();
   const [signupDraft, setSignupDraft] = useState<WorkerSignupDraft | null>(
      null
   );
   const [isPageReady, setIsPageReady] = useState(false);

   const form = useForm<WorkerInfoInput>({
      resolver: zodResolver(workerInfoSchema),
      defaultValues: {
         career_id: 0,
         about: '',
         years_experience: 0,
         images: [],
         services: [],
      },
   });

   useEffect(() => {
      const draft = getWorkerSignupDraft();
      if (!draft) {
         router.replace('/auth/signup');
         return;
      }
      setSignupDraft(draft);
      setIsPageReady(true);
   }, [router]);

   const { isSubmitting, onSubmit } = useWorkerRegister(signupDraft);
   const { isLoading: isLoadingCareers } = usePublicCareers();
   const selectedCareerId = form.watch('career_id');

   useEffect(() => {
      if (selectedCareerId) {
         form.setValue('services', []);
      }
   }, [selectedCareerId, form]);

   if (!isPageReady || !signupDraft) {
      return (
         <div className="mt-16 flex min-h-[calc(100vh-4rem)] items-center justify-center bg-linear-to-br from-background via-muted/50 to-background p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
               <Loader2 className="h-4 w-4 animate-spin" />
               جاري تجهيز بيانات العامل...
            </div>
         </div>
      );
   }

   return (
      <div className="mt-16 flex min-h-[calc(100vh-4rem)] items-center justify-center bg-linear-to-br from-background via-muted/50 to-background p-4 sm:p-6 lg:p-8">
         <div className="w-full max-w-3xl">
            <Link
               href="/auth/signup"
               className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
               <ArrowLeft className="h-4 w-4" />
               <span>العودة إلى التسجيل</span>
            </Link>

            <div className="rounded-2xl border bg-card p-6 shadow-lg sm:p-8">
               <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                     <BriefcaseBusiness className="h-8 w-8 text-primary" />
                  </div>
                  <h1 className="mb-2 text-2xl font-bold">
                     استكمال بيانات العامل
                  </h1>
                  <p className="text-sm text-muted-foreground">
                     أضف معلوماتك المهنية والخدمات التي تقدمها ليتم قبولها من
                     قبل المسؤوولين.
                  </p>
               </div>

               <div className="mb-6 grid gap-3 rounded-xl border border-border/70 bg-muted/40 p-4 sm:grid-cols-3">
                  <div className="flex items-center gap-2 text-sm">
                     <User className="h-4 w-4 text-primary" />
                     <span className="truncate">{signupDraft.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                     <Mail className="h-4 w-4 text-primary" />
                     <span className="truncate">{signupDraft.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                     <Phone className="h-4 w-4 text-primary" />
                     <span className="truncate">
                        {signupDraft.phone_number}
                     </span>
                  </div>
               </div>

               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="space-y-6"
                  >
                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField
                           control={form.control}
                           name="career_id"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>المجال المهني</FormLabel>
                                 <CareerSelect
                                    value={field.value ?? null}
                                    onChange={(v) => field.onChange(v ?? 0)}
                                    disabled={isLoadingCareers || isSubmitting}
                                 />
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <FormField
                           control={form.control}
                           name="years_experience"
                           render={({ field, fieldState }) => (
                              <FormItem>
                                 <FormLabel>سنوات الخبرة</FormLabel>
                                 <FormControl>
                                    <Input
                                       type="number"
                                       min={0}
                                       value={field.value}
                                       onChange={(e) =>
                                          field.onChange(Number(e.target.value))
                                       }
                                       disabled={isSubmitting}
                                       aria-invalid={!!fieldState.error}
                                       className="h-11 text-right"
                                       placeholder="0"
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>

                     <FormField
                        control={form.control}
                        name="about"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                 <FileText className="h-4 w-4 text-primary" />
                                 <span>نبذة عنك</span>
                              </FormLabel>
                              <FormControl>
                                 <Textarea
                                    {...field}
                                    placeholder="اكتب وصفاً واضحاً عن خبراتك، مهاراتك، ونوعية الأعمال التي تنفذها."
                                    className="min-h-32 text-right"
                                    disabled={isSubmitting}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                 <FileImage className="h-4 w-4 text-primary" />
                                 <span>صور الأعمال</span>
                              </FormLabel>
                              <FormControl>
                                 <ImageUploadField
                                    state={{
                                       existingImages: [],
                                       newFiles: field.value ?? [],
                                       deletedIds: [],
                                    }}
                                    callbacks={{
                                       onNewFilesAdd: (files) =>
                                          field.onChange([
                                             ...(field.value ?? []),
                                             ...files,
                                          ]),
                                       onNewFileRemove: (index) => {
                                          const current = field.value ?? [];
                                          field.onChange(
                                             current.filter(
                                                (_, i) => i !== index
                                             )
                                          );
                                       },
                                       onExistingImageDelete: () => {},
                                       onExistingImageRestore: () => {},
                                    }}
                                    config={{
                                       imageBaseUrl:
                                          process.env.NEXT_PUBLIC_IMAGE_URL ||
                                          '',
                                    }}
                                    isEditing={true}
                                    disabled={isSubmitting}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="services"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                 <Wrench className="h-4 w-4 text-primary" />
                                 <span>الخدمات المتاحة</span>
                              </FormLabel>
                              <ServicesPicker
                                 careerId={selectedCareerId}
                                 value={field.value}
                                 onChange={field.onChange}
                                 disabled={isSubmitting}
                              />
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <Button
                        type="submit"
                        className="h-11 w-full"
                        disabled={isSubmitting}
                     >
                        {isSubmitting ? (
                           <>
                              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                              جاري إنشاء حساب العامل...
                           </>
                        ) : (
                           'إنشاء حساب العامل'
                        )}
                     </Button>
                  </form>
               </Form>
            </div>
         </div>
      </div>
   );
}
