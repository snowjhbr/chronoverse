<script setup>
import { PlusIcon } from '@lucide/vue'

const destinos = [
  { id: 1, nome: 'Destino 1', tipo: 'Comunidade', imagem: '/communities/comunidade_1.png' },
  { id: 2, nome: 'Destino 2', tipo: 'Comunidade', imagem: '/communities/comunidade_2.png' },
  { id: 3, nome: 'Destino 3', tipo: 'Comunidade', imagem: '/communities/comunidade_3.png' },
]
</script>

<template>
  <div class="border-2 border-[#16162A] bg-[#0F0F1E] rounded-lg p-2.5 shadow-lg mb-5">
    <h3 class="text-md font-thin">DESTINOS & COMUNIDADES</h3>
    <span class="block my-2 w-full h-px bg-[#16162A]"></span>

    <div class="grid grid-cols-4 gap-2">
      <div
        v-for="destino in destinos"
        :key="destino.id"
        class="flex flex-col items-center min-w-0 hover:scale-95 transition-all cursor-pointer"
      >
        <div class="community-frame">
          <img
            :src="destino.imagem"
            :alt="destino.nome"
            class="w-full h-full rounded-full object-cover"
          >
        </div>
        <h4 class="text-sm mt-1 text-[#A0A0C0] truncate max-w-full">{{ destino.nome }}</h4>
        <p class="text-xs text-[#8080a8] truncate max-w-full">{{ destino.tipo }}</p>
      </div>

      <a href="/explore" class="flex flex-col items-center cursor-pointer hover:scale-95 transition-all">
        <div class="community-frame bg-[#2A2A4A] flex justify-center items-center">
          <PlusIcon class="text-[#A0A0C0] w-8 h-8" />
        </div>
        <h4 class="text-xs mt-1 text-[#A0A0C0]">EXPLORAR</h4>
      </a>
    </div>
  </div>
</template>

<style scoped>
.community-frame {
  width: clamp(3.75rem, 21vw, 5rem);
  height: clamp(3.75rem, 21vw, 5rem);
  overflow: hidden;
  border-radius: 9999px;
  border: 2px solid #B06AFF;
  background: #2A2A4A;
  box-shadow: 0 0 18px rgba(176, 106, 255, 0.18);
}
</style>
