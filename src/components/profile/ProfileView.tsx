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
   ActionButtons,
} from './components';

interface ProfileViewProps {
   backLink?: string;
   backLabel?: string;
   roleLabel?: string;
   onConvertToWorker?: () => void;
}

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
   const { form, isEditing, handleEdit, handleCancel } = useProfileForm({
      user,
      isWorker,
   });
   const { isSubmitting, onSubmit } = useProfileSubmit(user, handleCancel);
   const handleLogout = useLogout();

   if (status === 'loading') {
      return <LoadingState />;
   }

   if (!isAuthenticated || !user) {
      return <UnauthenticatedState />;
   }

   const displayRole = roleLabel || user.role;

   return (
      <div className="min-h-[calc(100vh-4rem)] mt-16 bg-linear-to-br from-background via-muted/50 to-background p-4 sm:p-6 lg:p-8">
         <div className="max-w-4xl mx-auto">
            <BackLink href={backLink} label={backLabel} />
            <ProfileHeader name={user.name} email={user.email} />

            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                     {/* Base Fields - All users */}
                     <EmailField
                        email={user.email}
                        verified={!!user.email_verified_at}
                     />
                     <PhoneField form={form} isEditing={isEditing} />
                     <AddressField form={form} isEditing={isEditing} />
                     <BirthDateField form={form} isEditing={isEditing} />
                     <RoleField role={displayRole} />
                     <CreatedAtField createdAt={user.created_at} />

                     {/* Worker-specific fields */}
                     {isWorker && (
                        <>
                           <AboutField form={form} isEditing={isEditing} />
                           <NearlyDateField form={form} isEditing={isEditing} />
                           <YearsExperienceField
                              form={form}
                              isEditing={isEditing}
                           />
                           <AccountStatusField
                              form={form}
                              isEditing={isEditing}
                           />
                        </>
                     )}
                  </div>

                  {/* Action Buttons */}
                  <ActionButtons
                     isEditing={isEditing}
                     isSubmitting={isSubmitting}
                     onEdit={handleEdit}
                     onCancel={handleCancel}
                     onLogout={handleLogout}
                     showConvertButton={!isWorker && !!onConvertToWorker}
                     onConvertToWorker={onConvertToWorker}
                  />
               </form>
            </Form>
         </div>
      </div>
   );
}
