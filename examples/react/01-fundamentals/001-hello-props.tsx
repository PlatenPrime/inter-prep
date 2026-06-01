/**
 * 001 — Hello + props
 * @tags jsx, props
 * @difficulty easy
 *
 * ## Теория
 * Компонент — функция, возвращающая JSX. Props передаются первым аргументом и read-only.
 * Имя компонента с большой буквы. JSX компилируется в вызовы createElement или jsx().
 *
 * ## На собеседовании
 * - Чем props отличаются от state? — Props приходят снаружи и не меняются дочерним компонентом.
 * - Можно ли мутировать props? — Нет, антипаттерн.
 *
 * ## Связанные темы
 * webdev/15. react/001-chto-takoe-react.md
 */

export type HelloProps = { name: string };

export function Hello({ name }: HelloProps) {
  return <h1>Hello, {name}</h1>;
}
