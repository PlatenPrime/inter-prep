/**
 * 002 — Spread props
 * @tags props
 * @difficulty easy
 *
 * ## Теория
 * Spread {...props} передаёт все поля объекта как отдельные атрибуты.
 * Порядок важен: позже идущие props перезаписывают ранние.
 *
 * ## На собеседовании
 * - Когда использовать spread для props? — Обёртки и полиморфные компоненты.
 *
 * ## Связанные темы
 * webdev/15. react/009-raznica-mezhdu-komponentom-i-kontejnerom.md
 */

export type AvatarProps = { src: string; alt: string; size?: number };

export function Avatar({ src, alt, size = 32 }: AvatarProps) {
  return <img src={src} alt={alt} width={size} height={size} />;
}

export function AvatarLink(props: AvatarProps & { href: string }) {
  const { href, ...avatarProps } = props;
  return (
    <a href={href}>
      <Avatar {...avatarProps} />
    </a>
  );
}
