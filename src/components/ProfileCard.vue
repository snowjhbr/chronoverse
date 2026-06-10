<script setup>
import { CopyIcon } from '@lucide/vue';

</script>

<template>
  <div class="border-2 border-[#16162A] bg-[#0F0F1E] rounded-lg p-2.5 shadow-lg mb-5">
    <h3 class="text-md font-thin">IDENTIDADE</h3>
    <span class="block my-2 w-full h-px bg-[#16162A]"></span>
    <div class="flex gap-5 mt-5">
      <img class="rounded-lg w-40 h-40"
        src="../assets/profile.png" alt="">
      <div>

        <div class="flex items-center gap-3 text-xs text-[#A0A0C0]">
          ID:
          <div class="cursor-pointer flex items-center gap-1 p-1 bg-[#1a1a30] rounded-lg">
            <span>X0d12Des...</span>
            <CopyIcon class="w-3.5 h-3.5" />
          </div>
        </div>

        <div class="mt-3">
          <span class="text-[#A0A0C0] block text-xs">NOME</span>
          <span class="text-xs font-medium">USUARIO 123</span>
        </div>

        <div class="mt-2">
          <span class="text-[#A0A0C0] block text-xs">MEMBRO DESDE</span>
          <span class="text-xs font-medium">01/01/2025</span>
        </div>

      </div>
    </div>
    <p class="text-xs text-[#A0A0C0] mt-3">Seu avatar. Sua história. Seu mundo. Sua realidade.</p>
  </div>
</template>
