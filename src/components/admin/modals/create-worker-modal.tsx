'use client';

import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import {
   AdminModal,
   ModalActions,
   CloseButton,
   PrimaryButton,
   type BaseModalProps,
} from './base-modal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
   WORKER_SERVICES,
   WORKER_EXPERIENCE_LEVELS,
   INITIAL_WORKER_FORM,
} from '@/lib/admin/mock-data';
import type { WorkerFormData } from '@/types/admin';

/**
 * Create worker modal
 * Form to register a new worker
 */
export function CreateWorkerModal({ open }: BaseModalProps) {
   const [formData, setFormData] = useState(INITIAL_WORKER_FORM);
   const [isSubmitting, setIsSubmitting] = useState(false);

   const handleInputChange = (field: keyof WorkerFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
   };

   const handleDocumentChange = (doc: keyof WorkerFormData['documents']) => {
      setFormData((prev) => ({
         ...prev,
         documents: { ...prev.documents, [doc]: !prev.documents[doc] },
      }));
   };

   const handleSubmit = async () => {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitting(false);
      setFormData(INITIAL_WORKER_FORM);
   };

   const isFormValid =
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phone &&
      formData.service;

   return (
      <AdminModal
         open={open}
         title="إضافة عامل جديد"
         description="تسجيل عامل جديد في المنصة"
         className="max-w-2xl"
      >
         <div className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
               <h4 className="text-sm font-medium text-white/80 border-b border-white/10 pb-2">
                  المعلومات الشخصية
               </h4>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label htmlFor="firstName" className="text-white/60">
                        الاسم الأول
                     </Label>
                     <Input
                        id="firstName"
                        placeholder="أحمد"
                        value={formData.firstName}
                        onChange={(e) =>
                           handleInputChange('firstName', e.target.value)
                        }
                        className="bg-zinc-900 border-white/10 text-white placeholder:text-white/40"
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="lastName" className="text-white/60">
                        اسم العائلة
                     </Label>
                     <Input
                        id="lastName"
                        placeholder="محمد"
                        value={formData.lastName}
                        onChange={(e) =>
                           handleInputChange('lastName', e.target.value)
                        }
                        className="bg-zinc-900 border-white/10 text-white placeholder:text-white/40"
                     />
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label htmlFor="email" className="text-white/60">
                        البريد الإلكتروني
                     </Label>
                     <Input
                        id="email"
                        type="email"
                        placeholder="worker@example.com"
                        value={formData.email}
                        onChange={(e) =>
                           handleInputChange('email', e.target.value)
                        }
                        className="bg-zinc-900 border-white/10 text-white placeholder:text-white/40"
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="phone" className="text-white/60">
                        رقم الهاتف
                     </Label>
                     <Input
                        id="phone"
                        placeholder="+966 50 123 4567"
                        value={formData.phone}
                        onChange={(e) =>
                           handleInputChange('phone', e.target.value)
                        }
                        className="bg-zinc-900 border-white/10 text-white placeholder:text-white/40"
                     />
                  </div>
               </div>
               <div className="space-y-2">
                  <Label htmlFor="idNumber" className="text-white/60">
                     رقم الهوية
                  </Label>
                  <Input
                     id="idNumber"
                     placeholder="أدخل رقم الهوية أو جواز السفر"
                     value={formData.idNumber}
                     onChange={(e) =>
                        handleInputChange('idNumber', e.target.value)
                     }
                     className="bg-zinc-900 border-white/10 text-white placeholder:text-white/40"
                  />
               </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
               <h4 className="text-sm font-medium text-white/80 border-b border-white/10 pb-2">
                  المعلومات المهنية
               </h4>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label className="text-white/60">فئة الخدمة</Label>
                     <Select
                        value={formData.service}
                        onValueChange={(value) =>
                           handleInputChange('service', value)
                        }
                     >
                        <SelectTrigger className="bg-zinc-900 border-white/10 text-white">
                           <SelectValue placeholder="اختر الخدمة" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-white/10">
                           {WORKER_SERVICES.map((service) => (
                              <SelectItem key={service} value={service}>
                                 {service}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
                  <div className="space-y-2">
                     <Label className="text-white/60">الخبرة</Label>
                     <Select
                        value={formData.experience}
                        onValueChange={(value) =>
                           handleInputChange('experience', value)
                        }
                     >
                        <SelectTrigger className="bg-zinc-900 border-white/10 text-white">
                           <SelectValue placeholder="اختر الخبرة" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-white/10">
                           {WORKER_EXPERIENCE_LEVELS.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                 {level.label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
               </div>
               <div className="space-y-2">
                  <Label htmlFor="bio" className="text-white/60">
                     نبذة / وصف
                  </Label>
                  <Textarea
                     id="bio"
                     placeholder="وصف مختصر لمهارات وخبرات العامل..."
                     value={formData.bio}
                     onChange={(e) => handleInputChange('bio', e.target.value)}
                     className="bg-zinc-900 border-white/10 text-white placeholder:text-white/40 min-h-20"
                  />
               </div>
            </div>

            {/* Documents Verification */}
            <div className="space-y-4">
               <h4 className="text-sm font-medium text-white/80 border-b border-white/10 pb-2">
                  التحقق من المستندات
               </h4>
               <div className="space-y-3">
                  {[
                     { id: 'idCard', label: 'تم التحقق من الهوية' },
                     { id: 'certificate', label: 'الشهادة المهنية' },
                     {
                        id: 'backgroundCheck',
                        label: 'تم اجتياز فحص الخلفية',
                     },
                  ].map((doc) => (
                     <div key={doc.id} className="flex items-center gap-3">
                        <Checkbox
                           id={doc.id}
                           checked={
                              formData.documents[
                                 doc.id as keyof WorkerFormData['documents']
                              ]
                           }
                           onCheckedChange={() =>
                              handleDocumentChange(
                                 doc.id as keyof WorkerFormData['documents']
                              )
                           }
                           className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black"
                        />
                        <Label
                           htmlFor={doc.id}
                           className="text-white/80 text-sm cursor-pointer"
                        >
                           {doc.label}
                        </Label>
                     </div>
                  ))}
               </div>
            </div>

            <ModalActions>
               <CloseButton />
               <PrimaryButton onClick={handleSubmit} disabled={!isFormValid}>
                  {isSubmitting ? (
                     <span className="flex items-center gap-2">
                        <span className="animate-spin">⟳</span>
                        جاري الإنشاء...
                     </span>
                  ) : (
                     <span className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        إنشاء العامل
                     </span>
                  )}
               </PrimaryButton>
            </ModalActions>
         </div>
      </AdminModal>
   );
}
