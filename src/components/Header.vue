<script setup>
import { ref, onMounted } from 'vue'
import { CopyIcon } from '@lucide/vue'
import { buscarAvatar } from '@/lib/iterop-api'

const avatar = ref(null)
const copiado = ref(false)

onMounted(async () => {
  try {
    avatar.value = await buscarAvatar()
  } catch (e) {
    console.error('Erro ao buscar avatar no Header:', e)
  }
})

function copiarId() {
  if (!avatar.value?.id) return
  navigator.clipboard.writeText(avatar.value.id)
  copiado.value = true
  setTimeout(() => copiado.value = false, 2000)
}
</script>

<template>
  <header class="flex justify-between items-center pt-5 p-2.5">
    <div>
      <a href="/" class="text-2xl font-thin italic">CHRONOVERSE</a>
      <p class="text-[#A0A0C0] text-xs mt-1">Plataforma de Identidade e Progresso Interoperável</p>
    </div>

    <!-- NAVEGAÇÃO CENTRAL -->
    <nav class="flex items-center gap-1">
      <a href="/"
        class="px-3 py-1.5 rounded-lg text-xs text-[#A0A0C0] hover:text-white hover:bg-[#1a1a30] transition-all">
        Início
      </a>
      <a href="/skilltree"
        class="px-3 py-1.5 rounded-lg text-xs text-[#A0A0C0] hover:text-white hover:bg-[#1a1a30] transition-all flex items-center gap-1">
        ✦ Skills
      </a>
      <a href="/missoes"
        class="px-3 py-1.5 rounded-lg text-xs text-[#A0A0C0] hover:text-white hover:bg-[#1a1a30] transition-all flex items-center gap-1">
        📅 Missões
      </a>
      <a href="/events"
        class="px-3 py-1.5 rounded-lg text-xs text-[#A0A0C0] hover:text-white hover:bg-[#1a1a30] transition-all">
        Eventos
      </a>
      <a href="/timeline"
        class="px-3 py-1.5 rounded-lg text-xs text-[#A0A0C0] hover:text-white hover:bg-[#1a1a30] transition-all">
        Timeline
      </a>
      <a href="/inventario"
        class="px-3 py-1.5 rounded-lg text-xs text-[#A0A0C0] hover:text-white hover:bg-[#1a1a30] transition-all">
        Inventário
      </a>
      <a href="/explore"
        class="px-3 py-1.5 rounded-lg text-xs text-[#A0A0C0] hover:text-white hover:bg-[#1a1a30] transition-all">
        Conexões
      </a>
    </nav>

    <!-- USUÁRIO -->
    <div class="flex justify-between items-center gap-6 text-[#A0A0C0] text-xs">
      <span>CONECTADO COMO <span class="text-gray-300">{{ avatar?.nome ?? 'carregando...' }}</span></span>
      <span class="w-px h-8 bg-gray-800 block rounded"></span>
      <div @click="copiarId" class="cursor-pointer flex items-center gap-1">
        <span>{{ avatar?.id ? avatar.id.slice(0, 10) + '...' : 'X0d12Des...' }}</span>
        <CopyIcon class="w-3.5 h-3.5" />
      </div>
      <span v-if="copiado" class="text-[#3DFFB4]">copiado!</span>
    </div>
  </header>
</template>
