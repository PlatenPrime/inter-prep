/** @typedef {import('./file-template.mjs').Task} Task */

/** @type {Task[]} */
export const tasks = [
  {
    num: 51,
    slug: 'controlled-text',
    folder: '06-forms',
    title: 'Controlled text',
    tags: ['forms'],
    difficulty: 'easy',
    exportName: 'TextField',
    theory: `value + onChange синхронизируют input с React state.`,
    interview: `- textarea controlled? — То же: value + onChange.`,
    component: `import { useState } from 'react';

export function TextField() {
  const [v, setV] = useState('');
  return <input aria-label="Title" value={v} onChange={(e) => setV(e.target.value)} />;
}`,
    test: `it('types text', async () => {
    const user = userEvent.setup();
    render(<TextField />);
    await user.type(screen.getByLabelText('Title'), 'Hi');
    expect(screen.getByLabelText('Title')).toHaveValue('Hi');
  });`,
  },
  {
    num: 52,
    slug: 'checkbox-group',
    folder: '06-forms',
    title: 'Checkbox group',
    tags: ['forms'],
    difficulty: 'medium',
    exportName: 'CheckboxGroup',
    theory: `Группа чекбоксов: Set или массив выбранных id. checked={selected.has(id)}.`,
    interview: `- Controlled checkbox? — checked + onChange, не defaultChecked.`,
    component: `import { useState } from 'react';

const OPTIONS = ['a', 'b', 'c'] as const;

export function CheckboxGroup() {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  return (
    <fieldset>
      <legend>Pick</legend>
      {OPTIONS.map((id) => (
        <label key={id}>
          <input
            type="checkbox"
            checked={selected.includes(id)}
            onChange={() => toggle(id)}
          />
          {id}
        </label>
      ))}
      <p data-testid="count">{selected.length}</p>
    </fieldset>
  );
}`,
    test: `it('selects two', async () => {
    const user = userEvent.setup();
    render(<CheckboxGroup />);
    await user.click(screen.getByLabelText('a'));
    await user.click(screen.getByLabelText('b'));
    expect(screen.getByTestId('count')).toHaveTextContent('2');
  });`,
  },
  {
    num: 53,
    slug: 'select-controlled',
    folder: '06-forms',
    title: 'Select controlled',
    tags: ['forms'],
    difficulty: 'easy',
    exportName: 'CountrySelect',
    theory: `select value привязан к state. option value — строка.`,
    interview: `- multiple select? — value как массив.`,
    component: `import { useState } from 'react';

export function CountrySelect() {
  const [country, setCountry] = useState('us');
  return (
    <label>
      Country
      <select value={country} onChange={(e) => setCountry(e.target.value)}>
        <option value="us">US</option>
        <option value="uk">UK</option>
      </select>
      <output data-testid="out">{country}</output>
    </label>
  );
}`,
    test: `it('changes country', async () => {
    const user = userEvent.setup();
    render(<CountrySelect />);
    await user.selectOptions(screen.getByRole('combobox'), 'uk');
    expect(screen.getByTestId('out')).toHaveTextContent('uk');
  });`,
  },
  {
    num: 54,
    slug: 'validation-message',
    folder: '06-forms',
    title: 'Validation message',
    tags: ['forms', 'validation'],
    difficulty: 'medium',
    exportName: 'EmailForm',
    theory: `Валидация on submit или on blur. aria-invalid и role=alert для a11y.`,
    interview: `- Client vs server validation? — Оба: UX на клиенте, безопасность на сервере.`,
    component: `import { useState } from 'react';

export function EmailForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Invalid email');
      return;
    }
    setError('');
  };
  return (
    <form onSubmit={submit}>
      <input aria-label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      {error && <p role="alert">{error}</p>}
      <button type="submit">Save</button>
    </form>
  );
}`,
    test: `it('shows error', async () => {
    const user = userEvent.setup();
    render(<EmailForm />);
    await user.type(screen.getByLabelText('Email'), 'bad');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email');
  });`,
  },
  {
    num: 55,
    slug: 'use-action-state',
    folder: '06-forms',
    title: 'useActionState',
    tags: ['forms', 'react-19'],
    difficulty: 'hard',
    exportName: 'ActionForm',
    theory: `useActionState (React 19) связывает form action с pending state и результатом.`,
    interview: `- Server Actions? — async функции на сервере, на клиенте — progressive enhancement.`,
    related: 'webdev/15. react/024-chto-takoe-react-huki-hooks.md',
    component: `import { useActionState } from 'react';

async function saveName(_prev: string, formData: FormData) {
  const name = String(formData.get('name') ?? '');
  await new Promise((r) => setTimeout(r, 10));
  return name ? \`Saved: \${name}\` : 'Name required';
}

export function ActionForm() {
  const [message, action, pending] = useActionState(saveName, '');
  return (
    <form action={action}>
      <input name="name" aria-label="Name" />
      <button type="submit" disabled={pending}>
        {pending ? 'Saving…' : 'Save'}
      </button>
      <p data-testid="msg">{message}</p>
    </form>
  );
}`,
    test: `it('saves via action', async () => {
    const user = userEvent.setup();
    render(<ActionForm />);
    await user.type(screen.getByLabelText('Name'), 'Ada');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByText('Saved: Ada')).toBeInTheDocument();
  });`,
  },
  {
    num: 56,
    slug: 'form-reducer',
    folder: '06-forms',
    title: 'Form reducer',
    tags: ['forms', 'useReducer'],
    difficulty: 'medium',
    exportName: 'ProfileForm',
    theory: `useReducer для формы: action UPDATE_FIELD / RESET. Предсказуемые transitions.`,
    interview: `- reducer vs many useState? — Меньше merge bugs в больших формах.`,
    component: `import { useReducer } from 'react';

type State = { name: string; bio: string };
type Action = { type: 'set'; field: keyof State; value: string } | { type: 'reset' };

function reducer(state: State, action: Action): State {
  if (action.type === 'reset') return { name: '', bio: '' };
  return { ...state, [action.field]: action.value };
}

export function ProfileForm() {
  const [state, dispatch] = useReducer(reducer, { name: '', bio: '' });
  return (
    <div>
      <input
        aria-label="Name"
        value={state.name}
        onChange={(e) => dispatch({ type: 'set', field: 'name', value: e.target.value })}
      />
      <button type="button" onClick={() => dispatch({ type: 'reset' })}>
        Reset
      </button>
      <p data-testid="name">{state.name}</p>
    </div>
  );
}`,
    test: `it('resets form', async () => {
    const user = userEvent.setup();
    render(<ProfileForm />);
    await user.type(screen.getByLabelText('Name'), 'Ada');
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByTestId('name')).toHaveTextContent('');
  });`,
  },
  {
    num: 57,
    slug: 'reset-form',
    folder: '06-forms',
    title: 'Reset form',
    tags: ['forms'],
    difficulty: 'easy',
    exportName: 'ResettableForm',
    theory: `key={formKey} на форме сбрасывает uncontrolled. Controlled — сброс state в initial.`,
    interview: `- native reset button? — Работает для uncontrolled, не для весь state в React.`,
    component: `import { useState } from 'react';

export function ResettableForm() {
  const [key, setKey] = useState(0);
  const [value, setValue] = useState('');
  return (
    <div key={key}>
      <input aria-label="Field" value={value} onChange={(e) => setValue(e.target.value)} />
      <button
        type="button"
        onClick={() => {
          setValue('');
          setKey((k) => k + 1);
        }}
      >
        Reset
      </button>
    </div>
  );
}`,
    test: `it('clears field', async () => {
    const user = userEvent.setup();
    render(<ResettableForm />);
    await user.type(screen.getByLabelText('Field'), 'x');
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByLabelText('Field')).toHaveValue('');
  });`,
  },
  {
    num: 58,
    slug: 'file-input',
    folder: '06-forms',
    title: 'File input',
    tags: ['forms'],
    difficulty: 'medium',
    exportName: 'FilePicker',
    theory: `input type=file — files в event.target.files. Controlled file input ограничен в React.`,
    interview: `- Загрузка файлов? — FormData + fetch или presigned URL.`,
    component: `import { useState } from 'react';

export function FilePicker() {
  const [name, setName] = useState('');
  return (
    <div>
      <input
        type="file"
        aria-label="File"
        onChange={(e) => setName(e.target.files?.[0]?.name ?? '')}
      />
      <span data-testid="name">{name || 'none'}</span>
    </div>
  );
}`,
    test: `it('shows file name', async () => {
    const user = userEvent.setup();
    render(<FilePicker />);
    const file = new File(['x'], 'test.txt', { type: 'text/plain' });
    await user.upload(screen.getByLabelText('File'), file);
    expect(screen.getByTestId('name')).toHaveTextContent('test.txt');
  });`,
  },
  {
    num: 59,
    slug: 'default-value',
    folder: '06-forms',
    title: 'defaultValue uncontrolled',
    tags: ['forms'],
    difficulty: 'easy',
    exportName: 'DefaultInput',
    theory: `defaultValue задаёт начальное значение uncontrolled input без синхронизации каждого keystroke.`,
    interview: `- Когда defaultValue? — Простые формы, миграция с HTML.`,
    component: `export function DefaultInput() {
  return <input aria-label="City" defaultValue="Berlin" />;
}`,
    test: `it('has default', () => {
    render(<DefaultInput />);
    expect(screen.getByLabelText('City')).toHaveValue('Berlin');
  });`,
  },
  {
    num: 60,
    slug: 'submit-prevent',
    folder: '06-forms',
    title: 'Submit preventDefault',
    tags: ['forms'],
    difficulty: 'easy',
    exportName: 'PreventSubmit',
    theory: `e.preventDefault() на submit отменяет полную перезагрузку страницы. SPA обрабатывает форму в JS.`,
    interview: `- Без preventDefault? — Браузер отправит форму и перезагрузит страницу.`,
    component: `import { useState } from 'react';

export function PreventSubmit() {
  const [sent, setSent] = useState(false);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <button type="submit">Send</button>
      {sent && <p>Sent</p>}
    </form>
  );
}`,
    test: `it('shows sent without reload', async () => {
    const user = userEvent.setup();
    render(<PreventSubmit />);
    await user.click(screen.getByRole('button', { name: 'Send' }));
    expect(screen.getByText('Sent')).toBeInTheDocument();
  });`,
  },
];
