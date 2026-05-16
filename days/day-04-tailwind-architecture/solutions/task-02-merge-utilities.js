import { parseUtilities } from './task-01-parse-utilities.js';

const PROPERTY_KEYS = new Set([
  'padding',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingBottom',
  'margin',
  'marginTop',
  'marginLeft',
  'marginRight',
  'marginBottom',
  'display',
  'flexDirection',
  'alignItems',
  'justifyContent',
  'fontSize',
  'fontWeight',
  'backgroundColor',
  'color',
  'borderRadius',
  'gap',
]);

export function mergeUtilities(classStrings) {
  const merged = {};
  const order = [];

  for (const classString of classStrings) {
    const styles = parseUtilities(classString);
    for (const [key, value] of Object.entries(styles)) {
      if (!PROPERTY_KEYS.has(key)) continue;
      if (!(key in merged)) order.push(key);
      merged[key] = value;
    }
  }

  return merged;
}
