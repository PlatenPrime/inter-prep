<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
:root {
  --text: #1a1a2e;
  --muted: #64748b;
  --accent: #00dc82;
  --border: #e2e8f0;
  --surface: #ffffff;
  --bg: #f8fafc;
}

:root[data-theme='dark'] {
  --text: #f1f5f9;
  --muted: #94a3b8;
  --accent: #00dc82;
  --border: #334155;
  --surface: #1e293b;
  --bg: #0f172a;
}

html,
body {
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
  background: var(--bg);
  color: var(--text);
}
</style>
