/**
 * 026 — useReducer
 * @tags useReducer
 * @difficulty medium
 *
 * ## Теория
 * useReducer для сложного state: (state, action) => newState. Удобно тестировать reducer отдельно.
 *
 * ## На собеседовании
 * - useReducer vs useState? — Много связанных полей и явные transitions.
 */

import { useReducer } from 'react';

type State = { step: number };
type Action = { type: 'next' } | { type: 'reset' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'next':
      return { step: state.step + 1 };
    case 'reset':
      return { step: 0 };
    default:
      return state;
  }
}

export function Stepper() {
  const [state, dispatch] = useReducer(reducer, { step: 0 });
  return (
    <div>
      <span data-testid="step">{state.step}</span>
      <button type="button" onClick={() => dispatch({ type: 'next' })}>
        Next
      </button>
      <button type="button" onClick={() => dispatch({ type: 'reset' })}>
        Reset
      </button>
    </div>
  );
}
