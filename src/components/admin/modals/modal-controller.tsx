'use client';

import { useSearchParams } from 'next/navigation';
import { ServicesModal } from './services-modal';
import { JobsModal } from './jobs-modal';
import { CustomersModal } from './customers-modal';
import { AddressesModal } from './addresses-modal';
import { MessagesModal } from './messages-modal';
import { ReviewsModal } from './reviews-modal';
import { CreateWorkerModal } from './create-worker-modal';

/**
 * Modal controller component
 * Renders appropriate modal based on URL search params
 * Centralizes all modal visibility logic
 */
export function ModalController() {
   const searchParams = useSearchParams();
   const modal = searchParams.get('modal');

   return (
      <>
         <ServicesModal open={modal === 'services'} />
         <JobsModal open={modal === 'jobs'} />
         <CustomersModal open={modal === 'customers'} />
         <AddressesModal open={modal === 'addresses'} />
         <MessagesModal open={modal === 'messages'} />
         <ReviewsModal open={modal === 'reviews'} />
         <CreateWorkerModal open={modal === 'create-worker'} />
      </>
   );
}
