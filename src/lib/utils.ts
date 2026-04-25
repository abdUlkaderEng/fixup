import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

// const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/api\/?$/, '');

// /** Converts backend image paths to a full public storage URL. */
// export function storageUrl(path: string | null | undefined): string | null {
//    if (!path) return null;
//    const trimmedPath = path.trim();

//    if (!trimmedPath) return null;
//    if (trimmedPath.startsWith('http://') || trimmedPath.startsWith('https://')) {
//       return trimmedPath;
//    }

//    const normalizedPath = trimmedPath
//       .replace(/^\/+/, '')
//       .replace(/^public\//, '');
//    const storagePath = normalizedPath.startsWith('storage/')
//       ? normalizedPath
//       : `storage/${normalizedPath}`;

//    return BASE_URL ? `${BASE_URL}/${storagePath}` : `/${storagePath}`;
// }
