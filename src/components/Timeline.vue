<script setup>

</script>

<template>
  <div class="border-2 border-[#16162A] bg-[#0F0F1E] rounded-lg p-2.5 shadow-lg mb-5">
    <h3 class="text-md font-thin">LINHA DO TEMPO</h3>
    <span class="block my-2 w-full h-px bg-[#16162A]"></span>

    <div class="text-xs mt-5 pb-5">
      <div class="flex items-center justify-between cursor-pointer hover:translate-x-1 transition-all">
        <div>HOJE</div>
        <div class="text-[#A0A0C0]">Subiu de nível</div>
        <div class="text-[#B06AFF]">+XP</div>
      </div>

      <span class="block my-4.5 w-full h-px bg-[#16162A]"></span>

      <div class="flex items-center justify-between cursor-pointer hover:translate-x-1 transition-all">
        <div>15/05/2026</div>
        <div class="text-[#A0A0C0]">Participou do Evento 1</div>
        <div class="text-[#B06AFF]">+150 XP</div>
      </div>
    </div>

    <a href="/timeline"
      class="block text-center mt-5 w-full py-1.5 border border-[#1a1a30] rounded-lg text-sm transition-all hover:bg-[#1a1a30]">Ver
      tudo</a>
  </div>
</template>
