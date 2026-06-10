<script setup>
import { ArrowRightLeft, Database, Gamepad2, ShieldCheck } from '@lucide/vue';


</script>

<template>
  <div class="text-[#D4D4F0] border-2 border-[#16162A] bg-[#0F0F1E] rounded-lg p-2.5 shadow-lg mb-5">
    <h3 class="text-sm font-thin">SUA IDENTIDADE. SEUS DADOS. SUAS REGRAS.</h3>

    <div class="grid grid-cols-4 gap-3">
      <div class="flex flex-col items-center gap-2">
        <Database class="w-6 h-6 mx-auto mt-3" />
        <h4 class="text-[8px] text-center">DADOS DESCENTRALIZADOS</h4>
      </div>

      <div class="flex flex-col items-center gap-2">
        <ArrowRightLeft class="w-6 h-6 mx-auto mt-3" />
        <h4 class="text-[8px] text-center">PORTABILIDADE TOTAL</h4>
      </div>

      <div class="flex flex-col items-center gap-2">
        <ShieldCheck class="w-6 h-6 mx-auto mt-3" />
        <h4 class="text-[8px] text-center">PRIVACIDADE POR PADRÃO</h4>
      </div>

      <div class="flex flex-col items-center gap-2">
        <Gamepad2 class="w-6 h-6 mx-auto mt-3" />
        <h4 class="text-[8px] text-center">VOCÊ NO CONTROLE DE TUDO</h4>
      </div>
    </div>
  </div>
</template>
