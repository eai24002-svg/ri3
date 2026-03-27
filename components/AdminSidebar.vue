<script setup lang="ts">
const { withAdminPath } = useAdminAccess()
const loggedIn = useCookie('admin_logged_in')

const logout = async () => {
  await $fetch('/api/admin/logout', { method: 'POST' })
  loggedIn.value = null
  await navigateTo('/admin/login')
}
</script>

<template>
  <aside class="w-full border-b border-zinc-800 bg-zinc-950 p-4 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
    <h2 class="mb-4 text-lg font-semibold text-gold">لوحة التحكم</h2>
    <nav class="flex flex-wrap gap-2 md:flex-col">
      <NuxtLink :to="withAdminPath('/admin')" class="rounded-lg px-3 py-2 text-sm hover:bg-zinc-900">نظرة عامة</NuxtLink>
      <NuxtLink :to="withAdminPath('/admin/movies')" class="rounded-lg px-3 py-2 text-sm hover:bg-zinc-900">الأفلام</NuxtLink>
      <NuxtLink :to="withAdminPath('/admin/showtimes')" class="rounded-lg px-3 py-2 text-sm hover:bg-zinc-900">مواعيد العرض</NuxtLink>
      <NuxtLink :to="withAdminPath('/admin/events')" class="rounded-lg px-3 py-2 text-sm hover:bg-zinc-900">الفعاليات</NuxtLink>
      <NuxtLink :to="withAdminPath('/admin/settings')" class="rounded-lg px-3 py-2 text-sm hover:bg-zinc-900">الإعدادات</NuxtLink>
      <button class="rounded-lg px-3 py-2 text-right text-sm text-red-300 hover:bg-zinc-900" @click="logout">تسجيل الخروج</button>
    </nav>
  </aside>
</template>
