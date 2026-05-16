export function sumReducer(state: number, action: { type: 'add' | 'reset'; value?: number }): number {
  if (action.type === 'reset') return 0;
  return state + (action.value ?? 0);
}
