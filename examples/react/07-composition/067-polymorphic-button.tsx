/**
 * 067 — Polymorphic button
 * @tags typescript, composition
 * @difficulty hard
 *
 * ## Теория
 * Polymorphic as prop: рендер как button или a с общими стилями.
 *
 * ## На собеседовании
 * - Radix Slot? — asChild меняет корневой элемент.
 */

type PolyProps<C extends React.ElementType> = {
  as?: C;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<C>;

export function PolyButton<C extends React.ElementType = 'button'>({
  as,
  children,
  ...props
}: PolyProps<C>) {
  const Comp = as ?? 'button';
  return <Comp {...props}>{children}</Comp>;
}
