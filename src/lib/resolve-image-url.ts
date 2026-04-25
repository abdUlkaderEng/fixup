export function resolveImageUrl(src?: string | null): string | null {
   if (!src) {
      return null;
   }

   const trimmed = src.trim();
   if (!trimmed) {
      return null;
   }

   // Browser-generated previews and already absolute URLs should be used as-is.
   if (
      trimmed.startsWith('blob:') ||
      trimmed.startsWith('data:') ||
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://')
   ) {
      return trimmed;
   }

   const imageBase = process.env.NEXT_PUBLIC_IMAGE_URL?.trim();
   if (!imageBase) {
      return trimmed;
   }

   const normalizedBase = imageBase.replace(/\/+$/, '');
   const normalizedSrc = trimmed.replace(/^\/+/, '');

   const baseWithoutStorage = normalizedBase.endsWith('/storage')
      ? normalizedBase.slice(0, -'/storage'.length)
      : normalizedBase;

   if (normalizedSrc.startsWith('storage/')) {
      return `${baseWithoutStorage}/${normalizedSrc}`;
   }

   return `${normalizedBase}/${normalizedSrc}`;
}
