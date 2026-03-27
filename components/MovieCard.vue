<script setup lang="ts">
import type { Movie, Settings, ShowStatus } from '~/types'

defineProps<{
  movie: Movie
  settings: Settings | null
}>()

const { callHref, whatsappHref } = useContactActions()

const statusLabel = (status: ShowStatus) => {
  if (status === 'limited') return 'محدود'
  if (status === 'full') return 'ممتلئ'
  if (status === 'closed') return 'مغلق'
  return 'متاح'
}
</script>

<template>
  <article class="panel overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow">
    <div class="grid gap-4 md:grid-cols-3">
      <img :src="movie.poster_url" :alt="movie.title" class="h-full min-h-56 w-full object-cover">

      <div class="space-y-3 p-4 md:col-span-2">
        <div class="flex flex-wrap items-center gap-2">
          <h3 class="text-xl font-semibold text-amber-100">{{ movie.title }}</h3>
          <span class="rounded-full border border-amber-400/40 px-2 py-0.5 text-xs text-gold">{{ movie.classification }}</span>
          <span class="text-xs text-zinc-400">{{ movie.duration_minutes }} دقيقة</span>
        </div>

        <p class="text-sm leading-relaxed text-zinc-300">{{ movie.description }}</p>

        <a :href="movie.trailer_url" target="_blank" class="inline-flex text-sm text-gold hover:text-amber-200">
          مشاهدة الإعلان
        </a>

        <div v-if="movie.showtimes?.length" class="space-y-3">
          <div v-for="showtime in movie.showtimes" :key="showtime.id" class="rounded-xl border border-zinc-800 bg-black/40 p-3">
            <div class="mb-3 flex items-center justify-between text-sm">
              <span>{{ showtime.show_date }} - {{ showtime.show_time }}</span>
              <span class="rounded-full px-2 py-0.5 text-xs" :class="{
                'bg-emerald-600/30 text-emerald-300': showtime.status === 'available',
                'bg-amber-600/30 text-amber-200': showtime.status === 'limited',
                'bg-red-700/30 text-red-300': showtime.status === 'full' || showtime.status === 'closed'
              }">
                {{ statusLabel(showtime.status) }}
              </span>
            </div>

            <SeatGrid :seats="showtime.seats || []" />
          </div>
        </div>

        <div class="flex flex-wrap gap-3">
          <a :href="callHref(settings?.phone_number)" class="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300">
            اتصال للحجز
          </a>
          <a :href="whatsappHref(settings?.whatsapp_number)" target="_blank" class="rounded-lg border border-amber-400/40 px-4 py-2 text-sm font-semibold text-amber-100 hover:border-gold">
            تواصل عبر واتساب
          </a>
        </div>
      </div>
    </div>
  </article>
</template>
