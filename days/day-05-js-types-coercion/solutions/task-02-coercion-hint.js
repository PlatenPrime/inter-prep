export function coercionHint(value) {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';

  const type = typeof value;
  if (type === 'boolean') return 'boolean';
  if (type === 'string') return 'string';
  if (type === 'number') return Number.isNaN(value) ? 'nan' : 'number';
  if (type === 'bigint') return 'bigint';
  if (type === 'symbol') return 'symbol';
  if (type === 'function') return 'function';

  if (Array.isArray(value)) return 'array';
  if (Object.prototype.toString.call(value) === '[object Date]') return 'date';

  return 'object';
}

export function coerceToNumber(value) {
  if (value === null) return 0;
  if (value === undefined) return NaN;
  if (typeof value === 'boolean') return value ? 1 : 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return 0;
    return Number(trimmed);
  }
  if (typeof value === 'bigint') return Number(value);
  if (typeof value === 'symbol') return NaN;
  if (typeof value === 'object') {
    const prim = value.valueOf();
    if (prim !== value) return coerceToNumber(prim);
    return NaN;
  }
  return NaN;
}
