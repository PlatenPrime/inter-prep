/**
 * 056 — Form reducer
 * @tags forms, useReducer
 * @difficulty medium
 *
 * ## Теория
 * useReducer для формы: action UPDATE_FIELD / RESET. Предсказуемые transitions.
 *
 * ## На собеседовании
 * - reducer vs many useState? — Меньше merge bugs в больших формах.
 */

import { useReducer } from 'react';

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
}
