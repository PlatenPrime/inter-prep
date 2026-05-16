const P=[['pointerdown','pointerup','click'],['focusin','pointerdown','pointerup','click']];
export function isValidClickSequence(e: string[]): boolean {
  return P.some(p=>p.length===e.length&&p.every((v,i)=>v===e[i]));
}
