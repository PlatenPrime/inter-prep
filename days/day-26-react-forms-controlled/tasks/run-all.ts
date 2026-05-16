import { parseFormData } from '../solutions/task-01-parse-form-data.ts';
import { validateField } from '../solutions/task-02-validate-field.ts';
import { controlledValue } from '../solutions/task-03-controlled-value.ts';
import { formReducer } from '../solutions/task-04-form-reducer.ts';

let passed = 0;
let failed = 0;

function assert(name: boolean | string, condition?: boolean): void {
  const label = typeof name === 'string' ? name : 'assert';
  const ok = typeof name === 'string' ? Boolean(condition) : Boolean(name);
  if (ok) {
    passed++;
    console.log(`  ✓ ${label}`);
  } else {
    failed++;
    console.log(`  ✗ ${label}`);
  }
}

console.log('Day 26 — React Controlled Forms (solutions)\n');

const fd = new FormData();
fd.set('email', 'a@b.co');
assert('parseFormData', parseFormData(fd).email === 'a@b.co');

assert('validateField required', validateField('', { required: true }) === 'Required');
assert('validateField ok', validateField('abc', { minLength: 2 }) === null);

let v = 'hi';
const binding = controlledValue(v, (n) => { v = n; });
binding.onChange({ target: { value: 'bye' } });
assert('controlledValue', v === 'bye');

const st = formReducer({ values: {}, errors: {} }, { type: 'SET_FIELD', field: 'x', value: '1' });
assert('formReducer', st.values.x === '1');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
