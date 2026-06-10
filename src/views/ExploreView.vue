<script setup>
import { ref } from 'vue'
import Header from '@/components/Header.vue'
import { ArrowLeftIcon, CheckIcon, LinkIcon, ShieldCheckIcon } from '@lucide/vue'
import { PLATAFORMAS } from '@/lib/plataformas'
import { importarEventosDePlataforma } from '@/lib/iterop-api'
import { useAvatarStore } from '@/stores/avatar'

const store = useAvatarStore()
const estadoPlataforma    = ref({})
const progressoImportacao = ref({})
const xpImportado         = ref({})

async function conectar(plataforma) {
  if (store.estaConectada(plataforma.id)) return

  estadoPlataforma.value[plataforma.id] = 'conectando'
  await new Promise(r => setTimeout(r, 1500))

  estadoPlataforma.value[plataforma.id] = 'importando'
  progressoImportacao.value[plataforma.id] = 0
  xpImportado.value[plataforma.id] = 0

  const total = plataforma.eventos.length
  let xpTotal = 0

  for (let i = 0; i < plataforma.eventos.length; i++) {
    const result = await importarEventosDePlataforma({ id: plataforma.id, eventos: [plataforma.eventos[i]] })
    xpTotal += result[0]?.xp_gerado || 0
    progressoImportacao.value[plataforma.id] = Math.round(((i + 1) / total) * 100)
    xpImportado.value[plataforma.id] = xpTotal
  }

  store.conectarPlataforma(plataforma.id)
  estadoPlataforma.value[plataforma.id] = 'concluido'
  await store.carregar()
}

function desconectar(plataforma) {
  store.desconectarPlataforma(plataforma.id)
  estadoPlataforma.value[plataforma.id] = ''
}

function getEstado(id) {
  return estadoPlataforma.value[id] || ''
}
</script>

<template>
  <main class="max-w-7xl w-full mx-auto min-h-screen h-full px-4 pb-10">
    <Header />
    <a href="/" class="w-max mt-5 flex items-center gap-1 text-sm hover:underline text-[#A0A0C0] hover:text-white transition-colors">
      <ArrowLeftIcon class="w-4 h-4" /> Voltar
    </a>

    <section class="mt-6">
      <div class="mb-6">
        <h2 class="text-xl font-thin tracking-widest">CONEXÕES & INTEGRAÇÕES</h2>
        <p class="text-[#A0A0C0] text-xs mt-1">
          Conecte suas plataformas para importar experiências reais automaticamente.
          Eventos importados recebem o selo <span class="text-[#3DFFB4]">✓ verificado</span>
          e geram <span class="text-[#FFB347]">⬡ moedas</span>.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div
          v-for="plataforma in PLATAFORMAS"
          :key="plataforma.id"
          class="border-2 border-[#16162A] bg-[#0F0F1E] rounded-lg p-4 transition-all"
          :class="{ 'border-[#3DFFB4]/30': store.estaConectada(plataforma.id) }"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center p-1.5 overflow-hidden"
                :style="{ backgroundColor: plataforma.cor + '22', border: '1px solid ' + plataforma.cor + '44' }">
                <img :src="plataforma.logo" :alt="plataforma.nome" class="w-full h-full object-contain rounded" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-sm font-medium">{{ plataforma.nome }}</h3>
                  <span v-if="store.estaConectada(plataforma.id)"
                    class="flex items-center gap-1 text-[10px] text-[#3DFFB4] bg-[#3DFFB4]/10 px-2 py-0.5 rounded-full">
                    <CheckIcon class="w-2.5 h-2.5" /> conectado
                  </span>
                </div>
                <p class="text-[10px] text-[#505070]">{{ plataforma.descricao }}</p>
              </div>
            </div>
          </div>

          <!-- Eventos que serão importados -->
          <div class="mb-3 flex flex-col gap-1">
            <div v-for="(evento, i) in plataforma.eventos" :key="i"
              class="flex items-center gap-2 text-[10px] text-[#505070]">
              <ShieldCheckIcon class="w-3 h-3 shrink-0"
                :class="store.estaConectada(plataforma.id) ? 'text-[#3DFFB4]' : 'text-[#2a2a4a]'" />
              <span>{{ evento.titulo }}</span>
            </div>
          </div>

          <!-- Barra de progresso -->
          <div v-if="getEstado(plataforma.id) === 'importando'" class="mb-3">
            <div class="flex justify-between text-[10px] text-[#A0A0C0] mb-1">
              <span>Importando eventos...</span>
              <span class="text-[#3DFFB4]">+{{ xpImportado[plataforma.id] ?? 0 }} XP</span>
            </div>
            <div class="w-full h-1.5 bg-[#1a1a30] rounded-full overflow-hidden">
              <div class="h-full bg-[#3DFFB4] rounded-full transition-all duration-300"
                :style="{ width: (progressoImportacao[plataforma.id] ?? 0) + '%' }"></div>
            </div>
          </div>

          <!-- Resultado -->
          <div v-if="getEstado(plataforma.id) === 'concluido'" class="mb-3 text-[10px] text-[#3DFFB4] flex items-center gap-3">
            <span>✓ {{ plataforma.eventos.length }} eventos importados · +{{ xpImportado[plataforma.id] ?? 0 }} XP</span>
            <span class="text-[#FFB347]">+{{ Math.floor((xpImportado[plataforma.id] ?? 0) / 10) }} ⬡</span>
          </div>

          <!-- Botão -->
          <button
            @click="store.estaConectada(plataforma.id) ? desconectar(plataforma) : conectar(plataforma)"
            :disabled="getEstado(plataforma.id) === 'conectando' || getEstado(plataforma.id) === 'importando'"
            class="w-full py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="{
              'bg-[#1a1a30] text-[#A0A0C0] hover:bg-[#252540]': !store.estaConectada(plataforma.id) && getEstado(plataforma.id) === '',
              'bg-[#252540] text-[#A0A0C0]': getEstado(plataforma.id) === 'conectando' || getEstado(plataforma.id) === 'importando',
              'bg-[#3DFFB4]/10 text-[#3DFFB4] hover:bg-red-900/20 hover:text-red-400': store.estaConectada(plataforma.id)
            }"
          >
            <span v-if="getEstado(plataforma.id) === 'conectando'"><span class="animate-pulse">Autenticando...</span></span>
            <span v-else-if="getEstado(plataforma.id) === 'importando'">Importando dados...</span>
            <span v-else-if="store.estaConectada(plataforma.id)">✓ Conectado — clique para desconectar</span>
            <span v-else class="flex items-center gap-1"><LinkIcon class="w-3 h-3" /> Conectar {{ plataforma.nome }}</span>
          </button>
        </div>
      </div>
    </section>
  </main>
</template>
