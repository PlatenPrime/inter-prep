function normalizeSides(value) {
  if (typeof value === 'number') {
    return { top: value, right: value, bottom: value, left: value };
  }
  return {
    top: value.top ?? 0,
    right: value.right ?? 0,
    bottom: value.bottom ?? 0,
    left: value.left ?? 0,
  };
}

export function computeOuterSize({
  width,
  height,
  padding = 0,
  border = 0,
  margin = 0,
  boxSizing = 'content-box',
}) {
  const p = normalizeSides(padding);
  const b = normalizeSides(border);
  const m = normalizeSides(margin);

  const padH = p.left + p.right;
  const padV = p.top + p.bottom;
  const borderH = b.left + b.right;
  const borderV = b.top + b.bottom;
  const marginH = m.left + m.right;
  const marginV = m.top + m.bottom;

  let contentW = width;
  let contentH = height;

  if (boxSizing === 'border-box') {
    contentW = width - padH - borderH;
    contentH = height - padV - borderV;
  }

  const outerWidth = marginH + borderH + padH + contentW;
  const outerHeight = marginV + borderV + padV + contentH;

  return { outerWidth, outerHeight };
}
