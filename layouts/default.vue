<template>
  <div class="layout">
    <AppHeader />
    
    <main class="layout__main">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>

<style lang="scss" scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  &__main {
    flex: 1;
    padding: spacing('xl') 0;
  }
}
</style> 