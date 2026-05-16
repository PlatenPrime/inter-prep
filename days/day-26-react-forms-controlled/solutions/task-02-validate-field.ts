export function validateField(
  value: string,
  rules: { required?: boolean; minLength?: number },
): string | null {
  if (rules.required && !value.trim()) return 'Required';
  if (rules.minLength != null && value.length < rules.minLength) {
    return `Min length ${rules.minLength}`;
  }
  return null;
}