<script setup lang="ts">
import type { Settings } from '~/types'

definePageMeta({ layout: 'admin' })

const { adminFetch } = useAdminAccess()

const { data, refresh } = await useAsyncData('admin-settings', () => adminFetch<{ data: Settings | null }>('/api/admin/settings'))

const form = reactive({
  phone_number: '',
  whatsapp_number: '',
  hero_badge: 'ROWAIDA ART EXPERIENCE',
  hero_title_line_1: 'مساحة فنية راقية',
  hero_title_line_2: 'تجمع السينما والفعاليات',
  hero_title_line_3: 'بطابع مختلف تمامًا',
  hero_description: 'رويدة آرت ليست مجرد موقع عروض، بل واجهة أنيقة لتجربة متكاملة تضم أفلامًا مختارة، ورشًا إبداعية، وفعاليات بهوية بصرية هادئة وفاخرة.'
})

const message = ref('')
const errorMessage = ref('')

watchEffect(() => {
  if (data.value?.data) {
    form.phone_number = data.value.data.phone_number
    form.whatsapp_number = data.value.data.whatsapp_number
    form.hero_badge = data.value.data.hero_badge
    form.hero_title_line_1 = data.value.data.hero_title_line_1
    form.hero_title_line_2 = data.value.data.hero_title_line_2
    form.hero_title_line_3 = data.value.data.hero_title_line_3
    form.hero_description = data.value.data.hero_description
  }
})

const saving = ref(false)
const save = async () => {
  saving.value = true
  message.value = ''
  errorMessage.value = ''
  try {
    await adminFetch('/api/admin/settings', { method: 'PUT', body: form })
    await refresh()
    await refreshNuxtData('home-settings')
    message.value = 'تم حفظ الإعدادات بنجاح.'
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'تعذر حفظ الإعدادات.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section class="space-y-6">
    <h1 class="text-2xl font-semibold text-amber-100">إعدادات التواصل والواجهة الرئيسية</h1>
    <form class="panel max-w-3xl space-y-4 p-4" @submit.prevent="save">
      <div class="grid gap-3 md:grid-cols-2">
        <input v-model="form.phone_number" class="w-full rounded-lg bg-zinc-900 p-2" placeholder="رقم الهاتف">
        <input v-model="form.whatsapp_number" class="w-full rounded-lg bg-zinc-900 p-2" placeholder="رقم واتساب">
      </div>

      <div class="grid gap-3">
        <input v-model="form.hero_badge" class="w-full rounded-lg bg-zinc-900 p-2" placeholder="النص الصغير أعلى العنوان">
        <input v-model="form.hero_title_line_1" class="w-full rounded-lg bg-zinc-900 p-2" placeholder="السطر الأول من العنوان">
        <input v-model="form.hero_title_line_2" class="w-full rounded-lg bg-zinc-900 p-2" placeholder="السطر الثاني من العنوان">
        <input v-model="form.hero_title_line_3" class="w-full rounded-lg bg-zinc-900 p-2" placeholder="السطر الثالث من العنوان">
        <textarea
          v-model="form.hero_description"
          class="min-h-32 w-full rounded-lg bg-zinc-900 p-2"
          placeholder="وصف الواجهة الرئيسية"
        />
      </div>

      <button :disabled="saving" class="rounded-lg bg-gold px-4 py-2 font-semibold text-black">
        {{ saving ? 'جاري الحفظ...' : 'حفظ الإعدادات' }}
      </button>
      <p v-if="message" class="text-sm text-emerald-300">{{ message }}</p>
      <p v-if="errorMessage" class="text-sm text-red-300">{{ errorMessage }}</p>
    </form>
  </section>
</template>
