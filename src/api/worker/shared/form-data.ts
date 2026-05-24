export function appendIfDefined(
   fd: FormData,
   key: string,
   value: string | number | Blob | null | undefined
): void {
   if (value === null || value === undefined) return;
   fd.append(key, value instanceof Blob ? value : String(value));
}

export function appendArray<T>(
   fd: FormData,
   key: string,
   items: readonly T[] | undefined,
   serialize: (item: T) => string | Blob = (item) =>
      item instanceof Blob ? item : String(item)
): void {
   items?.forEach((item) => fd.append(key, serialize(item)));
}
