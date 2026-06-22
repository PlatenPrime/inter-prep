/**
 * resolveThis — solution
 */
/**
 * @typedef {{ mode: 'global'|'method'|'call'|'apply'|'bind'|'new'|'arrow'; obj?: object; ctx?: unknown; strict?: boolean; lexicalThis?: unknown }} CallDescriptor
 * @param {CallDescriptor} descriptor
 * @returns {unknown}
 */

export function resolveThis(descriptor) {
  const { mode, obj, ctx, strict = true } = descriptor;
  switch (mode) {
    case 'global':
      return strict ? undefined : globalThis;
    case 'method':
      return obj;
    case 'call':
    case 'apply':
    case 'bind':
      return ctx;
    case 'new':
      return {};
    case 'arrow':
      return descriptor.lexicalThis;
    default:
      return undefined;
  }
}
