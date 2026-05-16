export function parseGitLog(logOutput) {
  const result = [];
  for (const line of logOutput.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const spaceIdx = trimmed.indexOf(' ');
    if (spaceIdx === -1) continue;
    result.push({
      sha: trimmed.slice(0, spaceIdx),
      message: trimmed.slice(spaceIdx + 1),
    });
  }
  return result;
}
