'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
   Plus,
   Search,
   Edit2,
   Trash2,
   Wrench,
   Briefcase,
   X,
   AlertCircle,
   ChevronDown,
   MoreVertical,
   Check,
} from 'lucide-react';
import {
   AdminModal,
   ModalActions,
   CloseButton,
   type BaseModalProps,
} from './base-modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// ============================================
// Types
// ============================================
interface Career {
   id: string;
   name: string;
   icon: React.ReactNode;
   description: string;
}

interface Service {
   id: string;
   careerId: string;
   name: string;
   description: string;
   basePrice: number;
   maxPrice: number;
   durationMinutes: number;
   isActive: boolean;
   createdAt: string;
}

interface ServiceFormData {
   name: string;
   description: string;
   basePrice: string;
   maxPrice: string;
   durationMinutes: string;
}

// ============================================
// Mock Data
// ============================================
const CAREERS: Career[] = [
   {
      id: 'plumbing',
      name: 'السباكة',
      icon: <Wrench className="h-4 w-4" />,
      description: 'جميع خدمات السباكة والصيانة',
   },
   {
      id: 'electrical',
      name: 'الكهرباء',
      icon: <Wrench className="h-4 w-4" />,
      description: 'أعمال الكهرباء والتمديدات',
   },
   {
      id: 'cleaning',
      name: 'التنظيف',
      icon: <Wrench className="h-4 w-4" />,
      description: 'خدمات التنظيف المنزلية والتجارية',
   },
   {
      id: 'hvac',
      name: 'التكييف',
      icon: <Wrench className="h-4 w-4" />,
      description: 'صيانة وتركيب المكيفات',
   },
   {
      id: 'carpentry',
      name: 'النجارة',
      icon: <Wrench className="h-4 w-4" />,
      description: 'أعمال النجارة والأثاث',
   },
];

const INITIAL_SERVICES: Service[] = [
   // Plumbing services
   {
      id: 'srv-001',
      careerId: 'plumbing',
      name: 'إصلاح تسرب المياه',
      description: 'كشف وإصلاح تسربات المياه في الأنابيب والمواسير',
      basePrice: 80,
      maxPrice: 200,
      durationMinutes: 60,
      isActive: true,
      createdAt: '2024-01-15',
   },
   {
      id: 'srv-002',
      careerId: 'plumbing',
      name: 'تسليك المجاري',
      description: 'تسليك وتنظيف المجاري والبالوعات المسدودة',
      basePrice: 50,
      maxPrice: 150,
      durationMinutes: 45,
      isActive: true,
      createdAt: '2024-01-16',
   },
   {
      id: 'srv-003',
      careerId: 'plumbing',
      name: 'تركيب سخان ماء',
      description: 'تركيب وتوصيل سخانات المياه الكهربائية والغاز',
      basePrice: 120,
      maxPrice: 300,
      durationMinutes: 90,
      isActive: true,
      createdAt: '2024-01-17',
   },
   // Electrical services
   {
      id: 'srv-004',
      careerId: 'electrical',
      name: 'تركيب إضاءة LED',
      description: 'تركيب وتوصيل الإنارة LED في المنازل والمكاتب',
      basePrice: 60,
      maxPrice: 180,
      durationMinutes: 60,
      isActive: true,
      createdAt: '2024-01-15',
   },
   {
      id: 'srv-005',
      careerId: 'electrical',
      name: 'صيانة كهربائية',
      description: 'فحص وإصلاح الأعطال الكهربائية والدوائر',
      basePrice: 100,
      maxPrice: 250,
      durationMinutes: 90,
      isActive: false,
      createdAt: '2024-01-16',
   },
   // Cleaning services
   {
      id: 'srv-006',
      careerId: 'cleaning',
      name: 'تنظيف منزل عميق',
      description: 'تنظيف شامل لجميع غرف المنزل والمطابخ والحمامات',
      basePrice: 150,
      maxPrice: 400,
      durationMinutes: 180,
      isActive: true,
      createdAt: '2024-01-15',
   },
   {
      id: 'srv-007',
      careerId: 'cleaning',
      name: 'تنظيف سجاد',
      description: 'غسيل وتنظيف السجاد والموكيت باحترافية',
      basePrice: 80,
      maxPrice: 200,
      durationMinutes: 120,
      isActive: true,
      createdAt: '2024-01-17',
   },
];

// ============================================
// Utility Functions
// ============================================
const formatPrice = (price: number): string => {
   return `${price} ريال`;
};

const formatDuration = (minutes: number): string => {
   if (minutes < 60) return `${minutes} دقيقة`;
   const hours = Math.floor(minutes / 60);
   const remainingMinutes = minutes % 60;
   if (remainingMinutes === 0) return `${hours} ساعة`;
   return `${hours} ساعة ${remainingMinutes} دقيقة`;
};

// ============================================
// Components
// ============================================

interface StatusBadgeProps {
   isActive: boolean;
}

function StatusBadge({ isActive }: StatusBadgeProps) {
   return (
      <Badge
         variant={isActive ? 'default' : 'secondary'}
         className={
            isActive
               ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200'
               : 'bg-gray-200 text-gray-600 hover:bg-gray-300 border-gray-300'
         }
      >
         {isActive ? 'نشط' : 'غير نشط'}
      </Badge>
   );
}

interface ServiceCardProps {
   service: Service;
   onEdit: (service: Service) => void;
   onDelete: (service: Service) => void;
   onToggleStatus: (id: string) => void;
}

function ServiceCard({
   service,
   onEdit,
   onDelete,
   onToggleStatus,
}: ServiceCardProps) {
   return (
      <div className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
         <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900">{service.name}</h4>
                  <StatusBadge isActive={service.isActive} />
               </div>
               <p className="text-sm text-gray-500 mb-3">
                  {service.description}
               </p>
               <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                  <div className="flex items-center gap-1.5">
                     <span className="text-gray-400">السعر:</span>
                     <span className="font-medium text-gray-700">
                        {formatPrice(service.basePrice)} -{' '}
                        {formatPrice(service.maxPrice)}
                     </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                     <span className="text-gray-400">المدة:</span>
                     <span className="font-medium text-gray-700">
                        {formatDuration(service.durationMinutes)}
                     </span>
                  </div>
               </div>
            </div>
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button
                     variant="ghost"
                     size="icon"
                     className="h-8 w-8 text-gray-400 hover:text-gray-600"
                  >
                     <MoreVertical className="h-4 w-4" />
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent
                  align="end"
                  className="bg-white border-gray-200"
               >
                  <DropdownMenuItem
                     onClick={() => onEdit(service)}
                     className="gap-2 cursor-pointer focus:bg-gray-100"
                  >
                     <Edit2 className="h-4 w-4 text-gray-500" />
                     تعديل
                  </DropdownMenuItem>
                  <DropdownMenuItem
                     onClick={() => onToggleStatus(service.id)}
                     className="gap-2 cursor-pointer focus:bg-gray-100"
                  >
                     {service.isActive ? (
                        <>
                           <X className="h-4 w-4 text-amber-500" />
                           إلغاء التفعيل
                        </>
                     ) : (
                        <>
                           <Check className="h-4 w-4 text-emerald-500" />
                           تفعيل
                        </>
                     )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                     onClick={() => onDelete(service)}
                     className="gap-2 cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
                  >
                     <Trash2 className="h-4 w-4" />
                     حذف
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </div>
      </div>
   );
}

interface ServiceFormProps {
   initialData?: Service | null;
   careerId: string;
   careerName: string;
   onSubmit: (data: ServiceFormData) => void;
   onCancel: () => void;
}

function ServiceForm({
   initialData,
   careerId,
   careerName,
   onSubmit,
   onCancel,
}: ServiceFormProps) {
   const [formData, setFormData] = useState<ServiceFormData>({
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
      basePrice: initialData?.basePrice.toString() ?? '',
      maxPrice: initialData?.maxPrice.toString() ?? '',
      durationMinutes: initialData?.durationMinutes.toString() ?? '',
   });

   const isValid =
      formData.name.trim() &&
      formData.description.trim() &&
      Number(formData.basePrice) > 0 &&
      Number(formData.maxPrice) > 0 &&
      Number(formData.durationMinutes) > 0;

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (isValid) {
         onSubmit(formData);
      }
   };

   return (
      <form onSubmit={handleSubmit} className="space-y-4">
         <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Briefcase className="h-4 w-4" />
            <span>المهنة:</span>
            <span className="font-medium text-gray-700">{careerName}</span>
         </div>

         <div className="space-y-2">
            <Label htmlFor="name">اسم الخدمة</Label>
            <Input
               id="name"
               value={formData.name}
               onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
               }
               placeholder="مثال: إصلاح تسرب المياه"
               className="bg-white border-gray-300"
            />
         </div>

         <div className="space-y-2">
            <Label htmlFor="description">وصف الخدمة</Label>
            <Input
               id="description"
               value={formData.description}
               onChange={(e) =>
                  setFormData((prev) => ({
                     ...prev,
                     description: e.target.value,
                  }))
               }
               placeholder="وصف مختصر للخدمة المقدمة"
               className="bg-white border-gray-300"
            />
         </div>

         <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
               <Label htmlFor="basePrice">السعر الأدنى (ريال)</Label>
               <Input
                  id="basePrice"
                  type="number"
                  min="0"
                  value={formData.basePrice}
                  onChange={(e) =>
                     setFormData((prev) => ({
                        ...prev,
                        basePrice: e.target.value,
                     }))
                  }
                  placeholder="0"
                  className="bg-white border-gray-300"
               />
            </div>
            <div className="space-y-2">
               <Label htmlFor="maxPrice">السعر الأقصى (ريال)</Label>
               <Input
                  id="maxPrice"
                  type="number"
                  min="0"
                  value={formData.maxPrice}
                  onChange={(e) =>
                     setFormData((prev) => ({
                        ...prev,
                        maxPrice: e.target.value,
                     }))
                  }
                  placeholder="0"
                  className="bg-white border-gray-300"
               />
            </div>
         </div>

         <div className="space-y-2">
            <Label htmlFor="duration">المدة المتوقعة (دقيقة)</Label>
            <Input
               id="duration"
               type="number"
               min="15"
               step="15"
               value={formData.durationMinutes}
               onChange={(e) =>
                  setFormData((prev) => ({
                     ...prev,
                     durationMinutes: e.target.value,
                  }))
               }
               placeholder="60"
               className="bg-white border-gray-300"
            />
         </div>

         <div className="flex justify-end gap-2 pt-4">
            <Button
               type="button"
               variant="outline"
               onClick={onCancel}
               className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
               إلغاء
            </Button>
            <Button
               type="submit"
               disabled={!isValid}
               className="bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
            >
               {initialData ? 'حفظ التغييرات' : 'إضافة الخدمة'}
            </Button>
         </div>
      </form>
   );
}

// ============================================
// Main Modal Component
// ============================================

export function ServicesModal({ open }: BaseModalProps) {
   // State
   const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
   const [selectedCareerId, setSelectedCareerId] = useState<string>(
      CAREERS[0].id
   );
   const [searchQuery, setSearchQuery] = useState('');
   const [editingService, setEditingService] = useState<Service | null>(null);
   const [deletingService, setDeletingService] = useState<Service | null>(null);
   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

   // Derived values
   const selectedCareer = useMemo(
      () => CAREERS.find((c) => c.id === selectedCareerId) ?? CAREERS[0],
      [selectedCareerId]
   );

   const filteredServices = useMemo(() => {
      return services.filter((service) => {
         const matchesCareer = service.careerId === selectedCareerId;
         const matchesSearch =
            service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.description
               .toLowerCase()
               .includes(searchQuery.toLowerCase());
         return matchesCareer && matchesSearch;
      });
   }, [services, selectedCareerId, searchQuery]);

   const activeCount = useMemo(
      () => filteredServices.filter((s) => s.isActive).length,
      [filteredServices]
   );

   // Handlers
   const handleAddService = useCallback(
      (formData: ServiceFormData) => {
         const newService: Service = {
            id: `srv-${Date.now()}`,
            careerId: selectedCareerId,
            name: formData.name.trim(),
            description: formData.description.trim(),
            basePrice: Number(formData.basePrice),
            maxPrice: Number(formData.maxPrice),
            durationMinutes: Number(formData.durationMinutes),
            isActive: true,
            createdAt: new Date().toISOString().split('T')[0],
         };
         setServices((prev) => [newService, ...prev]);
         setIsAddDialogOpen(false);
      },
      [selectedCareerId]
   );

   const handleEditService = useCallback(
      (formData: ServiceFormData) => {
         if (!editingService) return;
         setServices((prev) =>
            prev.map((s) =>
               s.id === editingService.id
                  ? {
                       ...s,
                       name: formData.name.trim(),
                       description: formData.description.trim(),
                       basePrice: Number(formData.basePrice),
                       maxPrice: Number(formData.maxPrice),
                       durationMinutes: Number(formData.durationMinutes),
                    }
                  : s
            )
         );
         setEditingService(null);
      },
      [editingService]
   );

   const handleDeleteService = useCallback(() => {
      if (!deletingService) return;
      setServices((prev) => prev.filter((s) => s.id !== deletingService.id));
      setDeletingService(null);
   }, [deletingService]);

   const handleToggleStatus = useCallback((id: string) => {
      setServices((prev) =>
         prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
      );
   }, []);

   return (
      <>
         <AdminModal
            open={open}
            title="إدارة الخدمات"
            description="إدارة خدمات المهن وتحديد الأسعار والمدد"
         >
            <div className="space-y-5">
               {/* Career Selector */}
               <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     اختيار المهنة
                  </label>
                  <Select
                     value={selectedCareerId}
                     onValueChange={setSelectedCareerId}
                  >
                     <SelectTrigger className="w-full bg-white border-gray-300 h-11">
                        <div className="flex items-center gap-2">
                           <Briefcase className="h-4 w-4 text-gray-500" />
                           <SelectValue />
                           <ChevronDown className="h-4 w-4 text-gray-400 mr-auto" />
                        </div>
                     </SelectTrigger>
                     <SelectContent className="bg-white border-gray-200">
                        {CAREERS.map((career) => (
                           <SelectItem
                              key={career.id}
                              value={career.id}
                              className="cursor-pointer"
                           >
                              <div className="flex items-center gap-2 py-1">
                                 <span className="text-gray-500">
                                    {career.icon}
                                 </span>
                                 <div>
                                    <div className="font-medium">
                                       {career.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                       {career.description}
                                    </div>
                                 </div>
                              </div>
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>

               {/* Stats & Add Button */}
               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="text-sm text-gray-500">
                     <span className="font-medium text-gray-900">
                        {filteredServices.length}
                     </span>{' '}
                     خدمة
                     {activeCount > 0 && (
                        <>
                           {' '}
                           (
                           <span className="text-emerald-600">
                              {activeCount} نشطة
                           </span>
                           )
                        </>
                     )}
                  </div>
                  <Button
                     onClick={() => setIsAddDialogOpen(true)}
                     className="bg-gray-900 text-white hover:bg-gray-800 gap-2"
                  >
                     <Plus className="h-4 w-4" />
                     إضافة خدمة
                  </Button>
               </div>

               {/* Search */}
               <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                     placeholder="البحث في الخدمات..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="pr-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  />
               </div>

               {/* Services List */}
               <div className="space-y-3">
                  {filteredServices.length === 0 ? (
                     <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <Wrench className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-gray-500 mb-1">
                           لا توجد خدمات مسجلة
                        </p>
                        <p className="text-sm text-gray-400">
                           أضف خدمة جديدة لهذه المهنة
                        </p>
                     </div>
                  ) : (
                     filteredServices.map((service) => (
                        <ServiceCard
                           key={service.id}
                           service={service}
                           onEdit={setEditingService}
                           onDelete={setDeletingService}
                           onToggleStatus={handleToggleStatus}
                        />
                     ))
                  )}
               </div>

               <ModalActions>
                  <CloseButton />
               </ModalActions>
            </div>
         </AdminModal>

         {/* Add Service Dialog */}
         <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-lg">
               <DialogHeader>
                  <DialogTitle className="text-gray-900">
                     إضافة خدمة جديدة
                  </DialogTitle>
                  <DialogDescription className="text-gray-500">
                     أدخل تفاصيل الخدمة الجديدة للمهنة المحددة
                  </DialogDescription>
               </DialogHeader>
               <ServiceForm
                  careerId={selectedCareerId}
                  careerName={selectedCareer.name}
                  onSubmit={handleAddService}
                  onCancel={() => setIsAddDialogOpen(false)}
               />
            </DialogContent>
         </Dialog>

         {/* Edit Service Dialog */}
         <Dialog
            open={!!editingService}
            onOpenChange={() => setEditingService(null)}
         >
            <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-lg">
               <DialogHeader>
                  <DialogTitle className="text-gray-900">
                     تعديل الخدمة
                  </DialogTitle>
                  <DialogDescription className="text-gray-500">
                     تعديل تفاصيل الخدمة المحددة
                  </DialogDescription>
               </DialogHeader>
               <ServiceForm
                  initialData={editingService}
                  careerId={selectedCareerId}
                  careerName={selectedCareer.name}
                  onSubmit={handleEditService}
                  onCancel={() => setEditingService(null)}
               />
            </DialogContent>
         </Dialog>

         {/* Delete Confirmation Dialog */}
         <Dialog
            open={!!deletingService}
            onOpenChange={() => setDeletingService(null)}
         >
            <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-md">
               <DialogHeader>
                  <DialogTitle className="text-gray-900 flex items-center gap-2">
                     <AlertCircle className="h-5 w-5 text-red-500" />
                     تأكيد الحذف
                  </DialogTitle>
                  <DialogDescription className="text-gray-500">
                     هل أنت متأكد من حذف الخدمة{' '}
                     <span className="font-medium text-gray-900">
                        {deletingService?.name}
                     </span>
                     ؟ لا يمكن التراجع عن هذا الإجراء.
                  </DialogDescription>
               </DialogHeader>
               <div className="flex justify-end gap-2 pt-4">
                  <Button
                     variant="outline"
                     onClick={() => setDeletingService(null)}
                     className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                     إلغاء
                  </Button>
                  <Button
                     onClick={handleDeleteService}
                     className="bg-red-100 text-red-600 hover:bg-red-200 border border-red-300"
                  >
                     <Trash2 className="h-4 w-4 mr-1" />
                     حذف
                  </Button>
               </div>
            </DialogContent>
         </Dialog>
      </>
   );
}
