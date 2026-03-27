<template>
  <div class="min-h-screen bg-noir">
    <div class="pointer-events-none fixed inset-0 -z-10 bg-aurora opacity-80" />
    <AppHeader />
    <main class="container-premium py-8">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
