<script setup>
import { CheckIcon } from '@lucide/vue';


</script>

<template>
  <div class="border-2 border-[#16162A] bg-[#0F0F1E] rounded-lg p-2.5 shadow-lg mb-5">
    <h3 class="text-md font-thin">EVENTOS</h3>
    <span class="block my-2 w-full h-px bg-[#16162A]"></span>

    <div class="text-xs mt-5">

      <div class="flex items-center justify-between px-3 py-2 rounded-lg bg-[#151528] mb-2 cursor-pointer hover:translate-x-1 transition-all">
        <div class="flex items-center gap-3">
          <div class="bg-[#5B9BFF] p-2 rounded-lg">
            <CheckIcon class="w-4 h-4" />
          </div>
          <h3 class="text-md font-medium">Evento 1</h3>
          <span class="bg-[#1a1a30] px-2 py-1 rounded-full">Participou</span>
        </div>
        <div class="text-[#3DFFB4]">+100 XP</div>
      </div>

      <div class="flex items-center justify-between px-3 py-2 rounded-lg bg-[#151528] mb-2 cursor-pointer hover:translate-x-1 transition-all">
        <div class="flex items-center gap-3">
          <div class="bg-[#B06AFF] p-2 rounded-lg">
            <CheckIcon class="w-4 h-4" />
          </div>
          <h3 class="text-md font-medium">Evento 2</h3>
          <span class="bg-[#1a1a30] px-2 py-1 rounded-full">Participou</span>
        </div>
        <div class="text-[#3DFFB4]">+100 XP</div>
      </div>

      <div class="flex items-center justify-between px-3 py-2 rounded-lg bg-[#151528] cursor-pointer hover:translate-x-1 transition-all">
        <div class="flex items-center gap-3">
          <div class="bg-[#FF6B3D] p-2 rounded-lg">
            <CheckIcon class="w-4 h-4" />
          </div>
          <h3 class="text-md font-medium">Evento 3</h3>
          <span class="bg-[#1a1a30] px-2 py-1 rounded-full">Participou</span>
        </div>
        <div class="text-[#3DFFB4]">+100 XP</div>
      </div>

    </div>

    <a href="/events" class="block text-center mt-5 w-full py-1.5 transition-all border border-[#1a1a30] rounded-lg text-sm hover:bg-[#1a1a30]">Ver tudo</a>
  </div>
</template>
