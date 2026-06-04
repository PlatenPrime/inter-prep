/**
 * Кратко: Объект type → handlers[]; emit копирует массив handlers, чтобы off во время emit был безопасен.
 */
export function mitt() {
  const all = Object.create(null);
  return {
    on(type, handler) { (all[type] ||= []).push(handler); },
    off(type, handler) { if (all[type]) all[type] = all[type].filter((h) => h !== handler); },
    emit(type, evt) { (all[type] || []).slice().forEach((h) => h(evt)); },
  };
}
