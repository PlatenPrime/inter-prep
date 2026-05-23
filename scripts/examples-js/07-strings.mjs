/** @type {import('./file-template.mjs').Task[]} */
export const tasks = [
  { num: 121, slug: 'capitalize', folder: '07-strings', title: 'capitalize', tags: ['strings'], difficulty: 'easy', description: 'capitalize первое слово.', solution: `export function capitalize(str) {
  if (!str) return str;
  return str[0].toUpperCase() + str.slice(1);
}`, test: `assert(capitalize('hello') === 'Hello');` },
  { num: 122, slug: 'camel-case', folder: '07-strings', title: 'camelCase', tags: ['strings'], difficulty: 'easy', description: 'to camelCase.', solution: `export function camelCase(str) {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^./, (c) => c.toLowerCase());
}`, test: `assert(camelCase('foo-bar') === 'fooBar');` },
  { num: 123, slug: 'kebab-case', folder: '07-strings', title: 'kebab-case', tags: ['strings'], difficulty: 'easy', description: 'to kebab-case.', solution: `export function kebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}`, test: `assert(kebabCase('fooBar') === 'foo-bar');` },
  { num: 124, slug: 'snake-case', folder: '07-strings', title: 'snake_case', tags: ['strings'], difficulty: 'easy', description: 'to snake_case.', solution: `export function snakeCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}`, test: `assert(snakeCase('fooBar') === 'foo_bar');` },
  { num: 125, slug: 'slugify', folder: '07-strings', title: 'slugify', tags: ['strings'], difficulty: 'easy', description: 'URL slug из строки.', solution: `export function slugify(str) {
  return str.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}`, test: `assert(slugify(' Hello World! ') === 'hello-world');` },
  { num: 126, slug: 'truncate', folder: '07-strings', title: 'truncate', tags: ['strings'], difficulty: 'easy', description: 'truncate с suffix.', solution: `export function truncate(str, max, suffix = '...') {
  if (str.length <= max) return str;
  return str.slice(0, max - suffix.length) + suffix;
}`, test: `assert(truncate('abcdef', 5) === 'ab...');` },
  { num: 127, slug: 'pad', folder: '07-strings', title: 'pad', tags: ['strings'], difficulty: 'easy', description: 'pad(str, len, char, side).', solution: `export function pad(str, len, char = ' ', side = 'end') {
  const padLen = Math.max(0, len - str.length);
  const p = char.repeat(padLen);
  return side === 'start' ? p + str : str + p;
}`, test: `assert(pad('1', 3, '0', 'start') === '001');` },
  { num: 128, slug: 'trim-lines', folder: '07-strings', title: 'trim lines', tags: ['strings'], difficulty: 'easy', description: 'trim каждой строки multiline.', solution: `export function trimLines(str) {
  return str.split('\\n').map((l) => l.trim()).join('\\n');
}`, test: `assert(trimLines('  a  \\n  b  ') === 'a\\nb');` },
  { num: 129, slug: 'parse-query', folder: '07-strings', title: 'parse query', tags: ['strings'], difficulty: 'medium', description: 'query string → object.', solution: `export function parseQuery(qs) {
  const s = qs.startsWith('?') ? qs.slice(1) : qs;
  if (!s) return {};
  return Object.fromEntries(s.split('&').map((p) => {
    const [k, v = ''] = p.split('=');
    return [decodeURIComponent(k), decodeURIComponent(v)];
  }));
}`, test: `assert(parseQuery('a=1&b=2').a === '1');` },
  { num: 130, slug: 'stringify-query', folder: '07-strings', title: 'stringify query', tags: ['strings'], difficulty: 'easy', description: 'object → query string.', solution: `export function stringifyQuery(obj) {
  return Object.entries(obj)
    .map(([k, v]) => \`\${encodeURIComponent(k)}=\${encodeURIComponent(String(v))}\`)
    .join('&');
}`, test: `assert(stringifyQuery({ a: 1 }) === 'a=1');` },
  { num: 131, slug: 'template', folder: '07-strings', title: 'template', tags: ['strings'], difficulty: 'easy', description: 'template("Hi {{name}}", { name }).', solution: `export function template(str, data) {
  return str.replace(/\\{\\{\\s*(\\w+)\\s*\\}\\}/g, (_, key) => String(data[key] ?? ''));
}`, test: `assert(template('Hi {{name}}', { name: 'Ann' }) === 'Hi Ann');` },
  { num: 132, slug: 'escape-html', folder: '07-strings', title: 'escape html', tags: ['strings'], difficulty: 'easy', description: 'escape HTML entities.', solution: `export function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}`, test: `assert(escapeHtml('<b>') === '&lt;b&gt;');` },
  { num: 133, slug: 'is-palindrome', folder: '07-strings', title: 'is palindrome', tags: ['strings', 'algorithms'], difficulty: 'easy', description: 'Палиндром (буквы/цифры).', solution: `export function isPalindrome(str) {
  const s = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return s === [...s].reverse().join('');
}`, test: `assert(isPalindrome('A man, a plan, a canal: Panama') === true);` },
  { num: 134, slug: 'anagram', folder: '07-strings', title: 'anagram', tags: ['strings'], difficulty: 'easy', description: 'Проверка анаграммы.', solution: `export function anagram(a, b) {
  const norm = (s) => s.toLowerCase().replace(/\\s/g, '').split('').sort().join('');
  return norm(a) === norm(b);
}`, test: `assert(anagram('listen', 'silent') === true);` },
  { num: 135, slug: 'count-words', folder: '07-strings', title: 'count words', tags: ['strings'], difficulty: 'easy', description: 'Подсчёт слов.', solution: `export function countWords(str) {
  return str.trim() ? str.trim().split(/\\s+/).length : 0;
}`, test: `assert(countWords('one two three') === 3);` },
];
