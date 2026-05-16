const UTILITY_MAP = {
  'p-4': { padding: '1rem' },
  'p-2': { padding: '0.5rem' },
  'px-4': { paddingLeft: '1rem', paddingRight: '1rem' },
  'm-2': { margin: '0.5rem' },
  'm-4': { margin: '1rem' },
  'mt-2': { marginTop: '0.5rem' },
  flex: { display: 'flex' },
  grid: { display: 'grid' },
  'flex-col': { flexDirection: 'column' },
  'items-center': { alignItems: 'center' },
  'justify-between': { justifyContent: 'space-between' },
  'text-sm': { fontSize: '0.875rem' },
  'text-lg': { fontSize: '1.125rem' },
  'font-bold': { fontWeight: '700' },
  hidden: { display: 'none' },
  block: { display: 'block' },
  'bg-blue-500': { backgroundColor: '#3b82f6' },
  'text-white': { color: '#ffffff' },
  rounded: { borderRadius: '0.25rem' },
  'gap-4': { gap: '1rem' },
};

export function parseUtilities(classString) {
  const classes = classString.trim().split(/\s+/).filter(Boolean);
  return classes.reduce((styles, cls) => {
    const mapped = UTILITY_MAP[cls];
    return mapped ? { ...styles, ...mapped } : styles;
  }, {});
}

export { UTILITY_MAP };
