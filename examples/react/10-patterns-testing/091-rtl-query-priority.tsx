/**
 * 091 — RTL query priority
 * @tags testing, rtl
 * @difficulty easy
 *
 * ## Теория
 * Приоритет RTL: getByRole > getByLabelText > getByPlaceholderText > getByText > getByTestId.
 *
 * ## На собеседовании
 * - Почему getByRole первый? — Ближе к реальному a11y дерева.
 */

export function LoginForm() {
  return (
    <form aria-label="Login">
      <label>
        Email
        <input type="email" />
      </label>
      <button type="submit">Sign in</button>
    </form>
  );
}
