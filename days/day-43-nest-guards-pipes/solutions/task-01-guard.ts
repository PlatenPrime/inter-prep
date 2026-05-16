export function canActivate(roles: string[], required: string): boolean {
  return roles.includes(required) || roles.includes('admin');
}
