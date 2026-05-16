export type FormState = { values: Record<string, string>; errors: Record<string, string> };
export type FormAction =
  | { type: 'SET_FIELD'; field: string; value: string }
  | { type: 'RESET'; initial: Record<string, string> };

export function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
      };
    case 'RESET':
      return { values: { ...action.initial }, errors: {} };
    default:
      return state;
  }
}