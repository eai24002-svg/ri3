<script setup lang="ts">
import type { EventItem, Settings } from '~/types'

defineProps<{
  eventItem: EventItem
  settings: Settings | null
}>()

const { whatsappHref } = useContactActions()

const prettyType = (type: string) => {
  if (type === 'drawing') return 'رسم'
  if (type === 'workshop') return 'ورشة'
  if (type === 'seminar') return 'ندوة'
  return 'لاونج'
}
</script>

<template>
  <article class="panel overflow-hidden transition-all duration-300 hover:-translate-y-0.5">
    <img :src="eventItem.image_url" :alt="eventItem.title" class="h-48 w-full object-cover">

    <div class="space-y-3 p-4">
      <div class="flex items-center justify-between gap-2">
        <h3 class="text-lg font-semibold text-amber-100">{{ eventItem.title }}</h3>
        <span class="rounded-full bg-burgundy/70 px-2 py-1 text-xs">{{ prettyType(eventItem.event_type) }}</span>
      </div>

      <p class="text-sm text-zinc-300">{{ eventItem.description }}</p>

      <div class="space-y-1 text-sm text-zinc-400">
        <p>{{ eventItem.event_date }} - {{ eventItem.event_time }}</p>
        <p>السعة: {{ eventItem.capacity }} | المقاعد المتاحة: {{ eventItem.available_seats }}</p>
      </div>

      <a :href="whatsappHref(settings?.whatsapp_number, `مرحباً، أرغب بالحجز في فعالية ${eventItem.title}.`)" target="_blank" class="inline-flex rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300">
        تواصل للحجز
      </a>
    </div>
  </article>
</template>
