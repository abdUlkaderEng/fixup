/**
 * Admin Mock Data - Centralized mock data for admin panel
 * All mock data used across admin modals lives here
 */

import type {
   Service,
   Job,
   Customer,
   Address,
   StaticMessage,
   WorkerFormData,
   JobStatus,
   MessageCategory,
   AddressType,
   QuickActionProps,
} from '@/types/admin';
import { Wrench, ClipboardList, UserPlus, Wallet, History } from 'lucide-react';

// ============================================
// Services Mock Data
// ============================================
export const MOCK_SERVICES: Service[] = [
   {
      id: '1',
      name: 'إصلاح السباكة',
      category: 'السباكة',
      description: 'إصلاح التسريبات والأنابيب والمنافذ',
      price: '50-150 ريال',
      workers: 24,
      isActive: true,
   },
   {
      id: '2',
      name: 'أعمال الكهرباء',
      category: 'الكهرباء',
      description: 'الأسلاك والمقابس والإنارة',
      price: '80-200 ريال',
      workers: 18,
      isActive: true,
   },
   {
      id: '3',
      name: 'تنظيف المنزل',
      category: 'التنظيف',
      description: 'خدمات التنظيف العميق',
      price: '40-100 ريال',
      workers: 45,
      isActive: true,
   },
   {
      id: '4',
      name: 'إصلاح المكيفات',
      category: 'التكييف',
      description: 'صيانة التكييف والتبريد',
      price: '60-180 ريال',
      workers: 12,
      isActive: false,
   },
];

// ============================================
// Jobs Mock Data
// ============================================
export const MOCK_JOBS: Job[] = [
   {
      id: 'JOB-001',
      title: 'إصلاح سباكة الحمام',
      customer: 'أحمد محمد',
      worker: 'خالد حسن',
      service: 'السباكة',
      location: 'الرياض، العليا',
      status: 'in-progress',
      date: '2024-01-15',
      price: '120 ريال',
   },
   {
      id: 'JOB-002',
      title: 'تركيب أسلاك كهرباء',
      customer: 'سارة عبدالله',
      worker: null,
      service: 'الكهرباء',
      location: 'جدة، الحمراء',
      status: 'pending',
      date: '2024-01-16',
      price: '200 ريال',
   },
   {
      id: 'JOB-003',
      title: 'تنظيف المنزل بالكامل',
      customer: 'محمد علي',
      worker: 'فاطمة خان',
      service: 'التنظيف',
      location: 'الدمام، الفيصلية',
      status: 'completed',
      date: '2024-01-14',
      price: '85 ريال',
   },
   {
      id: 'JOB-004',
      title: 'صيانة المكيفات',
      customer: 'نورة سالم',
      worker: 'عمر فاروق',
      service: 'التكييف',
      location: 'الرياض، الملز',
      status: 'cancelled',
      date: '2024-01-13',
      price: '150 ريال',
   },
];

// ============================================
// Job Status Labels (Arabic)
// ============================================
export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
   pending: 'معلق',
   'in-progress': 'قيد التنفيذ',
   completed: 'مكتمل',
   cancelled: 'ملغي',
};

// ============================================
// Customers Mock Data
// ============================================
export const MOCK_CUSTOMERS: Customer[] = [
   {
      id: 'CUST-001',
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      phone: '+966 50 123 4567',
      location: 'الرياض، السعودية',
      joinDate: '2023-06-15',
      jobsCount: 12,
      isActive: true,
   },
   {
      id: 'CUST-002',
      name: 'سارة عبدالله',
      email: 'sara@example.com',
      phone: '+966 55 987 6543',
      location: 'جدة، السعودية',
      joinDate: '2023-08-22',
      jobsCount: 5,
      isActive: true,
   },
   {
      id: 'CUST-003',
      name: 'محمد علي',
      email: 'mohammed@example.com',
      phone: '+966 54 456 7890',
      location: 'الدمام، السعودية',
      joinDate: '2023-11-10',
      jobsCount: 3,
      isActive: false,
   },
   {
      id: 'CUST-004',
      name: 'نورة سالم',
      email: 'noura@example.com',
      phone: '+966 56 789 0123',
      location: 'مكة، السعودية',
      joinDate: '2024-01-05',
      jobsCount: 1,
      isActive: true,
   },
];

// ============================================
// Addresses Mock Data
// ============================================
export const MOCK_ADDRESSES: Address[] = [
   {
      id: 'ADDR-001',
      label: 'المنزل',
      street: 'طريق الملك فهد 123',
      city: 'الرياض',
      region: 'منطقة الرياض',
      zipCode: '12345',
      type: 'home',
      isDefault: true,
      owner: 'أحمد محمد',
   },
   {
      id: 'ADDR-002',
      label: 'المكتب',
      street: 'شارع العليا 456',
      city: 'الرياض',
      region: 'منطقة الرياض',
      zipCode: '12346',
      type: 'work',
      isDefault: false,
      owner: 'سارة عبدالله',
   },
   {
      id: 'ADDR-003',
      label: 'الفيلا',
      street: 'حي الحمراء 789',
      city: 'جدة',
      region: 'منطقة مكة',
      zipCode: '23456',
      type: 'home',
      isDefault: true,
      owner: 'محمد علي',
   },
   {
      id: 'ADDR-004',
      label: 'المستودع',
      street: 'المنطقة الصناعية 321',
      city: 'الدمام',
      region: 'المنطقة الشرقية',
      zipCode: '34567',
      type: 'other',
      isDefault: false,
      owner: 'نورة سالم',
   },
];

// ============================================
// Address Type Labels (Arabic)
// ============================================
export const ADDRESS_TYPE_LABELS: Record<AddressType, string> = {
   home: 'منزل',
   work: 'عمل',
   other: 'آخر',
};

// ============================================
// Static Messages Mock Data
// ============================================
export const MOCK_MESSAGES: StaticMessage[] = [
   {
      id: 'MSG-001',
      key: 'welcome_customer',
      content: 'مرحباً بك في خدماتنا! كيف يمكننا مساعدتك اليوم؟',
      category: 'greeting',
      usage: 1250,
      lastUsed: '2024-01-15',
   },
   {
      id: 'MSG-002',
      key: 'worker_assigned',
      content: 'تم تعيين عامل لمهمتك. ستتلقى تحديثات قريباً.',
      category: 'status',
      usage: 890,
      lastUsed: '2024-01-15',
   },
   {
      id: 'MSG-003',
      key: 'job_completed',
      content: 'تم إنجاز مهمتك بنجاح. يرجى تقييم تجربتك!',
      category: 'status',
      usage: 756,
      lastUsed: '2024-01-14',
   },
   {
      id: 'MSG-004',
      key: 'payment_received',
      content: 'تم استلام الدفع. شكراً لك على تعاملك معنا!',
      category: 'notification',
      usage: 643,
      lastUsed: '2024-01-14',
   },
   {
      id: 'MSG-005',
      key: 'support_contact',
      content: 'للدعم العاجل، يرجى الاتصال بخط الدعم على مدار الساعة.',
      category: 'system',
      usage: 432,
      lastUsed: '2024-01-13',
   },
];

// ============================================
// Message Category Labels (Arabic)
// ============================================
export const MESSAGE_CATEGORY_LABELS: Record<MessageCategory, string> = {
   greeting: 'ترحيب',
   status: 'حالة',
   notification: 'تنبيه',
   system: 'نظام',
};

// ============================================
// Worker Services Options
// ============================================
export const WORKER_SERVICES = [
   'السباكة',
   'الكهرباء',
   'التنظيف',
   'التكييف',
   'النجارة',
   'الدهان',
   'الحدائق',
   'النقل',
] as const;

// ============================================
// Worker Experience Levels
// ============================================
export const WORKER_EXPERIENCE_LEVELS = [
   { value: '1', label: 'سنة واحدة' },
   { value: '2', label: 'سنتان' },
   { value: '3', label: '3 سنوات' },
   { value: '5', label: '5 سنوات' },
   { value: '10', label: '10+ سنوات' },
] as const;

// ============================================
// Worker Form Initial State
// ============================================
export const INITIAL_WORKER_FORM: WorkerFormData = {
   firstName: '',
   lastName: '',
   email: '',
   phone: '',
   idNumber: '',
   service: '',
   experience: '',
   bio: '',
   documents: {
      idCard: false,
      certificate: false,
      backgroundCheck: false,
   },
};

// ============================================
// Quick Actions Configuration
// ============================================
export const QUICK_ACTIONS: QuickActionProps[] = [
   {
      label: 'إدارة الخدمات',
      modal: 'services',
      description: 'إضافة، تعديل، أو حذف الخدمات',
      icon: Wrench,
   },
   {
      label: 'عرض الوظائف',
      modal: 'jobs',
      description: 'متابعة جميع أنشطة الوظائف',
      icon: ClipboardList,
   },
   {
      label: 'طلبات العمال',
      modal: 'worker-requests',
      description: 'إدارة طلبات التسجيل',
      icon: UserPlus,
   },
   {
      label: 'إدارة المحفظة',
      modal: 'wallet',
      description: 'رسوم المهن وشحن محافظ العمال',
      icon: Wallet,
   },
   {
      label: 'مراجعة حركات المحفظة',
      modal: 'wallet-transactions',
      description: 'عرض جميع عمليات الشحن والرسوم',
      icon: History,
   },
];
