<script setup>
import { ref, computed } from 'vue'
import Header from '@/components/Header.vue'
import { ArrowLeftIcon, CheckIcon, LinkIcon, ShieldCheckIcon, ZapIcon } from '@lucide/vue'
import { PLATAFORMAS } from '@/lib/plataformas'
import { importarEventosDePlataforma } from '@/lib/iterop-api'
import { useAvatarStore } from '@/stores/avatar'

const store = useAvatarStore()
const estadoPlataforma    = ref({})
const progressoImportacao = ref({})
const xpImportado         = ref({})
const eventosImportados   = ref({}) // guarda detalhes dos eventos importados por plataforma

// mapa de habilidades afetadas por tipo de evento (resumo visual)
const habilidadesPorTipo = {
  certificado:           ['inteligencia', 'reputacao', 'disciplina'],
  emprego_novo:          ['reputacao', 'disciplina', 'sabedoria'],
  curso_online:          ['inteligencia', 'foco', 'disciplina'],
  video_publicado:       ['reputacao', 'criatividade', 'carisma'],
  conquista_seguidores:  ['reputacao', 'carisma'],
  post_publicado:        ['reputacao', 'carisma', 'criatividade'],
  programacao_pessoal:   ['inteligencia', 'criatividade', 'foco'],
  projeto_entregue:      ['disciplina', 'inteligencia', 'reputacao'],
  corrida:               ['resistencia', 'disciplina', 'foco'],
  ciclismo:              ['resistencia', 'disciplina'],
  meta_batida:           ['disciplina', 'sabedoria', 'foco'],
  habito_30dias:         ['disciplina', 'foco', 'sabedoria'],
  prova_aprovado:        ['inteligencia', 'disciplina', 'foco'],
  trabalho_entregue:     ['disciplina', 'inteligencia', 'foco'],
  apresentacao:          ['carisma', 'inteligencia', 'foco'],
  evento:                ['carisma', 'sabedoria'],
  palestra:              ['inteligencia', 'carisma', 'sabedoria'],
  evento_cultural:       ['sabedoria', 'criatividade', 'carisma'],
  conquista:             ['reputacao', 'disciplina'],
  workshop:              ['inteligencia', 'criatividade', 'foco'],
}

function getHabilidades(tipo) {
  return habilidadesPorTipo[tipo] ?? ['sabedoria']
}

const coresHab = {
  inteligencia: '#38BDF8',
  resistencia:  '#34D399',
  carisma:      '#F472B6',
  foco:         '#A78BFA',
  criatividade: '#FBBF24',
  sabedoria:    '#818CF8',
  reputacao:    '#FB923C',
  disciplina:   '#6EE7B7',
}

async function conectar(plataforma) {
  if (store.estaConectada(plataforma.id)) return

  estadoPlataforma.value[plataforma.id] = 'conectando'
  eventosImportados.value[plataforma.id] = []
  await new Promise(r => setTimeout(r, 1500))

  estadoPlataforma.value[plataforma.id] = 'importando'
  progressoImportacao.value[plataforma.id] = 0
  xpImportado.value[plataforma.id] = 0

  const total = plataforma.eventos.length
  let xpTotal = 0

  for (let i = 0; i < plataforma.eventos.length; i++) {
    const ev = plataforma.eventos[i]
    const result = await importarEventosDePlataforma({ id: plataforma.id, eventos: [ev] })
    const xpGanho = result[0]?.xp_gerado || 0
    xpTotal += xpGanho
    progressoImportacao.value[plataforma.id] = Math.round(((i + 1) / total) * 100)
    xpImportado.value[plataforma.id] = xpTotal

    // armazena evento com detalhes
    eventosImportados.value[plataforma.id].push({
      titulo: ev.titulo,
      tipo: ev.tipo,
      xp: xpGanho,
      habilidades: getHabilidades(ev.tipo),
    })
  }

  store.conectarPlataforma(plataforma.id)
  estadoPlataforma.value[plataforma.id] = 'concluido'
  await store.carregar()
}

function desconectar(plataforma) {
  store.desconectarPlataforma(plataforma.id)
  estadoPlataforma.value[plataforma.id] = ''
  eventosImportados.value[plataforma.id] = []
}

function getEstado(id) {
  return estadoPlataforma.value[id] || ''
}
</script>

<template>
  <main class="max-w-7xl w-full mx-auto min-h-screen h-full px-4 pb-10">
    <Header />
    <RouterLink to="/" class="w-max mt-5 flex items-center gap-1 text-sm hover:underline text-[#A0A0C0] hover:text-white transition-colors">
      <ArrowLeftIcon class="w-4 h-4" /> Voltar
    </RouterLink>

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
          class="border border-[#16162A] bg-[#0A0A1E] rounded-xl p-4 transition-all relative overflow-hidden"
          :class="{ 'border-[#3DFFB4]/25 shadow-[0_0_20px_rgba(61,255,180,0.05)]': store.estaConectada(plataforma.id) }"
        >
          <!-- linha de scan ao conectar -->
          <div v-if="getEstado(plataforma.id) === 'importando'" class="scan-bar"></div>

          <!-- HEADER DA PLATAFORMA -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-lg flex items-center justify-center p-1.5 overflow-hidden shrink-0"
                :style="{ backgroundColor: plataforma.cor + '18', border: '1px solid ' + plataforma.cor + '44' }">
                <img v-if="plataforma.logo" :src="plataforma.logo" :alt="plataforma.nome" class="w-full h-full object-contain rounded" />
                <span v-else class="text-xl">{{ plataforma.emoji }}</span>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-sm font-semibold">{{ plataforma.nome }}</h3>
                  <span v-if="store.estaConectada(plataforma.id)"
                    class="flex items-center gap-1 text-[10px] text-[#3DFFB4] bg-[#3DFFB4]/10 px-2 py-0.5 rounded-full border border-[#3DFFB4]/20">
                    <CheckIcon class="w-2.5 h-2.5" /> conectado
                  </span>
                </div>
                <p class="text-[10px] text-[#505070]">{{ plataforma.descricao }}</p>
              </div>
            </div>
          </div>

          <!-- BARRA DE PROGRESSO (importando) -->
          <div v-if="getEstado(plataforma.id) === 'importando'" class="mb-3">
            <div class="flex justify-between text-[10px] text-[#A0A0C0] mb-1">
              <span class="animate-pulse">Sincronizando dados...</span>
              <span class="text-[#3DFFB4] font-bold">+{{ xpImportado[plataforma.id] ?? 0 }} XP</span>
            </div>
            <div class="w-full h-1.5 bg-[#1a1a30] rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all duration-300"
                :style="{ width: (progressoImportacao[plataforma.id] ?? 0) + '%', background: 'linear-gradient(90deg,' + plataforma.cor + ',' + plataforma.cor + 'aa)' }">
              </div>
            </div>
          </div>

          <!-- EVENTOS IMPORTADOS COM DETALHES (após conectar) -->
          <div v-if="store.estaConectada(plataforma.id) && eventosImportados[plataforma.id]?.length" class="mb-3 flex flex-col gap-2">
            <div v-for="(ev, i) in eventosImportados[plataforma.id]" :key="i"
              class="rounded-lg p-2.5 border border-[#16162A] bg-[#0F0F1E]">
              <div class="flex items-start justify-between gap-2 mb-1.5">
                <div class="flex items-center gap-2 min-w-0">
                  <ShieldCheckIcon class="w-3 h-3 shrink-0 text-[#3DFFB4]" />
                  <span class="text-[11px] text-[#DDD8FF] font-medium truncate">{{ ev.titulo }}</span>
                </div>
                <div class="flex items-center gap-1 shrink-0">
                  <ZapIcon class="w-3 h-3 text-[#A78BFA]" />
                  <span class="text-[11px] font-bold text-[#A78BFA]">+{{ ev.xp }} XP</span>
                </div>
              </div>
              <!-- habilidades afetadas -->
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="text-[9px] text-[#505070]">Ganhou em:</span>
                <span
                  v-for="hab in ev.habilidades" :key="hab"
                  class="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                  :style="{ background: coresHab[hab] + '22', color: coresHab[hab], border: '1px solid ' + coresHab[hab] + '44' }"
                >
                  {{ hab }}
                </span>
                <span class="text-[9px] text-[#FFB347]">+{{ Math.floor(ev.xp / 10) }} ⬡</span>
              </div>
            </div>
          </div>

          <!-- LISTA SIMPLES (antes de conectar) -->
          <div v-else class="mb-3 flex flex-col gap-1">
            <div v-for="(evento, i) in plataforma.eventos" :key="i"
              class="flex items-center gap-2 text-[10px] text-[#505070]">
              <ShieldCheckIcon class="w-3 h-3 shrink-0 text-[#2a2a4a]" />
              <span>{{ evento.titulo }}</span>
            </div>
          </div>

          <!-- RESULTADO RESUMIDO -->
          <div v-if="getEstado(plataforma.id) === 'concluido'" class="mb-2 text-[10px] flex items-center gap-3 bg-[#3DFFB4]/05 border border-[#3DFFB4]/15 rounded-lg px-3 py-1.5">
            <span class="text-[#3DFFB4]">✓ {{ plataforma.eventos.length }} eventos importados</span>
            <span class="text-[#A78BFA]">+{{ xpImportado[plataforma.id] ?? 0 }} XP total</span>
            <span class="text-[#FFB347]">+{{ Math.floor((xpImportado[plataforma.id] ?? 0) / 10) }} ⬡</span>
          </div>

          <!-- BOTÃO -->
          <button
            @click="store.estaConectada(plataforma.id) ? desconectar(plataforma) : conectar(plataforma)"
            :disabled="getEstado(plataforma.id) === 'conectando' || getEstado(plataforma.id) === 'importando'"
            class="w-full py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="{
              'bg-[#1a1a30] text-[#A0A0C0] hover:bg-[#252540]': !store.estaConectada(plataforma.id) && getEstado(plataforma.id) === '',
              'bg-[#252540] text-[#A0A0C0]': getEstado(plataforma.id) === 'conectando' || getEstado(plataforma.id) === 'importando',
              'bg-[#3DFFB4]/08 text-[#3DFFB4] hover:bg-red-900/20 hover:text-red-400 border border-[#3DFFB4]/20': store.estaConectada(plataforma.id)
            }"
          >
            <span v-if="getEstado(plataforma.id) === 'conectando'">
              <span class="animate-pulse">🔐 Autenticando via OAuth...</span>
            </span>
            <span v-else-if="getEstado(plataforma.id) === 'importando'">
              ⟳ Importando dados...
            </span>
            <span v-else-if="store.estaConectada(plataforma.id)">
              ✓ Conectado — clique para desconectar
            </span>
            <span v-else class="flex items-center gap-1">
              <LinkIcon class="w-3 h-3" /> Conectar {{ plataforma.nome }}
            </span>
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.scan-bar {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #3DFFB4, transparent);
  animation: scan-move 1.5s ease-in-out infinite;
}
@keyframes scan-move {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>