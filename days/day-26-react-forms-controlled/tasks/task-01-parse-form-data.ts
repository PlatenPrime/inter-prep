/** @param fd FormData-like with entries() */
export function parseFormData(fd: { entries: () => Iterable<[string, FormDataEntryValue]> }): Record<string, string> {
  throw new Error('Not implemented');
}