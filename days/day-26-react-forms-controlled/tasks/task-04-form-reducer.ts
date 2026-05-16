export type FormState = { values: Record<string, string>; errors: Record<string, string> };
export type FormAction =
  | { type: 'SET_FIELD'; field: string; value: string }
  | { type: 'RESET'; initial: Record<string, string> };

/** @param state @param action */
export function formReducer(state: FormState, action: FormAction): FormState {
  throw new Error('Not implemented');
}