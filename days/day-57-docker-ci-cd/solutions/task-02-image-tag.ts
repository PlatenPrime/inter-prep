export function parseImageRef(ref: string) {
  const [name, tag = 'latest'] = ref.includes(':') ? ref.split(':') : [ref, 'latest'];
  return { name, tag };
}
