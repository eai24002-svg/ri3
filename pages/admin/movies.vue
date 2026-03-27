<script setup lang="ts">
import type { Movie } from '~/types'

definePageMeta({ layout: 'admin' })

const { adminFetch } = useAdminAccess()

const { data, status, refresh } = await useAsyncData('admin-movies', () => adminFetch<{ data: Movie[] }>('/api/admin/movies'))

const initialForm = {
  title: '',
  description: '',
  duration_minutes: 100,
  classification: 'G',
  trailer_url: '',
  poster_url: '',
  is_active: 1
}

const form = reactive({ ...initialForm })
const editingId = ref<number | null>(null)
const submitting = ref(false)
const uploadingImage = ref(false)

const uploadPoster = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  uploadingImage.value = true

  try {
    const multipart = new FormData()
    multipart.append('file', file)
    multipart.append('folder', 'movies')

    const response = await adminFetch<{ data: { url: string } }>('/api/admin/upload', {
      method: 'POST',
      body: multipart
    })

    form.poster_url = response.data.url
  } finally {
    uploadingImage.value = false
    input.value = ''
  }
}

const editMovie = (movie: Movie) => {
  editingId.value = movie.id
  Object.assign(form, movie)
}

const resetForm = () => {
  editingId.value = null
  Object.assign(form, initialForm)
}

const submitForm = async () => {
  submitting.value = true
  try {
    if (editingId.value) {
      await adminFetch(`/api/admin/movies/${editingId.value}`, { method: 'PUT', body: form })
    } else {
      await adminFetch('/api/admin/movies', { method: 'POST', body: form })
    }
    await refresh()
    resetForm()
  } finally {
    submitting.value = false
  }
}

const deleteMovie = async (id: number) => {
  await adminFetch(`/api/admin/movies/${id}`, { method: 'DELETE' })
  await refresh()
}
</script>

<template>
  <section class="space-y-6">
    <h1 class="text-2xl font-semibold text-amber-100">إدارة الأفلام</h1>

    <form class="panel grid gap-3 p-4 md:grid-cols-2" @submit.prevent="submitForm">
      <input v-model="form.title" class="rounded-lg bg-zinc-900 p-2" placeholder="عنوان الفيلم" required>
      <input v-model.number="form.duration_minutes" type="number" class="rounded-lg bg-zinc-900 p-2" placeholder="المدة بالدقائق">
      <textarea v-model="form.description" class="rounded-lg bg-zinc-900 p-2 md:col-span-2" rows="3" placeholder="وصف الفيلم" />
      <input v-model="form.trailer_url" class="rounded-lg bg-zinc-900 p-2" placeholder="رابط الإعلان">
      <div class="space-y-2">
        <input type="file" accept="image/png,image/jpeg,image/webp" class="w-full rounded-lg bg-zinc-900 p-2" @change="uploadPoster">
        <p class="text-xs text-zinc-500">{{ uploadingImage ? 'جاري رفع الصورة...' : 'ارفع ملصق الفيلم من جهازك' }}</p>
      </div>
      <select v-model="form.classification" class="rounded-lg bg-zinc-900 p-2">
        <option>G</option>
        <option>+13</option>
        <option>+16</option>
        <option>+18</option>
      </select>
      <select v-model.number="form.is_active" class="rounded-lg bg-zinc-900 p-2">
        <option :value="1">نشط</option>
        <option :value="0">غير نشط</option>
      </select>
      <div v-if="form.poster_url" class="md:col-span-2">
        <img :src="form.poster_url" alt="Poster preview" class="h-40 w-28 rounded-lg object-cover">
      </div>
      <div class="md:col-span-2 flex gap-2">
        <button :disabled="submitting" class="rounded-lg bg-gold px-4 py-2 font-semibold text-black">
          {{ editingId ? 'تحديث' : 'إضافة' }} فيلم
        </button>
        <button type="button" class="rounded-lg border border-zinc-700 px-4 py-2" @click="resetForm">إعادة تعيين</button>
      </div>
    </form>

    <div v-if="status === 'pending'" class="panel p-4">جاري تحميل الأفلام...</div>
    <div v-else-if="!data?.data.length" class="panel p-4">لا توجد أفلام بعد.</div>
    <div v-else class="space-y-3">
      <div v-for="movie in data.data" :key="movie.id" class="panel flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="font-semibold text-amber-100">{{ movie.title }}</p>
          <p class="text-sm text-zinc-400">{{ movie.duration_minutes }} دقيقة - {{ movie.classification }}</p>
        </div>
        <div class="flex gap-2">
          <button class="rounded-lg border border-zinc-700 px-3 py-1 text-sm" @click="editMovie(movie)">تعديل</button>
          <button class="rounded-lg border border-red-700 px-3 py-1 text-sm text-red-300" @click="deleteMovie(movie.id)">حذف</button>
        </div>
      </div>
    </div>
  </section>
</template>
