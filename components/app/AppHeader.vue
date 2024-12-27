<template>
  <header class="header">
    <div class="container">
      <nav class="nav">
        <NuxtLink to="/" class="nav__logo">
          <i class="fas fa-sticky-note"></i>
          <span>Заметки</span>
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__logo {
    display: flex;
    align-items: center;
    gap: spacing('sm');
    font-size: 1.25rem;
    font-weight: 600;
    color: color('primary', 'base');
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: color('primary', 'hover');
    }
  }
}
</style> 