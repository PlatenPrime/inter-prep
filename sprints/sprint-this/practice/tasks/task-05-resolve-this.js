/**
 * resolveThis
 * Predict this for a call site descriptor.
 */
/**
 * @typedef {{ mode: 'global'|'method'|'call'|'apply'|'bind'|'new'|'arrow'; obj?: object; ctx?: unknown; strict?: boolean; lexicalThis?: unknown }} CallDescriptor
 * @param {CallDescriptor} descriptor
 * @returns {unknown}
 */

export function resolveThis(descriptor) {
  throw new Error('Not implemented');
}
