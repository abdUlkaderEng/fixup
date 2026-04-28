'use client';

import { useSession } from 'next-auth/react';
import { Pencil, LogOut, X, Check, Loader2, Wrench } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useAuthToken } from '@/hooks/use-auth-token';
import { useLogout } from '@/hooks/use-logout';
import { useProfileForm, useProfileSubmit } from './hooks';
import { useProfileMode } from './ProfileModeProvider';
import {
   LoadingState,
   UnauthenticatedState,
   BackLink,
   ProfileHeader,
   EmailField,
   PhoneField,
   AddressField,
   BirthDateField,
   RoleField,
   CreatedAtField,
   AboutField,
   YearsExperienceField,
   AccountStatusField,
   CareerField,
   ServicesField,
   WorkerImagesField,
} from './components';

interface ProfileViewProps {
   backLink?: string;
   backLabel?: string;
   roleLabel?: string;
}

const BASE_FORM_ID = 'base-profile-form';
const WORKER_FORM_ID = 'worker-profile-form';

function SectionHeader({
   title,
   subtitle,
   action,
}: {
   title: string;
   subtitle?: string;
   action?: React.ReactNode;
}) {
   return (
      <div className="flex items-start justify-between mb-6">
         <div>
            <h2 className="text-xl font-semibold">{title}</h2>
            {subtitle && (
               <p className="text-sm text-muted-foreground mt-0.5">
                  {subtitle}
               </p>
            )}
         </div>
         {action}
      </div>
   );
}

function SaveCancelBar({
   isSubmitting,
   onCancel,
   formId,
}: {
   isSubmitting: boolean;
   onCancel: () => void;
   formId: string;
}) {
   return (
      <div className="flex gap-3 mt-6">
         <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 h-11 gap-2"
         >
            <X className="h-4 w-4" />
            إلغاء
         </Button>
         <Button
            type="submit"
            form={formId}
            disabled={isSubmitting}
            className="flex-1 h-11 gap-2"
         >
            {isSubmitting ? (
               <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري الحفظ...
               </>
            ) : (
               <>
                  <Check className="h-4 w-4" />
                  حفظ التغييرات
               </>
            )}
         </Button>
      </div>
   );
}

export function ProfileView({
   backLink = '/',
   backLabel = 'العودة للرئيسية',
   roleLabel,
}: ProfileViewProps) {
   const { data: session, status } = useSession();
   const user = session?.user;
   const isAuthenticated = status === 'authenticated';
   const { mode } = useProfileMode();
   const isWorker = mode === 'worker';

   useAuthToken();

   const {
      baseForm,
      workerForm,
      editMode,
      handleEditBase,
      handleEditWorker,
      handleCancel,
   } = useProfileForm({ user, isWorker });

   const { isSubmitting, submitBase, submitWorker } = useProfileSubmit(
      user,
      handleCancel
   );
   const handleLogout = useLogout();

   if (status === 'loading') return <LoadingState />;
   if (!isAuthenticated || !user) return <UnauthenticatedState />;

   const isEditingBase = editMode === 'base';
   const isEditingWorker = editMode === 'worker';
   const displayRole = roleLabel || user.role;

   return (
      <div className="min-h-[calc(100vh-4rem)] mt-16 bg-linear-to-br from-background via-muted/30 to-background">
         <div className=" max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <BackLink href={backLink} label={backLabel} />

            {/* Profile avatar + name hero */}
            <Form {...baseForm}>
               <form
                  id={BASE_FORM_ID}
                  onSubmit={baseForm.handleSubmit(submitBase)}
               >
                  <div className="mb-8">
                     <ProfileHeader
                        name={user.name}
                        email={user.email}
                        profileImage={user.profile_image}
                        form={baseForm}
                        isEditing={isEditingBase}
                     />
                  </div>

                  {/* Section 1 — Base profile */}
                  <div className="rounded-2xl border border-border/60 bg-card shadow-xs mb-6">
                     <div className="p-6">
                        <SectionHeader
                           title="البيانات الشخصية"
                           subtitle="معلوماتك الأساسية ومعلومات التواصل"
                           action={
                              !isEditingBase && !isEditingWorker ? (
                                 <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleEditBase}
                                    className="gap-2 shrink-0"
                                 >
                                    <Pencil className="h-3.5 w-3.5" />
                                    تعديل
                                 </Button>
                              ) : null
                           }
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <EmailField
                              email={user.email}
                              verified={!!user.email_verified_at}
                           />
                           <PhoneField
                              form={baseForm}
                              isEditing={isEditingBase}
                              user={user}
                           />
                           <BirthDateField
                              form={baseForm}
                              isEditing={isEditingBase}
                              user={user}
                           />
                           <RoleField role={displayRole} />
                           <CreatedAtField createdAt={user.created_at} />
                           {/* Address spans full width — map needs space */}
                           <div className="md:col-span-2">
                              <AddressField
                                 form={baseForm}
                                 isEditing={isEditingBase}
                                 user={user}
                              />
                           </div>
                        </div>

                        {isEditingBase && (
                           <SaveCancelBar
                              isSubmitting={isSubmitting}
                              onCancel={handleCancel}
                              formId={BASE_FORM_ID}
                           />
                        )}
                     </div>
                  </div>
               </form>
            </Form>

            {/* Section 2 — Worker data + logout */}
            {isWorker ? (
               <Form {...workerForm}>
                  <form
                     id={WORKER_FORM_ID}
                     onSubmit={workerForm.handleSubmit(submitWorker)}
                  >
                     <div className="rounded-2xl border border-border/60 bg-card shadow-xs">
                        <div className="p-6">
                           <SectionHeader
                              title="بيانات الفني"
                              subtitle="معلومات خدماتك وخبرتك المهنية"
                              action={
                                 !isEditingWorker && !isEditingBase ? (
                                    <Button
                                       type="button"
                                       variant="outline"
                                       size="sm"
                                       onClick={handleEditWorker}
                                       className="gap-2 shrink-0"
                                    >
                                       <Wrench className="h-3.5 w-3.5" />
                                       تعديل
                                    </Button>
                                 ) : null
                              }
                           />
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <CareerField worker={user.worker} />
                              <AccountStatusField
                                 form={workerForm}
                                 isEditing={isEditingWorker}
                                 worker={user.worker}
                              />
                              <YearsExperienceField
                                 form={workerForm}
                                 isEditing={isEditingWorker}
                                 worker={user.worker}
                              />
                              {/* <NearlyDateField
                                 form={workerForm}
                                 isEditing={isEditingWorker}
                              /> */}
                              <AboutField
                                 form={workerForm}
                                 isEditing={isEditingWorker}
                                 worker={user.worker}
                              />
                              <ServicesField
                                 form={workerForm}
                                 isEditing={isEditingWorker}
                                 worker={user.worker}
                              />
                              <WorkerImagesField
                                 form={workerForm}
                                 isEditing={isEditingWorker}
                                 worker={user.worker}
                              />
                           </div>

                           {isEditingWorker ? (
                              <SaveCancelBar
                                 isSubmitting={isSubmitting}
                                 onCancel={handleCancel}
                                 formId={WORKER_FORM_ID}
                              />
                           ) : (
                              !isEditingBase && (
                                 <div className="mt-6 pt-5 border-t border-border/60">
                                    <Button
                                       type="button"
                                       variant="destructive"
                                       onClick={handleLogout}
                                       className="w-full h-11 gap-2"
                                    >
                                       <LogOut className="h-4 w-4" />
                                       تسجيل الخروج
                                    </Button>
                                 </div>
                              )
                           )}
                        </div>
                     </div>
                  </form>
               </Form>
            ) : (
               /* Customer: logout below base section */
               !isEditingBase && (
                  <div className="mt-4">
                     <Button
                        type="button"
                        variant="destructive"
                        onClick={handleLogout}
                        className="w-full h-11 gap-2"
                     >
                        <LogOut className="h-4 w-4" />
                        تسجيل الخروج
                     </Button>
                  </div>
               )
            )}
         </div>
      </div>
   );
}
