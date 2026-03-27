<script setup lang="ts">
import type { EventItem, Settings } from '~/types'

const [{ data: eventsData, status, error }, { data: settingsData }] = await Promise.all([
  useAsyncData('public-events', () => $fetch<{ data: EventItem[] }>('/api/public/events')),
  useAsyncData('public-settings-events', () => $fetch<{ data: Settings | null }>('/api/public/settings'))
])
</script>

<template>
  <section>
    <SectionTitle
      title="غرفة الفن والفعاليات"
      subtitle="انضم إلى جلسات الرسم، ورش العمل، الندوات، وأمسيات اللاونج المختارة."
    />

    <div v-if="status === 'pending'" class="panel p-6 text-zinc-300">جاري تحميل الفعاليات...</div>
    <div v-else-if="error" class="panel p-6 text-red-300">تعذر تحميل الفعاليات حالياً.</div>
    <div v-else-if="!eventsData?.data.length" class="panel p-6 text-zinc-300">لا توجد فعاليات متاحة الآن.</div>

    <div v-else class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <EventCard
        v-for="eventItem in eventsData.data"
        :key="eventItem.id"
        :event-item="eventItem"
        :settings="settingsData?.data || null"
      />
    </div>
  </section>
</template>
