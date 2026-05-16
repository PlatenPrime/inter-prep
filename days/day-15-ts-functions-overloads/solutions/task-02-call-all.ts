export async function callAll(fns: Array<() => void | Promise<void>>): Promise<void> {
  await Promise.all(fns.map((fn) => fn()));
}