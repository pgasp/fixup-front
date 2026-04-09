/** Express 5 types route params as `string | string[]`. */
export const asRouteParam = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
