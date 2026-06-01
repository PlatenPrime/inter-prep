/**
 * 017 — Error fallback UI
 * @tags errors
 * @difficulty medium
 *
 * ## Теория
 * Показывайте fallback UI при ошибках загрузки данных. Error Boundary ловит ошибки рендера, не event handlers.
 *
 * ## На собеседовании
 * - Что не ловит Error Boundary? — Ошибки в async, event handlers, SSR.
 */

export function ErrorMessage({ error }: { error: Error | null }) {
  if (!error) return <p>OK</p>;
  return <p role="alert">{error.message}</p>;
}
