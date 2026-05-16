import { semanticAudit } from '../solutions/task-01-semantic-audit.js';
import { createDelegatedHandler } from '../solutions/task-02-event-delegation.js';
import { recoverFromReflog } from '../solutions/task-03-git-recovery-scenario.js';
import { parseGitLog } from '../solutions/task-04-parse-git-log.js';

let passed = 0;
let failed = 0;

function assert(name, condition) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.log(`  ✗ ${name}`);
  }
}

console.log('Day 01 — task tests (solutions)\n');

const html =
  '<div onclick="x()">Click</motion.div><img src="a.png"><h1>A</h1><h3>B</h3><button></button>';
assert(
  'semantic audit',
  JSON.stringify(semanticAudit(html)) ===
    JSON.stringify(['div-button', 'empty-button', 'img-missing-alt', 'missing-main', 'skipped-heading'])
);

const htmlOk = '<main><h1>Title</h1><h2>Sub</h2><button>OK</button><img alt="" src="x"></main>';
assert('semantic audit clean', semanticAudit(htmlOk).length === 0);

let clicked = null;
const handler = createDelegatedHandler('.item', (el) => {
  clicked = el.id;
});
handler({
  type: 'click',
  target: { closest: (s) => (s === '.item' ? { id: 'item-1' } : null) },
});
assert('delegation', clicked === 'item-1');

const reflog = [
  'abc1234 HEAD@{0}: reset: moving to HEAD~1',
  'def5678 HEAD@{1}: commit: add feature',
];
assert('reflog recovery', recoverFromReflog(reflog, 'add feature') === 'def5678');
assert('reflog miss', recoverFromReflog(reflog, 'nonexistent') === null);

const log = 'a1b2c3d Fix bug\ne5f6g7h Add feature\n\ninvalidline';
const parsed = parseGitLog(log);
assert('parse log length', parsed.length === 2);
assert('parse log first', parsed[0].sha === 'a1b2c3d' && parsed[0].message === 'Fix bug');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
