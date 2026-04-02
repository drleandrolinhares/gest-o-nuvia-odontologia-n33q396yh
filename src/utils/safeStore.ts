export const safeArray = <T = any>(data: any): T[] => (Array.isArray(data) ? data : [])
export const safeFilter = <T = any>(
  data: any,
  fn: (value: T, index: number, array: T[]) => boolean,
): T[] => safeArray<T>(data).filter(fn)
export const safeLength = (data: any): number => safeArray(data).length
