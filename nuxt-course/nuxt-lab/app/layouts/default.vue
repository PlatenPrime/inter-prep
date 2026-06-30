<template>
  <div class="layout">
    <header class="header">
      <NuxtLink to="/" class="logo">Blog Catalog</NuxtLink>
      <nav class="nav">
        <NuxtLink to="/blog">Blog</NuxtLink>
        <NuxtLink to="/admin">Admin</NuxtLink>
        <ClientOnly>
          <ThemeToggle />
          <template #fallback>
            <span class="theme-fallback">Theme</span>
          </template>
        </ClientOnly>
      </nav>
    </header>
    <main class="main">
      <slot />
    </main>
    <footer class="footer">
      <p>Nuxt 4 SSR Course — Blog Catalog capstone</p>
    </footer>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border);
}

.logo {
  font-weight: 700;
  color: var(--accent);
  text-decoration: none;
}

.nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav a {
  color: var(--text);
  text-decoration: none;
}

.nav a.router-link-active {
  color: var(--accent);
  font-weight: 600;
}

.theme-fallback {
  font-size: 0.875rem;
  color: var(--muted);
}

.main {
  flex: 1;
  padding: 1.5rem;
  max-width: 720px;
  margin: 0 auto;
  width: 100%;
}

.footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border);
  text-align: center;
  font-size: 0.875rem;
  color: var(--muted);
}
</style>
