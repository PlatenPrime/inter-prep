/**
 * Кратко: При первом вызове вычисляем factory() и запоминаем; дальше возвращаем кэш.
 */
export function lazy(factory) {
  let computed = false;
  let value;
  return () => {
    if (!computed) {
      value = factory();
      computed = true;
    }
    return value;
  };
}
