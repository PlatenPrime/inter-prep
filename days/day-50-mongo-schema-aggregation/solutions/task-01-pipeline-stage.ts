export function pipelineHasStage(stages: { op: string }[], op: string): boolean {
  return stages.some((s) => s.op === op);
}
