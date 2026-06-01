/**
 * 066 — Slot pattern
 * @tags composition
 * @difficulty medium
 *
 * ## Теория
 * Named slots через props: header, footer — альтернатива children для layout.
 *
 * ## На собеседовании
 * - slots vs children? — Явные именованные области.
 */

export function Layout({
  header,
  children,
  footer,
}: {
  header: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <header>{header}</header>
      <main>{children}</main>
      {footer && <footer>{footer}</footer>}
    </div>
  );
}
