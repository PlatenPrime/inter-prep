const brandMap = new WeakMap<object, string>();

export function brand<T extends object>(obj: T, label: string): T & { __brand: string } {
  brandMap.set(obj, label);
  return obj as T & { __brand: string };
}

export function getBrand(obj: object): string | undefined {
  return brandMap.get(obj);
}