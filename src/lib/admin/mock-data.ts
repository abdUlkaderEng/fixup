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
   Review,
   WorkerFormData,
   JobStatus,
   ReviewStatus,
   MessageCategory,
   AddressType,
   StatCardProps,
   QuickActionProps,
} from '@/types/admin';
import {
   Users,
   Briefcase,
   Wrench,
   MapPin,
   MessageSquare,
   Star,
   TrendingUp,
} from 'lucide-react';

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
// Reviews Mock Data
// ============================================
export const MOCK_REVIEWS: Review[] = [
   {
      id: 'REV-001',
      workerId: 'WORK-001',
      workerName: 'خالد حسن',
      customerName: 'أحمد محمد',
      jobTitle: 'إصلاح سباكة الحمام',
      rating: 5,
      comment: 'عمل ممتاز! محترف جداً وأنجز في الوقت المحدد.',
      date: '2024-01-15',
      status: 'approved',
   },
   {
      id: 'REV-002',
      workerId: 'WORK-002',
      workerName: 'عمر فاروق',
      customerName: 'سارة عبدالله',
      jobTitle: 'صيانة المكيفات',
      rating: 4,
      comment: 'خدمة جيدة لكن تأخر قليلاً.',
      date: '2024-01-14',
      status: 'approved',
   },
   {
      id: 'REV-003',
      workerId: 'WORK-003',
      workerName: 'فاطمة خان',
      customerName: 'محمد علي',
      jobTitle: 'تنظيف المنزل بالكامل',
      rating: 5,
      comment: 'ممتاز! المنزل يبدو رائعاً.',
      date: '2024-01-13',
      status: 'pending',
   },
   {
      id: 'REV-004',
      workerId: 'WORK-004',
      workerName: 'علي حسن',
      customerName: 'نورة سالم',
      jobTitle: 'تجميع الأثاث',
      rating: 2,
      comment: 'غير راضٍ عن الجودة.',
      date: '2024-01-12',
      status: 'rejected',
   },
];

// ============================================
// Review Status Labels (Arabic)
// ============================================
export const REVIEW_STATUS_LABELS: Record<ReviewStatus, string> = {
   approved: 'معتمد',
   pending: 'معلق',
   rejected: 'مرفوض',
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
// Dashboard Stats Data
// ============================================
export const DASHBOARD_STATS: StatCardProps[] = [
   {
      title: 'إجمالي العمال',
      value: '2,420',
      change: '+12%',
      trend: 'up',
      icon: Users,
      description: 'العمال النشطين في المنصة',
   },
   {
      title: 'الوظائف النشطة',
      value: '1,845',
      change: '+8%',
      trend: 'up',
      icon: Briefcase,
      description: 'وظائف قيد التنفيذ',
   },
   {
      title: 'الخدمات',
      value: '156',
      change: '+3%',
      trend: 'up',
      icon: Wrench,
      description: 'الخدمات المتاحة',
   },
   {
      title: 'إجمالي العملاء',
      value: '8,932',
      change: '+15%',
      trend: 'up',
      icon: Users,
      description: 'العملاء المسجلين',
   },
   {
      title: 'العناوين',
      value: '12,420',
      change: '+5%',
      trend: 'up',
      icon: MapPin,
      description: 'العناوين المحفوظة',
   },
   {
      title: 'رسائل الدردشة',
      value: '45.2K',
      change: '+22%',
      trend: 'up',
      icon: MessageSquare,
      description: 'الرسائل هذا الشهر',
   },
   {
      title: 'التقييمات',
      value: '3,240',
      change: '+18%',
      trend: 'up',
      icon: Star,
      description: 'تقييمات العملاء',
   },
   {
      title: 'معدل الإنجاز',
      value: '94.2%',
      change: '+2%',
      trend: 'up',
      icon: TrendingUp,
      description: 'نسبة إنجاز الوظائف',
   },
];

// ============================================
// Quick Actions Configuration
// ============================================
export const QUICK_ACTIONS: QuickActionProps[] = [
   {
      label: 'إدارة الخدمات',
      modal: 'services',
      description: 'إضافة، تعديل، أو حذف الخدمات',
   },
   {
      label: 'عرض الوظائف',
      modal: 'jobs',
      description: 'متابعة جميع أنشطة الوظائف',
   },
   {
      label: 'قائمة العملاء',
      modal: 'customers',
      description: 'إدارة حسابات العملاء',
   },
   {
      label: 'إضافة عامل',
      modal: 'create-worker',
      description: 'تسجيل عامل جديد',
   },
];
