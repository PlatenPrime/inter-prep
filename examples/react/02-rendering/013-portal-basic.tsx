/**
 * 013 — Portal basic
 * @tags portal, dom
 * @difficulty medium
 *
 * ## Теория
 * createPortal рендерит детей в другой DOM-узел, сохраняя React-дерево и контекст.
 *
 * ## На собеседовании
 * - Зачем portal? — Модалки, tooltip поверх overflow:hidden.
 *
 * ## Связанные темы
 * webdev/15. react/032-chto-takoe-portaly-portals.md
 */

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export function ModalPortal({ open, children }: { open: boolean; children: React.ReactNode }) {
  const [root, setRoot] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const el = document.createElement('div');
    el.setAttribute('data-testid', 'portal-root');
    document.body.appendChild(el);
    setRoot(el);
    return () => {
      document.body.removeChild(el);
    };
  }, []);
  if (!open || !root) return null;
  return createPortal(children, root);
}
