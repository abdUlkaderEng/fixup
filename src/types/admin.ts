/**
 * Admin Types - Shared type definitions for admin panel
 * Centralized types for all admin entities
 */

// ============================================
// Services
// ============================================
export interface Service {
   id: string;
   name: string;
   category: string;
   description: string;
   price: string;
   workers: number;
   isActive: boolean;
}

// ============================================
// Jobs
// ============================================
export type JobStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export interface Job {
   id: string;
   title: string;
   customer: string;
   worker: string | null;
   service: string;
   location: string;
   status: JobStatus;
   date: string;
   price: string;
}

// ============================================
// Customers
// ============================================
export interface Customer {
   id: string;
   name: string;
   email: string;
   phone: string;
   location: string;
   joinDate: string;
   jobsCount: number;
   isActive: boolean;
}

// ============================================
// Addresses
// ============================================
export type AddressType = 'home' | 'work' | 'other';

export interface Address {
   id: string;
   label: string;
   street: string;
   city: string;
   region: string;
   zipCode: string;
   type: AddressType;
   isDefault: boolean;
   owner: string;
}

// ============================================
// Static Messages
// ============================================
export type MessageCategory = 'greeting' | 'status' | 'notification' | 'system';

export interface StaticMessage {
   id: string;
   key: string;
   content: string;
   category: MessageCategory;
   usage: number;
   lastUsed: string;
}

// ============================================
// Reviews
// ============================================
export type ReviewStatus = 'approved' | 'pending' | 'rejected';

export interface Review {
   id: string;
   workerId: string;
   workerName: string;
   customerName: string;
   jobTitle: string;
   rating: number;
   comment: string;
   date: string;
   status: ReviewStatus;
}

// ============================================
// Worker Form
// ============================================
export interface WorkerFormData {
   firstName: string;
   lastName: string;
   email: string;
   phone: string;
   idNumber: string;
   service: string;
   experience: string;
   bio: string;
   documents: {
      idCard: boolean;
      certificate: boolean;
      backgroundCheck: boolean;
   };
}

// ============================================
// Dashboard Components
// ============================================
export interface StatCardProps {
   title: string;
   value: string;
   change: string;
   trend: 'up' | 'down' | 'neutral';
   icon: React.ElementType;
   description: string;
}

export interface QuickActionProps {
   label: string;
   modal: string;
   description: string;
}

// ============================================
// Navigation
// ============================================
export interface NavItem {
   id: string;
   label: string;
   href: string;
   icon: React.ElementType;
   description?: string;
}
