/**
 * Кратко: Вызываем sideEffect(value), возвращаем value — для отладки в цепочках pipe/compose без изменения потока.
 */
export function tap(value, fn) {
  fn(value);
  return value;
}
