import type { SignupInput } from './schemas';

const WORKER_SIGNUP_STORAGE_KEY = 'worker-signup-draft';

export type WorkerSignupDraft = Pick<
   SignupInput,
   'fullName' | 'email' | 'phone_number' | 'address' | 'birthDate' | 'password'
>;

export const saveWorkerSignupDraft = (draft: WorkerSignupDraft): void => {
   if (typeof window === 'undefined') {
      return;
   }

   window.localStorage.setItem(
      WORKER_SIGNUP_STORAGE_KEY,
      JSON.stringify(draft)
   );
};

export const getWorkerSignupDraft = (): WorkerSignupDraft | null => {
   if (typeof window === 'undefined') {
      return null;
   }

   const rawDraft = window.localStorage.getItem(WORKER_SIGNUP_STORAGE_KEY);

   if (!rawDraft) {
      return null;
   }

   try {
      return JSON.parse(rawDraft) as WorkerSignupDraft;
   } catch {
      window.localStorage.removeItem(WORKER_SIGNUP_STORAGE_KEY);
      return null;
   }
};

export const clearWorkerSignupDraft = (): void => {
   if (typeof window === 'undefined') {
      return;
   }

   window.localStorage.removeItem(WORKER_SIGNUP_STORAGE_KEY);
};
