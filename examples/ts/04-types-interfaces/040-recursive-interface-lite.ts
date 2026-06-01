/**
 * 040 — recursive interface (lite)
 * @tags interface, recursive
 * @difficulty hard
 *
 * ## Теория
 * interface может ссылаться на себя: TreeNode { children: TreeNode[] }.
 * Нужно для деревьев, JSON, AST, меню навигации.
 * type alias тоже рекурсивен: type Json = string | number | Json[] | { [k: string]: Json }.
 * Ограничение глубины — только логика приложения; TS не лимитирует рекурсию типов (кроме complexity).
 * Для optional children используй children?: TreeNode[].
 *
 * ## На собеседовании
 * - interface vs type для рекурсии? — Оба работают; type удобнее для union-рекурсии (JSON).
 * - Опасность? — Бесконечная вложенность в данных, не в типе.
 * - JSON type на собеседовании? — Классический recursive union type.
 *
 * ## Связанные темы
 * - webdev/14. ts/007-tipy-v-typescript.md
 * - webdev/14. ts/008-raznica-type-i-interface.md
 */

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

export function countNodes(root: TreeNode): number {
  let n = 1;
  for (const child of root.children ?? []) n += countNodes(child);
  return n;
}

export function findById(root: TreeNode, id: string): TreeNode | undefined {
  if (root.id === id) return root;
  for (const child of root.children ?? []) {
    const found = findById(child, id);
    if (found) return found;
  }
  return undefined;
}

export function maxDepth(root: TreeNode): number {
  const kids = root.children ?? [];
  if (kids.length === 0) return 1;
  return 1 + Math.max(...kids.map(maxDepth));
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

function runTests() {
  const tree: TreeNode = {
    id: 'r', label: 'root', children: [
      { id: 'a', label: 'a' },
      { id: 'b', label: 'b', children: [{ id: 'b1', label: 'b1' }] },
    ],
  };
  assert(countNodes(tree) === 4);
  assert(findById(tree, 'b1')?.label === 'b1');
  assert(maxDepth(tree) === 3);
  console.log('040-recursive-interface-lite: ok');
}

const isMain =
  process.argv[1] &&
  (() => {
    const a = path.normalize(fileURLToPath(import.meta.url));
    const b = path.normalize(path.resolve(process.argv[1]));
    return a === b;
  })();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
