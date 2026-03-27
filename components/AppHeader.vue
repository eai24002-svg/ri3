<template>
  <header class="sticky top-0 z-30 border-b border-amber-400/15 bg-black/70 backdrop-blur-xl">
    <div class="container-premium flex h-20 items-center justify-between">
      <NuxtLink to="/" class="group relative flex items-center">
        <span class="flex flex-col leading-tight">
          <span class="brand-title text-lg font-extrabold tracking-[0.08em]">رويدة آرت</span>
          <span dir="ltr" class="text-[11px] tracking-[0.24em] text-amber-200/75 transition group-hover:text-amber-100">
            ROWAIDA ART
          </span>
        </span>
      </NuxtLink>

      <nav class="flex items-center gap-2 rounded-xl border border-amber-400/20 bg-zinc-950/70 p-1.5 text-sm text-zinc-300">
        <NuxtLink to="/" class="rounded-lg px-3 py-1.5 hover:bg-amber-500/10 hover:text-gold">الرئيسية</NuxtLink>
        <NuxtLink to="/cinema" class="rounded-lg px-3 py-1.5 hover:bg-amber-500/10 hover:text-gold">السينما</NuxtLink>
        <NuxtLink to="/events" class="rounded-lg px-3 py-1.5 hover:bg-amber-500/10 hover:text-gold">غرفة الفن والفعاليات</NuxtLink>
      </nav>
    </div>
  </header>
</template>
