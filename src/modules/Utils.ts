export function isNumber(any: any): boolean {
  return typeof any === "number" && Number.isFinite(any) && !Number.isNaN(any)
}