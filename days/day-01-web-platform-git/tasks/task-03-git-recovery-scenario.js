/**
 * Task 03 — Recover commit from reflog
 *
 * Reflog lines format: "<sha> HEAD@{n}: <message>"
 * Given reflog lines (newest first) and a message substring to find,
 * return the SHA of the first matching entry, or null.
 *
 * @param {string[]} reflogLines
 * @param {string} messageSubstring
 * @returns {string | null}
 *
 * Example:
 *   recoverFromReflog(['abc1234 HEAD@{0}: reset: moving to HEAD~1', 'def5678 HEAD@{1}: commit: add feature'], 'add feature')
 *   // => 'def5678'
 */

// TODO: implement recoverFromReflog(reflogLines, messageSubstring)

export function recoverFromReflog(reflogLines, messageSubstring) {
  throw new Error('Not implemented');
}
