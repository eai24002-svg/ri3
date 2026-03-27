<template>
  <div class="min-h-screen bg-black text-ivory md:flex">
    <AdminSidebar />
    <main class="flex-1 p-4 md:p-8">
      <slot />
    </main>
  </div>
</template>
