<script setup>
import { ref, computed, onMounted } from 'vue'
import Header from '@/components/Header.vue'
import { ArrowLeftIcon, ShieldCheckIcon, ZapIcon, AlertCircleIcon } from '@lucide/vue'
import { buscarEventos } from '@/lib/iterop-api'
import { PLATAFORMAS } from '@/lib/plataformas'

const eventos     = ref([])
const carregando  = ref(true)
const filtroAtivo = ref('todos')

onMounted(async () => {
  eventos.value = await buscarEventos(50)
  carregando.value = false
})

const filtros = [
  { id: 'todos',       label: 'Todos' },
  { id: 'verificados', label: '✓ Verificados' },
  { id: 'manuais',     label: 'Manuais' },
]

const eventosFiltrados = computed(() => {
  if (filtroAtivo.value === 'verificados') return eventos.value.filter(e => e.verificado)
  if (filtroAtivo.value === 'manuais')     return eventos.value.filter(e => !e.verificado)
  return eventos.value
})

const totalVerificados = computed(() => eventos.value.filter(e => e.verificado).length)
const totalXP          = computed(() => eventos.value.reduce((s, e) => s + (e.xp_gerado ?? 0), 0))

function getPlataforma(fonte) {
  return PLATAFORMAS.find(p => p.id === fonte) ?? null
}

const coresHab = {
  inteligencia: '#38BDF8', resistencia: '#34D399',
  carisma: '#F472B6',      foco: '#A78BFA',
  criatividade: '#FBBF24', sabedoria: '#818CF8',
  reputacao: '#FB923C',    disciplina: '#6EE7B7',
}

const habilidadesPorTipo = {
  certificado: ['inteligencia','reputacao','disciplina'],
  emprego_novo: ['reputacao','disciplina','sabedoria'],
  curso_online: ['inteligencia','foco','disciplina'],
  video_publicado: ['reputacao','criatividade','carisma'],
  conquista_seguidores: ['reputacao','carisma'],
  post_publicado: ['reputacao','carisma','criatividade'],
  programacao_pessoal: ['inteligencia','criatividade','foco'],
  projeto_entregue: ['disciplina','inteligencia','reputacao'],
  corrida: ['resistencia','disciplina','foco'],
  ciclismo: ['resistencia','disciplina'],
  meta_batida: ['disciplina','sabedoria','foco'],
  habito_30dias: ['disciplina','foco','sabedoria'],
  prova_aprovado: ['inteligencia','disciplina','foco'],
  trabalho_entregue: ['disciplina','inteligencia','foco'],
  apresentacao: ['carisma','inteligencia','foco'],
  evento: ['carisma','sabedoria'],
  palestra: ['inteligencia','carisma','sabedoria'],
  evento_cultural: ['sabedoria','criatividade','carisma'],
  conquista: ['reputacao','disciplina'],
  workshop: ['inteligencia','criatividade','foco'],
  leitura: ['inteligencia','sabedoria','foco'],
  voluntariado: ['carisma','sabedoria','reputacao'],
  musculacao: ['resistencia','disciplina'],
  yoga: ['resistencia','foco','disciplina'],
  meditacao: ['foco','disciplina','sabedoria'],
  design: ['criatividade','inteligencia','foco'],
  musica: ['criatividade','foco','disciplina'],
  arte: ['criatividade','foco'],
  escrita: ['criatividade','inteligencia','foco'],
  viagem_nacional: ['sabedoria','carisma','criatividade'],
  viagem_internacional: ['sabedoria','carisma','inteligencia'],
  primeiro_lugar: ['reputacao','disciplina','foco'],
}

function getHabilidades(tipo) {
  return habilidadesPorTipo[tipo] ?? ['sabedoria']
}

function formatarData(data) {
  if (!data) return '—'
  const hoje = new Date().toISOString().slice(0, 10)
  if (data === hoje) return 'Hoje'
  return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR')
}

function formatarTipo(tipo) {
  return tipo?.replace(/_/g, ' ') ?? ''
}

const coresEvento = ['#A78BFA','#38BDF8','#F472B6','#34D399','#FBBF24','#FB923C']
function corIdx(i) { return coresEvento[i % coresEvento.length] }
</script>

<template>
  <main class="max-w-7xl w-full mx-auto min-h-screen h-full px-4 pb-10">
    <Header />

    <RouterLink to="/" class="w-max mt-5 flex items-center gap-1 text-sm text-[#A0A0C0] hover:text-white transition-colors">
      <ArrowLeftIcon class="w-4 h-4" /> Voltar
    </RouterLink>

    <!-- HEADER -->
    <div class="mt-6 mb-4 flex items-end justify-between flex-wrap gap-3">
      <div>
        <h2 class="text-xl font-thin tracking-widest">HISTÓRICO DE EVENTOS</h2>
        <p class="text-[#505070] text-xs mt-1">
          Apenas eventos verificados por plataformas oficiais geram atributos no avatar.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-1.5 bg-[rgba(61,255,180,0.08)] border border-[rgba(61,255,180,0.15)] rounded-lg px-3 py-1.5 text-xs">
          <ShieldCheckIcon class="w-3.5 h-3.5 text-[#3DFFB4]" />
          <span class="text-[#3DFFB4] font-bold">{{ totalVerificados }}</span>
          <span class="text-[#505070]">verificados</span>
        </div>
        <div class="flex items-center gap-1.5 bg-[rgba(167,139,250,0.08)] border border-[rgba(167,139,250,0.15)] rounded-lg px-3 py-1.5 text-xs">
          <ZapIcon class="w-3.5 h-3.5 text-[#A78BFA]" />
          <span class="text-[#A78BFA] font-bold">{{ totalXP.toLocaleString('pt-BR') }}</span>
          <span class="text-[#505070]">XP total</span>
        </div>
      </div>
    </div>

    <!-- AVISO -->
    <div class="flex items-start gap-3 bg-[rgba(61,255,180,0.04)] border border-[rgba(61,255,180,0.12)] rounded-xl px-4 py-3 mb-4">
      <ShieldCheckIcon class="w-4 h-4 text-[#3DFFB4] shrink-0 mt-0.5" />
      <p class="text-xs text-[#A0A0C0] leading-relaxed">
        <span class="text-[#3DFFB4] font-semibold">Eventos verificados</span>
        são importados diretamente de plataformas oficiais conectadas (LinkedIn, GitHub, Strava, etc.)
        e geram <span class="text-[#A78BFA]">XP</span>, <span class="text-[#FBBF24]">⬡ moedas</span> e atributos no avatar.
        <span class="text-[#FF6B6B]">Eventos manuais</span> registram sua trajetória mas
        <span class="text-[#FF6B6B] font-semibold">não geram moedas</span>.
      </p>
    </div>

    <!-- FILTROS -->
    <div class="flex gap-2 mb-5">
      <button v-for="f in filtros" :key="f.id"
        class="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer"
        :class="filtroAtivo === f.id
          ? 'bg-[#534AB7] text-white border-[#534AB7]'
          : 'bg-[rgba(83,74,183,0.06)] text-[#6B6B8A] border-[rgba(127,119,221,0.15)] hover:bg-[rgba(83,74,183,0.15)] hover:text-[#AFA9EC]'"
        @click="filtroAtivo = f.id">
        {{ f.label }}
        <span class="bg-white/10 rounded-full px-1.5 py-0 text-[9px]">
          {{ f.id === 'todos' ? eventos.length : f.id === 'verificados' ? totalVerificados : eventos.length - totalVerificados }}
        </span>
      </button>
    </div>

    <!-- LOADING -->
    <div v-if="carregando" class="text-center py-16 text-[#505070] text-sm animate-pulse">
      Carregando eventos...
    </div>

    <!-- LISTA -->
    <div v-else class="flex flex-col gap-3">
      <div v-if="!eventosFiltrados.length" class="text-center py-12 text-[#505070] text-sm">
        Nenhum evento encontrado.
      </div>

      <div
        v-for="(ev, i) in eventosFiltrados" :key="i"
        class="relative flex items-start gap-4 px-4 py-4 rounded-xl border transition-all hover:translate-x-1 overflow-hidden"
        :class="ev.verificado
          ? 'bg-[rgba(10,10,30,0.7)] border-[rgba(61,255,180,0.12)] hover:border-[rgba(61,255,180,0.25)]'
          : 'bg-[rgba(10,10,30,0.5)] border-[rgba(127,119,221,0.08)] hover:border-[rgba(127,119,221,0.18)]'"
      >
        <!-- faixa lateral colorida -->
        <div class="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl"
          :style="{ background: ev.verificado ? '#3DFFB4' : 'rgba(255,107,107,0.3)' }"></div>

        <!-- LOGO DA PLATAFORMA -->
        <div class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
          :style="ev.verificado && getPlataforma(ev.fonte)
            ? { background: getPlataforma(ev.fonte).cor + '18', border: '1px solid ' + getPlataforma(ev.fonte).cor + '44' }
            : { background: corIdx(i) + '18', border: '1px solid ' + corIdx(i) + '33' }">
          <template v-if="ev.verificado && getPlataforma(ev.fonte)">
            <img v-if="getPlataforma(ev.fonte).logo"
              :src="getPlataforma(ev.fonte).logo"
              :alt="getPlataforma(ev.fonte).nome"
              class="w-full h-full object-contain p-1" />
            <span v-else class="text-2xl">{{ getPlataforma(ev.fonte)?.emoji }}</span>
          </template>
          <ZapIcon v-else class="w-5 h-5" :style="{ color: corIdx(i) }" />
        </div>

        <!-- CORPO -->
        <div class="flex-1 min-w-0">

          <!-- LINHA 1: título + badges -->
          <div class="flex items-center gap-2 flex-wrap mb-1">
            <span class="text-[13px] font-semibold text-[#DDD8FF]">{{ ev.titulo }}</span>

            <!-- BADGE VERIFICADO -->
            <span v-if="ev.verificado"
              class="flex items-center gap-1 text-[9px] font-bold text-[#3DFFB4] bg-[rgba(61,255,180,0.1)] border border-[rgba(61,255,180,0.2)] rounded-full px-2 py-0.5 uppercase tracking-wider">
              <ShieldCheckIcon class="w-2.5 h-2.5" /> verificado
              <span v-if="getPlataforma(ev.fonte)" class="text-[rgba(61,255,180,0.6)] font-normal">
                · via {{ getPlataforma(ev.fonte).nome }}
              </span>
            </span>

            <!-- BADGE MANUAL -->
            <span v-else
              class="flex items-center gap-1 text-[9px] text-[#FF6B6B] bg-[rgba(255,107,107,0.08)] border border-[rgba(255,107,107,0.2)] rounded-full px-2 py-0.5 uppercase tracking-wider">
              <AlertCircleIcon class="w-2.5 h-2.5" /> manual
            </span>
          </div>

          <!-- LINHA 2: tipo + data -->
          <div class="flex items-center gap-3 mb-2">
            <span class="text-[10px] text-[#6B6B8A] capitalize">{{ formatarTipo(ev.tipo) }}</span>
            <span class="text-[#2a2a4a]">·</span>
            <span class="text-[10px] text-[#4E4B6B]">{{ formatarData(ev.data_evento) }}</span>
          </div>

          <!-- LINHA 3: atributos (só verificados) -->
          <div v-if="ev.verificado" class="flex items-center gap-1.5 flex-wrap">
            <span class="text-[9px] text-[#4E4B6B]">Ganhou em:</span>
            <span
              v-for="hab in getHabilidades(ev.tipo)" :key="hab"
              class="text-[9px] font-semibold px-2 py-0.5 rounded-full capitalize"
              :style="{ background: coresHab[hab] + '20', color: coresHab[hab], border: '1px solid ' + coresHab[hab] + '40' }">
              {{ hab }}
            </span>
            <span class="text-[9px] font-bold text-[#FBBF24] bg-[rgba(251,191,36,0.1)] border border-[rgba(251,191,36,0.2)] rounded-full px-2 py-0.5">
              +{{ Math.floor((ev.xp_gerado ?? 0) / 10) }} ⬡
            </span>
          </div>

          <!-- mensagem manual -->
          <div v-else class="flex items-center gap-1.5 text-[10px] text-[rgba(255,107,107,0.4)]">
            <AlertCircleIcon class="w-3 h-3" />
            Evento manual — não gera moedas nem atributos
          </div>
        </div>

        <!-- XP -->
        <div class="flex flex-col items-end gap-0.5 shrink-0">
          <span class="text-[13px] font-bold" :class="ev.verificado ? 'text-[#3DFFB4]' : 'text-[#4E4B6B]'">
            +{{ ev.xp_gerado ?? 0 }} XP
          </span>
          <span v-if="!ev.verificado" class="text-[9px] text-[rgba(255,107,107,0.4)]">sem moedas</span>
        </div>
      </div>
    </div>
  </main>
</template>