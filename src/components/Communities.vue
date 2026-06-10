<script setup>
import { CheckIcon, PlusIcon } from '@lucide/vue';


</script>

<template>
  <div class="border-2 border-[#16162A] bg-[#0F0F1E] rounded-lg p-2.5 shadow-lg mb-5">
    <h3 class="text-md font-thin">DESTINOS & COMUNIDADES</h3>
    <span class="block my-2 w-full h-px bg-[#16162A]"></span>

    <div class="grid grid-cols-4 gap-2">
      <div class="flex flex-col items-center hover:scale-95 transition-all cursor-pointer">
        <div class="w-20 h-20 rounded-full bg-[#2A2A4A] animate-pulse border-2 border-[#B06AFF]"></div>
        <h4 class="text-sm mt-1 text-[#A0A0C0]">Destino 1</h4>
        <p class="text-xs text-[#8080a8]">Comunidade</p>
      </div>

      <div class="flex flex-col items-center hover:scale-95 transition-all cursor-pointer">
        <div class="w-20 h-20 rounded-full bg-[#2A2A4A] animate-pulse border-2 border-[#B06AFF]"></div>
        <h4 class="text-sm mt-1 text-[#A0A0C0]">Destino 2</h4>
        <p class="text-xs text-[#8080a8]">Comunidade</p>
      </div>

      <div class="flex flex-col items-center hover:scale-95 transition-all cursor-pointer">
        <div class="w-20 h-20 rounded-full bg-[#2A2A4A] animate-pulse border-2 border-[#B06AFF]"></div>
        <h4 class="text-sm mt-1 text-[#A0A0C0]">Destino 3</h4>
        <p class="text-xs text-[#8080a8]">Comunidade</p>
      </div>

      <a href="/explore" class="flex flex-col items-center cursor-pointer hover:scale-95 transition-all">
        <div class="w-20 h-20 rounded-full bg-[#2A2A4A] flex justify-center items-center">
          <PlusIcon class="text-[#A0A0C0] w-8 h-8" />
        </div>
        <h4 class="text-xs mt-1 text-[#A0A0C0]">EXPLORAR</h4>
      </a>
    </div>
  </div>
</template>
