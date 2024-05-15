export function toSlug(input: string): string {
  if (!input) return "";
  return input
    .toLowerCase() 
    .replace(/\s+/g, "-"); 
}
