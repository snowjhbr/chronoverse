<script setup>
import Header from '@/components/Header.vue';
import { ArrowLeftIcon, CheckIcon } from '@lucide/vue';

const events = [
  { name: 'Evento 1', xp: '+100 XP', color: '#5B9BFF' },
  { name: 'Evento 2', xp: '+100 XP', color: '#B06AFF' },
  { name: 'Evento 3', xp: '+100 XP', color: '#FF6B3D' },
  { name: 'Evento 4', xp: '+150 XP', color: '#3DFFB4' },
];
</script>

<template>
  <main class="max-w-7xl w-full mx-auto min-h-screen h-full px-4 pb-5">
    <Header />
    <a href="/"
      class="w-max mt-5 flex items-center gap-1 text-sm hover:underline text-[#A0A0C0] hover:text-white transition-colors">
      <ArrowLeftIcon class="w-4 h-4" />
      Voltar
    </a>

    <section class="mt-6 p-4 border-2 border-[#16162A] bg-[#0F0F1E] rounded-lg shadow-lg">
      <h3 class="text-md font-thin tracking-widest text-white">EVENTOS</h3>
      <span class="block my-2 w-full h-px bg-[#16162A]"></span>

      <div class="text-xs mt-5 flex flex-col gap-2">
        <div
          v-for="(event, i) in events"
          :key="i"
          class="flex items-center justify-between px-3 py-2 rounded-lg bg-[#151528] cursor-pointer hover:translate-x-1 transition-all"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg" :style="{ backgroundColor: event.color }">
              <CheckIcon class="w-4 h-4" />
            </div>
            <h3 class="text-md font-medium text-white">{{ event.name }}</h3>
            <span class="bg-[#1a1a30] px-2 py-1 rounded-full text-[#A0A0C0]">Participou</span>
          </div>
          <div class="text-[#3DFFB4]">
            {{ event.xp }}
          </div>
        </div>
      </div>
    </section>
  </main>
</template>