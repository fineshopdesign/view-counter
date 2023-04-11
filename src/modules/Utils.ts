export function isNumber(any: any): boolean {
  return typeof any === "number" && Number.isFinite(any) && !Number.isNaN(any)
}

export function abbreviateNumber(arg: string | number): string {
  const number = Number(arg);
  const SI_PREFIXES = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  if (number === 0) return number.toString();

  const tier = SI_PREFIXES.filter((n) => number >= n.value).pop() as { value: number, symbol: string };
  const numberFixed = (number / tier.value).toFixed(tier.value === 1 ? 0 : 2);

  return `${numberFixed}${tier.symbol}`;
}
