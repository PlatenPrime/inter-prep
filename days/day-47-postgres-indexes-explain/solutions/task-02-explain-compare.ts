export function cheaperPlan(a: { cost: number }, b: { cost: number }) {
  return a.cost <= b.cost ? a : b;
}
