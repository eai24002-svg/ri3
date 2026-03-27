<script setup lang="ts">
import type { Movie, Settings } from '~/types'

const [{ data: moviesData, status, error }, { data: settingsData }] = await Promise.all([
  useAsyncData('public-movies', () => $fetch<{ data: Movie[] }>('/api/public/movies')),
  useAsyncData('public-settings-cinema', () => $fetch<{ data: Settings | null }>('/api/public/settings'))
])
</script>

<template>
  <section>
    <SectionTitle
      title="برنامج السينما"
      subtitle="تصفح قائمة الأفلام ومواعيد العرض مع تصور بصري مباشر للمقاعد."
    />

    <div v-if="status === 'pending'" class="panel p-6 text-zinc-300">جاري تحميل الأفلام...</div>
    <div v-else-if="error" class="panel p-6 text-red-300">تعذر تحميل بيانات السينما. حاول مرة أخرى.</div>
    <div v-else-if="!moviesData?.data.length" class="panel p-6 text-zinc-300">لا توجد أفلام متاحة حالياً.</div>

    <div v-else class="space-y-5">
      <MovieCard
        v-for="movie in moviesData.data"
        :key="movie.id"
        :movie="movie"
        :settings="settingsData?.data || null"
      />
    </div>
  </section>
</template>
