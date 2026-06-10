<script setup>
import Header from '@/components/Header.vue';
import { ArrowLeftIcon, TrendingUpIcon, StarIcon, ZapIcon, ShieldIcon, SwordsIcon, TrophyIcon, FlameIcon, Star } from '@lucide/vue';

const timelineEvents = [
  {
    date: 'HOJE',
    description: 'Subiu para o Nível 12',
    xp: '+ XP',
  },
  {
    date: '15/05/2026',
    description: 'Participou do Evento 1',
    xp: '+150 XP',
  },
  {
    date: '19/05/2026',
    description: 'Desbloqueou Conquista: Invicto',
    xp: '+300 XP',
  },
  {
    date: '18/05/2026',
    description: 'Subiu de Nivel',
    xp: '+120 XP',
  },
  {
    date: '17/05/2026',
    description: 'Participou do Torneio 1',
    xp: '+200 XP',
  },
  {
    date: '15/05/2026',
    description: 'Entrou na Comunidade 1',
    xp: '+150 XP',
  }
];

const groupedEvents = timelineEvents.reduce((acc, event) => {
  if (!acc[event.date]) acc[event.date] = [];
  acc[event.date].push(event);
  return acc;
}, {});
</script>

<template>
  <main class="max-w-7xl w-full mx-auto min-h-screen h-full px-4 pb-5">
    <Header />
    <a href="/"
      class="w-max mt-5 flex items-center gap-1 text-sm hover:underline text-[#A0A0C0] hover:text-white transition-colors">
      <ArrowLeftIcon class="w-4 h-4" />
      Voltar
    </a>

    <section class="mt-6 p-4 border-2 border-[#16162A] bg-[#0F0F1E] rounded-lg shadow-lg5">
      <h3 class="text-md font-thin tracking-widest text-white">LINHA DO TEMPO</h3>
      <span class="block my-2 w-full h-px bg-[#16162A]"></span>

      <div class="mt-4 relative">
        <div class="absolute left-1.75 top-2 bottom-2 w-px bg-[#16162A]"></div>

        <div v-for="(events, date) in groupedEvents" :key="date" class="mb-6">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-3.5 h-3.5 rounded-full border-2 border-[#B06AFF] bg-[#0F0F1E] z-10 shrink-0"></div>
            <span class="text-xs font-semibold tracking-widest text-[#A0A0C0]">{{ date }}</span>
          </div>

          <div class="ml-7 flex flex-col gap-2">
            <div v-for="(event, i) in events" :key="i"
              class="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border border-[#16162A] cursor-pointer hover:translate-x-1 transition-all">
              <div class="flex items-center gap-2.5 min-w-0 text-[#bbbbd3]">
                <Star class="w-4 h-4 shrink-0" />
                <span class="text-xs truncate">{{ event.description }}</span>
              </div>
              <div class="flex items-center gap-3 shrink-0">
                <span class="text-[10px] text-[#505070]">{{ event.time }}</span>
                <span class="text-xs font-semibold">{{ event.xp }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>