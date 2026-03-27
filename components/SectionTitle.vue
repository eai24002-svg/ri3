<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="mb-6">
    <h2 class="text-2xl font-semibold tracking-wide text-amber-100 sm:text-3xl">
      {{ title }}
    </h2>
    <p v-if="subtitle" class="mt-2 max-w-3xl text-zinc-300">
      {{ subtitle }}
    </p>
  </div>
</template>
