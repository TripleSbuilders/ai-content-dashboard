export function getVisibleRangeCount(total: number, requested: number): number {
  if (total <= 0) return 0;
  if (requested <= 0) return 0;
  return Math.min(total, requested);
}
