<script setup lang="ts">
import type { EventItem, Movie, Showtime } from '~/types'

definePageMeta({ layout: 'admin' })

const { adminFetch } = useAdminAccess()

const [{ data: movies }, { data: showtimes }, { data: events }] = await Promise.all([
  useAsyncData('admin-overview-movies', () => adminFetch<{ data: Movie[] }>('/api/admin/movies')),
  useAsyncData('admin-overview-showtimes', () => adminFetch<{ data: Showtime[] }>('/api/admin/showtimes')),
  useAsyncData('admin-overview-events', () => adminFetch<{ data: EventItem[] }>('/api/admin/events'))
])
</script>

<template>
  <section>
    <h1 class="mb-6 text-2xl font-semibold text-amber-100">نظرة عامة</h1>
    <div class="grid gap-4 md:grid-cols-3">
      <div class="panel p-5">
        <p class="text-sm text-zinc-400">الأفلام</p>
        <p class="text-3xl font-semibold text-gold">{{ movies?.data?.length || 0 }}</p>
      </div>
      <div class="panel p-5">
        <p class="text-sm text-zinc-400">مواعيد العرض</p>
        <p class="text-3xl font-semibold text-gold">{{ showtimes?.data?.length || 0 }}</p>
      </div>
      <div class="panel p-5">
        <p class="text-sm text-zinc-400">الفعاليات</p>
        <p class="text-3xl font-semibold text-gold">{{ events?.data?.length || 0 }}</p>
      </div>
    </div>
  </section>
</template>
