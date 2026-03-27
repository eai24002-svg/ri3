<script setup lang="ts">
import type { Seat } from '~/types'

defineProps<{
  seats: Seat[]
}>()
</script>

<template>
  <div class="grid grid-cols-5 gap-2">
    <div
      v-for="seat in seats"
      :key="seat.id"
      class="flex h-8 items-center justify-center rounded-md text-xs font-medium"
      :class="seat.is_booked ? 'bg-red-700/80 text-white' : 'bg-emerald-600/80 text-white'"
    >
      {{ seat.seat_number }}
    </div>
  </div>
</template>
