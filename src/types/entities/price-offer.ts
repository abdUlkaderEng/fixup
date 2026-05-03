export type PriceOfferStatus = 'pending';

export interface CreateWorkerPriceOfferRequest {
   order_id: number;
   price: number;
   time_range: string;
}

export interface WorkerPriceOfferDraft {
   worker_id: number;
   order_id: number;
   price: string;
   time_range: string;
   status: PriceOfferStatus;
}

export interface WorkerPriceOffer {
   id?: number;
   worker_id?: number;
   order_id: number;
   price: number | string;
   time_range: string;
   status?: string;
}

export interface CreateWorkerPriceOfferResponse {
   status: boolean;
   message: string;
   data: WorkerPriceOffer;
}
