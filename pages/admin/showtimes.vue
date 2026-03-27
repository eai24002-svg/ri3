<script setup lang="ts">
import type { Movie, Seat } from '~/types'

definePageMeta({ layout: 'admin' })

const { adminFetch } = useAdminAccess()

type ShowtimeRow = {
  id: number
  movie_id: number
  movie_title: string
  show_date: string
  show_time: string
  total_seats: number
  status: 'available' | 'limited' | 'full' | 'closed'
  seats: Seat[]
}

const [{ data: moviesData }, { data: showtimesData, refresh }] = await Promise.all([
  useAsyncData('admin-showtime-movies', () => adminFetch<{ data: Movie[] }>('/api/admin/movies')),
  useAsyncData('admin-showtimes', () => adminFetch<{ data: ShowtimeRow[] }>('/api/admin/showtimes'))
])

const form = reactive({
  movie_id: 0,
  show_date: '',
  show_time: '',
  total_seats: 10,
  status: 'available'
})

const seatDrafts = ref<Record<number, Seat[]>>({})
const savingSeats = ref<Record<number, boolean>>({})
const saveMessage = ref<Record<number, string>>({})

watchEffect(() => {
  if (!showtimesData.value?.data) {
    return
  }

  const nextDrafts: Record<number, Seat[]> = {}

  for (const show of showtimesData.value.data) {
    nextDrafts[show.id] = show.seats.map((seat) => ({ ...seat }))
  }

  seatDrafts.value = nextDrafts
})

const createShowtime = async () => {
  await adminFetch('/api/admin/showtimes', { method: 'POST', body: form })
  await refresh()
}

const removeShowtime = async (id: number) => {
  await adminFetch(`/api/admin/showtimes/${id}`, { method: 'DELETE' })
  await refresh()
}

const markFull = async (show: ShowtimeRow) => {
  await adminFetch(`/api/admin/showtimes/${show.id}`, {
    method: 'PUT',
    body: { ...show, status: 'full', total_seats: 10 }
  })
  await refresh()
}

const toggleSeat = (showId: number, seatNumber: number) => {
  const seats = seatDrafts.value[showId]
  if (!seats) return

  const seat = seats.find((item) => item.seat_number === seatNumber)
  if (!seat) return

  seat.is_booked = seat.is_booked === 1 ? 0 : 1
}

const saveSeats = async (showId: number) => {
  savingSeats.value[showId] = true
  saveMessage.value[showId] = ''

  try {
    await adminFetch(`/api/admin/showtimes/${showId}/seats`, {
      method: 'PUT',
      body: {
        seats: (seatDrafts.value[showId] || []).map((seat) => ({
          seat_number: seat.seat_number,
          is_booked: seat.is_booked
        }))
      }
    })
    await refresh()
    saveMessage.value[showId] = 'تم حفظ المقاعد'
  } finally {
    savingSeats.value[showId] = false
  }
}

const arabicStatus = (status: ShowtimeRow['status']) => {
  if (status === 'available') return 'متاح'
  if (status === 'limited') return 'محدود'
  if (status === 'full') return 'ممتلئ'
  return 'مغلق'
}
</script>

<template>
  <section class="space-y-6">
    <h1 class="text-2xl font-semibold text-amber-100">إدارة مواعيد العرض</h1>

    <form class="panel grid gap-3 p-4 md:grid-cols-2" @submit.prevent="createShowtime">
      <select v-model.number="form.movie_id" required class="rounded-lg bg-zinc-900 p-2">
        <option :value="0" disabled>اختر فيلمًا</option>
        <option v-for="movie in moviesData?.data" :key="movie.id" :value="movie.id">{{ movie.title }}</option>
      </select>
      <input v-model="form.show_date" type="date" required class="rounded-lg bg-zinc-900 p-2">
      <input v-model="form.show_time" type="time" required class="rounded-lg bg-zinc-900 p-2">
      <select v-model="form.status" class="rounded-lg bg-zinc-900 p-2">
        <option value="available">متاح</option>
        <option value="limited">محدود</option>
        <option value="full">ممتلئ</option>
        <option value="closed">مغلق</option>
      </select>
      <button class="rounded-lg bg-gold px-4 py-2 font-semibold text-black md:col-span-2">إضافة موعد عرض</button>
    </form>

    <div v-if="!showtimesData?.data.length" class="panel p-4">لا توجد مواعيد عرض بعد.</div>
    <div v-else class="space-y-3">
      <div v-for="show in showtimesData.data" :key="show.id" class="panel space-y-4 p-4">
        <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="font-semibold text-amber-100">{{ show.movie_title }}</p>
            <p class="text-sm text-zinc-400">{{ show.show_date }} {{ show.show_time }} - {{ arabicStatus(show.status) }}</p>
          </div>
          <div class="flex gap-2">
            <button class="rounded-lg border border-amber-500/50 px-3 py-1 text-sm" @click="markFull(show)">تعيين كممتلئ</button>
            <button class="rounded-lg border border-red-700 px-3 py-1 text-sm text-red-300" @click="removeShowtime(show.id)">حذف</button>
          </div>
        </div>

        <div>
          <p class="mb-3 text-sm font-semibold text-amber-100">إدارة المقاعد</p>
          <div class="grid grid-cols-5 gap-2">
            <button
              v-for="seat in seatDrafts[show.id] || []"
              :key="seat.id"
              type="button"
              class="flex h-10 items-center justify-center rounded-lg text-sm font-bold transition-all"
              :class="seat.is_booked === 1 ? 'bg-red-700/90 text-white' : 'bg-emerald-600/90 text-white'"
              @click="toggleSeat(show.id, seat.seat_number)"
            >
              {{ seat.seat_number }}
            </button>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            class="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-black"
            :disabled="savingSeats[show.id]"
            @click="saveSeats(show.id)"
          >
            {{ savingSeats[show.id] ? 'جاري الحفظ...' : 'حفظ المقاعد' }}
          </button>
          <p v-if="saveMessage[show.id]" class="text-sm text-emerald-300">{{ saveMessage[show.id] }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
