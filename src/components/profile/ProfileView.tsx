'use client';

import { useSession } from 'next-auth/react';
import { Form } from '@/components/ui/form';
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
   NearlyDateField,
   YearsExperienceField,
   AccountStatusField,
   CareerField,
   ServicesField,
   WorkerImagesField,
   ActionButtons,
} from './components';

interface ProfileViewProps {
   backLink?: string;
   backLabel?: string;
   roleLabel?: string;
   onConvertToWorker?: () => void;
}

const BASE_FORM_ID = 'base-profile-form';
const WORKER_FORM_ID = 'worker-profile-form';

export function ProfileView({
   backLink = '/',
   backLabel = 'العودة للرئيسية',
   roleLabel,
   onConvertToWorker,
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
   const activeFormId = isEditingWorker ? WORKER_FORM_ID : BASE_FORM_ID;

   return (
      <div className="min-h-[calc(100vh-4rem)] mt-16 bg-linear-to-br from-background via-muted/50 to-background p-4 sm:p-6 lg:p-8">
         <div className="max-w-4xl mx-auto">
            <BackLink href={backLink} label={backLabel} />

            {/* Base profile form */}
            <Form {...baseForm}>
               <form
                  id={BASE_FORM_ID}
                  onSubmit={baseForm.handleSubmit(submitBase)}
               >
                  <ProfileHeader
                     name={user.name}
                     email={user.email}
                     profileImage={user.profile_picture}
                     form={baseForm}
                     isEditing={isEditingBase}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                     <EmailField
                        email={user.email}
                        verified={!!user.email_verified_at}
                     />
                     <PhoneField
                        form={baseForm}
                        isEditing={isEditingBase}
                        user={user}
                     />
                     <AddressField
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
                  </div>
               </form>
            </Form>

            {/* Worker info form */}
            {isWorker && (
               <Form {...workerForm}>
                  <form
                     id={WORKER_FORM_ID}
                     onSubmit={workerForm.handleSubmit(submitWorker)}
                  >
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <CareerField worker={user.worker} />
                        <AccountStatusField
                           form={workerForm}
                           isEditing={isEditingWorker}
                           worker={user.worker}
                        />
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
                        <YearsExperienceField
                           form={workerForm}
                           isEditing={isEditingWorker}
                           worker={user.worker}
                        />
                        <NearlyDateField
                           form={workerForm}
                           isEditing={isEditingWorker}
                        />
                        <WorkerImagesField
                           form={workerForm}
                           isEditing={isEditingWorker}
                           worker={user.worker}
                        />
                     </div>
                  </form>
               </Form>
            )}

            {/* Action buttons — save button targets the active form via HTML form attribute */}
            <ActionButtons
               isWorker={isWorker}
               editMode={editMode}
               isSubmitting={isSubmitting}
               activeFormId={activeFormId}
               onEditBase={handleEditBase}
               onEditWorker={handleEditWorker}
               onCancel={handleCancel}
               onLogout={handleLogout}
               showConvertButton={!isWorker && !!onConvertToWorker}
               onConvertToWorker={onConvertToWorker}
            />
         </div>
      </div>
   );
}
