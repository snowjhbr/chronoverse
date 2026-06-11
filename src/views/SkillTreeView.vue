<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAvatarStore } from '@/stores/avatar'

const store = useAvatarStore()
onMounted(() => { if (!store.avatar) store.carregar() })

// ─── ESTADO DOS BOTÕES ────────────────────────────────────────────────────────
const desbloqueando   = ref(false)
const feedbackUnlock  = ref('')
const mostrarRecompensas = ref(false)

const recompensasPorHabilidade = {
  criatividade: [
    { nivel: 2, item: '🖌️ Pincel Místico',     desc: 'Cosmético exclusivo para seu avatar' },
    { nivel: 3, item: '📷 Câmera Holográfica',  desc: 'Equipamento visual desbloqueado' },
    { nivel: 4, item: '🎨 Paleta de Mundos',    desc: 'Personalização avançada de avatar' },
    { nivel: 5, item: '✨ Aura Criativa',        desc: 'Efeito visual especial permanente' },
  ],
  inteligencia: [
    { nivel: 2, item: '📚 Tomo do Saber',        desc: 'Aumenta ganho de XP em cursos em 10%' },
    { nivel: 3, item: '🔬 Lente Analítica',      desc: 'Revela detalhes ocultos do avatar' },
    { nivel: 4, item: '🧠 Neural Chip',           desc: 'Interface cognitiva desbloqueada' },
    { nivel: 5, item: '💡 Enlightenment',         desc: 'Dobra XP em eventos de conhecimento' },
  ],
  resistencia: [
    { nivel: 2, item: '🥊 Luvas de Treino',      desc: '+5% de resistência em missões' },
    { nivel: 3, item: '🏃 Botas Turbo',           desc: 'Velocidade aumentada no mapa' },
    { nivel: 4, item: '🛡️ Armadura Leve',         desc: 'Proteção visual desbloqueada' },
    { nivel: 5, item: '⚡ Sprint Eterno',         desc: 'Stamina ilimitada em eventos físicos' },
  ],
  carisma: [
    { nivel: 2, item: '💬 Emblema Social',        desc: 'Destaque em comunidades' },
    { nivel: 3, item: '🤝 Título: Diplomata',     desc: 'Título exibido no perfil' },
    { nivel: 4, item: '👑 Coroa de Influência',   desc: 'Efeito visual no avatar' },
    { nivel: 5, item: '🌟 Aura Carismática',      desc: 'Aumenta reputação em +20%' },
  ],
  foco: [
    { nivel: 2, item: '🎯 Mira Perfeita',         desc: '+10% de precisão em missões' },
    { nivel: 3, item: '🧘 Cristal Zen',            desc: 'Reduz cooldown de habilidades' },
    { nivel: 4, item: '⏱️ Cronômetro Neural',     desc: 'Tempo extra em desafios' },
    { nivel: 5, item: '🔮 Visão Expandida',        desc: 'Revela missões ocultas' },
  ],
  sabedoria: [
    { nivel: 2, item: '📖 Diário Ancestral',      desc: 'Registra conquistas históricas' },
    { nivel: 3, item: '🗺️ Mapa dos Mundos',       desc: 'Revela destinos desconhecidos' },
    { nivel: 4, item: '🦉 Espírito Guia',         desc: 'Companheiro sábio desbloqueado' },
    { nivel: 5, item: '🌌 Conhecimento Cósmico',  desc: 'XP dobrado em viagens' },
  ],
  reputacao: [
    { nivel: 2, item: '🏅 Medalha Bronze',        desc: 'Reconhecimento na comunidade' },
    { nivel: 3, item: '🥈 Medalha Prata',          desc: 'Acesso a eventos exclusivos' },
    { nivel: 4, item: '🥇 Medalha Ouro',           desc: 'Destaque no ranking global' },
    { nivel: 5, item: '💎 Diamante da Fama',       desc: 'Status lendário permanente' },
  ],
  disciplina: [
    { nivel: 2, item: '📅 Agenda Digital',        desc: '+5% XP em hábitos diários' },
    { nivel: 3, item: '⚙️ Rotina Otimizada',      desc: 'Missões diárias renovam mais rápido' },
    { nivel: 4, item: '🏆 Troféu da Constância',  desc: 'Conquista exclusiva desbloqueada' },
    { nivel: 5, item: '👁️ Olho do Mestre',        desc: 'Todas as missões reveladas' },
  ],
}

function getRecompensas(habilidade) {
  return recompensasPorHabilidade[habilidade] ?? []
}

async function desbloquearNivel() {
  if (!skillSelecionada.value) return
  const nivel = getNivel(skillSelecionada.value.habilidade)
  if (nivel >= 5) {
    feedbackUnlock.value = 'Nível máximo já atingido!'
    setTimeout(() => feedbackUnlock.value = '', 2500)
    return
  }
  if (pontosDisponiveis.value < 1) {
    feedbackUnlock.value = 'Pontos insuficientes!'
    setTimeout(() => feedbackUnlock.value = '', 2500)
    return
  }
  desbloqueando.value = true
  await new Promise(r => setTimeout(r, 800))

  // Atualiza localmente somando 20 pontos na habilidade
  const hab = store.habilidades?.find(h => h.nome === skillSelecionada.value.habilidade)
  if (hab) hab.pontos = Math.min(100, hab.pontos + 20)

  feedbackUnlock.value = `✓ Nível ${nivel + 1} desbloqueado!`
  desbloqueando.value = false
  setTimeout(() => feedbackUnlock.value = '', 3000)
}

// ─── ÁRVORE DE SKILLS ────────────────────────────────────────────────────────
const categoriaAtiva   = ref('todas')
const skillSelecionada = ref(null)

const categorias = [
  { id: 'todas',        label: 'TODAS' },
  { id: 'criatividade', label: 'CRIATIVIDADE' },
  { id: 'conhecimento', label: 'CONHECIMENTO' },
  { id: 'social',       label: 'SOCIAL' },
  { id: 'tecnologia',   label: 'TECNOLOGIA' },
  { id: 'fisico',       label: 'FÍSICO' },
]

const arvore = {
  criatividade: {
    id: 'criatividade',
    label: 'CRIATIVIDADE',
    cor: '#A78BFA',
    imagem: '/skills/design.png',
    habilidade: 'criatividade',
    filhos: [
      { id: 'design',      label: 'Design',      imagem: '/skills/design.png', cor: '#A78BFA', habilidade: 'criatividade', filhos: [] },
      { id: 'fotografia',  label: 'Fotografia',  imagem: '/skills/fotografia.png', cor: '#A78BFA', habilidade: 'criatividade', filhos: [] },
      { id: 'musica',      label: 'Música',      imagem: '/skills/musica.png', cor: '#A78BFA', habilidade: 'criatividade', filhos: [] },
    ]
  },
  conhecimento: {
    id: 'conhecimento',
    label: 'CONHECIMENTO',
    cor: '#38BDF8',
    imagem: '/skills/ciencia.png',
    habilidade: 'inteligencia',
    filhos: [
      { id: 'academia',    label: 'Academia',    imagem: '/skills/academia.png', cor: '#38BDF8', habilidade: 'inteligencia', filhos: [] },
      { id: 'ciencia',     label: 'Ciência',     imagem: '/skills/ciencia.png', cor: '#38BDF8', habilidade: 'inteligencia', filhos: [] },
      { id: 'pesquisa',    label: 'Pesquisa',    imagem: '/skills/pesquisa.png', cor: '#38BDF8', habilidade: 'sabedoria',    filhos: [] },
    ]
  },
  social: {
    id: 'social',
    label: 'SOCIAL',
    cor: '#F472B6',
    imagem: '/skills/lideranca.png',
    habilidade: 'carisma',
    filhos: [
      { id: 'comunicacao', label: 'Comunicação', imagem: '/skills/comunicacao.png', cor: '#F472B6', habilidade: 'carisma', filhos: [] },
      { id: 'lideranca',   label: 'Liderança',   imagem: '/skills/lideranca.png', cor: '#F472B6', habilidade: 'carisma', filhos: [] },
      { id: 'empatia',     label: 'Empatia',     imagem: '/skills/empatia.png', cor: '#F472B6', habilidade: 'carisma', filhos: [] },
    ]
  },
  tecnologia: {
    id: 'tecnologia',
    label: 'TECNOLOGIA',
    cor: '#34D399',
    imagem: '/skills/tecnologia.png',
    habilidade: 'inteligencia',
    filhos: [
      { id: 'programacao', label: 'Código',      imagem: '/skills/codigo.png', cor: '#34D399', habilidade: 'inteligencia', filhos: [] },
      { id: 'hardware',    label: 'Hardware',    imagem: '/skills/hardware.png', cor: '#34D399', habilidade: 'inteligencia', filhos: [] },
      { id: 'seguranca',   label: 'Segurança',   imagem: '/skills/seguranca.png', cor: '#34D399', habilidade: 'foco',         filhos: [] },
    ]
  },
  fisico: {
    id: 'fisico',
    label: 'FÍSICO',
    cor: '#FBBF24',
    imagem: '/skills/fisico.png',
    habilidade: 'resistencia',
    filhos: [
      { id: 'atletismo',   label: 'Atletismo',   imagem: '/skills/atletismo.png', cor: '#FBBF24', habilidade: 'resistencia', filhos: [] },
      { id: 'defesa',      label: 'Defesa',      imagem: '/skills/defesa.png', cor: '#FBBF24', habilidade: 'resistencia', filhos: [] },
      { id: 'nutricao',    label: 'Nutrição',    imagem: '/skills/nutricao.png', cor: '#FBBF24', habilidade: 'disciplina',  filhos: [] },
    ]
  }
}

function getPontos(habilidade) {
  if (!store.habilidades?.length) return 0
  return store.habilidades.find(h => h.nome === habilidade)?.pontos || 0
}

function getNivel(habilidade) {
  const pts = getPontos(habilidade)
  return Math.min(5, Math.floor(pts / 20) + (pts > 0 ? 1 : 0))
}

function getMaxNivel() { return 5 }

const skillInfo = computed(() => {
  if (!skillSelecionada.value) return null
  const nodo  = skillSelecionada.value
  const pts   = getPontos(nodo.habilidade)
  const nivel = getNivel(nodo.habilidade)
  return { ...nodo, pts, nivel, proxNivel: Math.min(5, nivel + 1) }
})

const pontosDisponiveis = computed(() =>
  store.avatar ? Math.floor((store.avatar.xp_total || 0) / 100) : 3
)

// ─── CANVAS ──────────────────────────────────────────────────────────────────
const canvasRef = ref(null)
let ctx = null, particles = [], animId = null

class Particle {
  constructor(path) {
    this.path  = path
    this.t     = Math.random()
    this.speed = 0.002 + Math.random() * 0.003
    this.size  = 2 + Math.random() * 2
    this.alpha = 0
    this.color = path.cor
  }
  update() {
    this.t += this.speed
    if (this.t > 1) this.t = 0
    if      (this.t < 0.15) this.alpha = this.t / 0.15
    else if (this.t > 0.85) this.alpha = (1 - this.t) / 0.15
    else                    this.alpha = 1
  }
  getPos() {
    const { x1, y1, x2, y2 } = this.path
    return { x: x1 + (x2 - x1) * this.t, y: y1 + (y2 - y1) * this.t }
  }
}

const nos = {
  centro:             { x: 0.50, y: 0.50 },
  criatividade:       { x: 0.50, y: 0.15 },
  criatividade_label: { x: 0.50, y: 0.06 },
  design:             { x: 0.38, y: 0.32 },
  fotografia:         { x: 0.50, y: 0.32 },
  musica:             { x: 0.62, y: 0.32 },
  conhecimento:       { x: 0.20, y: 0.42 },
  conhecimento_label: { x: 0.17, y: 0.34 },
  academia:           { x: 0.14, y: 0.58 },
  ciencia:            { x: 0.24, y: 0.58 },
  pesquisa:           { x: 0.33, y: 0.58 },
  social:             { x: 0.80, y: 0.42 },
  social_label:       { x: 0.82, y: 0.34 },
  comunicacao:        { x: 0.68, y: 0.58 },
  lideranca:          { x: 0.78, y: 0.58 },
  empatia:            { x: 0.88, y: 0.58 },
  tecnologia:         { x: 0.26, y: 0.70 },
  tecnologia_label:   { x: 0.22, y: 0.63 },
  programacao:        { x: 0.20, y: 0.84 },
  hardware:           { x: 0.30, y: 0.84 },
  seguranca:          { x: 0.40, y: 0.84 },
  fisico:             { x: 0.62, y: 0.70 },
  fisico_label:       { x: 0.64, y: 0.63 },
  atletismo:          { x: 0.54, y: 0.84 },
  defesa:             { x: 0.63, y: 0.84 },
  nutricao:           { x: 0.72, y: 0.84 },
}

const conexoes = [
  { from: 'centro',       to: 'criatividade',  cor: '#A78BFA' },
  { from: 'criatividade', to: 'design',        cor: '#A78BFA' },
  { from: 'criatividade', to: 'fotografia',    cor: '#A78BFA' },
  { from: 'criatividade', to: 'musica',        cor: '#A78BFA' },
  { from: 'centro',       to: 'conhecimento',  cor: '#38BDF8' },
  { from: 'conhecimento', to: 'academia',      cor: '#38BDF8' },
  { from: 'conhecimento', to: 'ciencia',       cor: '#38BDF8' },
  { from: 'conhecimento', to: 'pesquisa',      cor: '#38BDF8' },
  { from: 'centro',       to: 'social',        cor: '#F472B6' },
  { from: 'social',       to: 'comunicacao',   cor: '#F472B6' },
  { from: 'social',       to: 'lideranca',     cor: '#F472B6' },
  { from: 'social',       to: 'empatia',       cor: '#F472B6' },
  { from: 'centro',       to: 'tecnologia',    cor: '#34D399' },
  { from: 'tecnologia',   to: 'programacao',   cor: '#34D399' },
  { from: 'tecnologia',   to: 'hardware',      cor: '#34D399' },
  { from: 'tecnologia',   to: 'seguranca',     cor: '#34D399' },
  { from: 'centro',       to: 'fisico',        cor: '#FBBF24' },
  { from: 'fisico',       to: 'atletismo',     cor: '#FBBF24' },
  { from: 'fisico',       to: 'defesa',        cor: '#FBBF24' },
  { from: 'fisico',       to: 'nutricao',      cor: '#FBBF24' },
]

function initParticles(w, h) {
  particles = []
  conexoes.forEach(c => {
    const a = nos[c.from], b = nos[c.to]
    const path = { x1: a.x*w, y1: a.y*h, x2: b.x*w, y2: b.y*h, cor: c.cor }
    for (let i = 0; i < 3; i++) particles.push(new Particle(path))
  })
}

function drawLines(w, h) {
  conexoes.forEach(c => {
    const a = nos[c.from], b = nos[c.to]
    ctx.beginPath(); ctx.moveTo(a.x*w, a.y*h); ctx.lineTo(b.x*w, b.y*h)
    ctx.strokeStyle = c.cor + '33'; ctx.lineWidth = 1.5; ctx.stroke()
    ctx.beginPath(); ctx.moveTo(a.x*w, a.y*h); ctx.lineTo(b.x*w, b.y*h)
    ctx.strokeStyle = c.cor + '18'; ctx.lineWidth = 4;   ctx.stroke()
  })
}

function animate() {
  if (!ctx || !canvasRef.value) return
  const w = canvasRef.value.width, h = canvasRef.value.height
  ctx.clearRect(0, 0, w, h)
  drawLines(w, h)
  particles.forEach(p => {
    p.update()
    const pos = p.getPos()
    ctx.beginPath(); ctx.arc(pos.x, pos.y, p.size, 0, Math.PI*2)
    ctx.fillStyle = p.color + Math.round(p.alpha*255).toString(16).padStart(2,'0'); ctx.fill()
    ctx.beginPath(); ctx.arc(pos.x, pos.y, p.size*2.5, 0, Math.PI*2)
    ctx.fillStyle = p.color + Math.round(p.alpha*60).toString(16).padStart(2,'0');  ctx.fill()
  })
  animId = requestAnimationFrame(animate)
}

function resizeCanvas() {
  if (!canvasRef.value) return
  const parent = canvasRef.value.parentElement
  canvasRef.value.width  = parent.clientWidth
  canvasRef.value.height = parent.clientHeight
  initParticles(canvasRef.value.width, canvasRef.value.height)
}

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')
    resizeCanvas(); animate()
    window.addEventListener('resize', resizeCanvas)
  }
})
onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
  window.removeEventListener('resize', resizeCanvas)
})

function selecionarSkill(nodo) { skillSelecionada.value = nodo }

function posNodo(id) {
  const n = nos[id]
  if (!n) return {}
  return { left: (n.x*100)+'%', top: (n.y*100)+'%' }
}

const todosNos = computed(() => {
  const lista = []
  Object.values(arvore).forEach(cat => {
    lista.push({ ...cat, tipo: 'raiz' })
    cat.filhos.forEach(f => lista.push({ ...f, tipo: 'folha' }))
  })
  return lista
})

function nivelLabel(habilidade) {
  return `${getNivel(habilidade)}/${getMaxNivel()}`
}
</script>

<template>
  <div class="skilltree-root">

    <!-- SIDEBAR -->
    <aside class="sidebar">
      <div class="sidebar-avatar">
        <div class="av-ring">
          <img src="../assets/profile.png" class="av-img" alt="avatar" />
        </div>
        <div class="av-name">{{ store.avatar?.nome ?? 'Avatar' }}<span class="av-tag">#2587</span></div>
        <div class="av-level-badge">NÍVEL {{ store.avatar?.nivel ?? 1 }}</div>
        <div class="av-xp-bar">
          <div class="av-xp-fill" :style="{ width: Math.min(100, ((store.avatar?.xp_total ?? 0) % 200) / 2) + '%' }"></div>
        </div>
        <div class="av-xp-label">{{ (store.avatar?.xp_total ?? 0).toLocaleString('pt-BR') }} / {{ ((store.avatar?.nivel ?? 1) + 1) * 200 }} XP</div>
      </div>

      <nav class="sidebar-nav">
        <RouterLink to="/"          class="nav-item"><span class="nav-ico">⊙</span> Visão Geral</RouterLink>
        <RouterLink to="/"          class="nav-item"><span class="nav-ico">◈</span> Atributos</RouterLink>
        <RouterLink to="/skilltree" class="nav-item active"><span class="nav-ico">✦</span> Skills</RouterLink>
        <RouterLink to="/"          class="nav-item"><span class="nav-ico">⊞</span> Inventário</RouterLink>
        <RouterLink to="/missoes"   class="nav-item"><span class="nav-ico">◎</span> Missões</RouterLink>
        <RouterLink to="/timeline"  class="nav-item"><span class="nav-ico">⧗</span> Histórico</RouterLink>
        <RouterLink to="/"          class="nav-item"><span class="nav-ico">★</span> Conquistas</RouterLink>
        <RouterLink to="/"          class="nav-item"><span class="nav-ico">⚙</span> Configurações</RouterLink>
      </nav>

      <div class="sidebar-rep">
        <div class="rep-label">REPUTAÇÃO</div>
        <div class="rep-value">
          <span class="rep-heart">♥</span>
          {{ (store.habilidades?.find(h => h.nome === 'reputacao')?.pontos * 48.5 || 0).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.') }}
        </div>
        <div class="rep-rank">{{ getPontos('reputacao') > 60 ? 'Lendário' : getPontos('reputacao') > 40 ? 'Respeitado' : 'Iniciante' }}</div>
        <div class="rep-dots">
          <span v-for="i in 5" :key="i" class="rep-dot" :class="{ active: i <= Math.ceil(getPontos('reputacao') / 20) }"></span>
        </div>
      </div>
    </aside>

    <!-- MAIN -->
    <main class="main-area">
      <header class="topbar">
        <div class="topbar-brand">
          <span class="topbar-logo">▼</span>
          <div>
            <div class="topbar-title">SKILLTREE</div>
            <div class="topbar-sub">Desenvolva seu avatar</div>
          </div>
        </div>
        <nav class="topbar-nav">
          <RouterLink to="/"          class="tnav">⊙ Resumo</RouterLink>
          <RouterLink to="/"          class="tnav">⊞ Inventário</RouterLink>
          <RouterLink to="/missoes"   class="tnav">◎ Missões</RouterLink>
          <RouterLink to="/"          class="tnav">★ Conquistas</RouterLink>
          <RouterLink to="/skilltree" class="tnav active">✦ Skills</RouterLink>
        </nav>
        <div class="topbar-icons">
          <span class="ticon">🔔</span>
          <span class="ticon">✉</span>
          <span class="ticon">☰</span>
        </div>
      </header>

      <div class="cat-bar">
        <button v-for="cat in categorias" :key="cat.id" class="cat-btn"
          :class="{ active: categoriaAtiva === cat.id }" @click="categoriaAtiva = cat.id">
          {{ cat.label }}
        </button>
        <div class="pts-badge">PONTOS DISPONÍVEIS <span class="pts-star">✦</span> {{ pontosDisponiveis }}</div>
      </div>

      <div class="graph-area">
        <canvas ref="canvasRef" class="particles-canvas"></canvas>

        <div class="nodo centro-nodo" :style="posNodo('centro')" @click="skillSelecionada = null">
          <div class="centro-avatar">
            <img src="../assets/profile.png" alt="avatar" class="centro-img" />
            <div class="centro-pulse"></div>
          </div>
          <div class="centro-label">NÍVEL {{ store.avatar?.nivel ?? 1 }}</div>
        </div>

        <template v-for="(cat, catId) in arvore" :key="catId">
          <div class="nodo raiz-nodo"
            :class="{ visible: categoriaAtiva === 'todas' || categoriaAtiva === catId, selecionado: skillSelecionada?.id === cat.id }"
            :style="{ ...posNodo(cat.id), '--cor': cat.cor }"
            @click="selecionarSkill(cat)">
            <div class="hexagon" :style="{ '--cor': cat.cor }">
            <span class="nodo-icone">
              <img :src="cat.imagem" :alt="cat.label" class="skill-img-root">
            </span>            </div>
            <div class="nodo-nivel" :style="{ color: cat.cor }">{{ nivelLabel(cat.habilidade) }}</div>
            <div class="nodo-glow" :style="{ background: cat.cor + '30' }"></div>
          </div>

          <div class="cat-label"
            :class="{ visible: categoriaAtiva === 'todas' || categoriaAtiva === catId }"
            :style="{ ...posNodo(cat.id + '_label'), color: cat.cor }">
            {{ cat.label }}
          </div>

          <div v-for="filho in cat.filhos" :key="filho.id"
            class="nodo filho-nodo"
            :class="{ visible: categoriaAtiva === 'todas' || categoriaAtiva === catId, selecionado: skillSelecionada?.id === filho.id }"
            :style="{ ...posNodo(filho.id), '--cor': filho.cor }"
            @click="selecionarSkill(filho)">
            <div class="hexagon-sm" :style="{ '--cor': filho.cor }">
            <span class="nodo-icone-sm">
              <img :src="filho.imagem" :alt="filho.label" class="skill-img-child">
            </span>            </div>
            <div class="nodo-nivel-sm" :style="{ color: filho.cor }">{{ nivelLabel(filho.habilidade) }}</div>
          </div>
        </template>
      </div>

      <div class="graph-footer">
        <button class="footer-btn">↺ RESETAR ÁRVORE</button>
        <button class="footer-btn">? COMO FUNCIONA</button>
      </div>
    </main>

    <!-- PAINEL DIREITO -->
    <aside class="right-panel">
      <template v-if="skillSelecionada">
        <div class="skill-header">
          <div class="hexagon-big" :style="{ '--cor': skillSelecionada.cor }">
            <img
              :src="skillSelecionada.imagem"
              :alt="skillSelecionada.label"
              class="skill-img-big"
            >
          </div>
          <div>
            <div class="skill-cat-label" :style="{ color: skillSelecionada.cor }">
              {{ skillSelecionada.tipo === 'raiz' ? 'CATEGORIA' : skillSelecionada.label.toUpperCase() }}
            </div>
            <div class="skill-name">{{ skillSelecionada.label.toUpperCase() }}</div>
            <div class="skill-level-label">NÍVEL {{ getNivel(skillSelecionada.habilidade) }} / 5</div>
          </div>
        </div>

        <p class="skill-desc">
          Representa sua capacidade em {{ skillSelecionada.label.toLowerCase() }}, desenvolvida através de experiências reais verificadas no Chronoverse.
        </p>

        <div class="skill-section-label">PRÓXIMO NÍVEL</div>
        <div class="prox-nivel-badge">NÍVEL {{ Math.min(5, getNivel(skillSelecionada.habilidade) + 1) }} / 5</div>
        <div class="prox-bonus">
          <div class="bonus-item">+ 10% na geração de recursos desta categoria</div>
          <div class="bonus-item">+ Desbloqueia: Habilidade Avançada</div>
        </div>

        <div class="skill-section-label" style="margin-top:16px">REQUISITOS</div>
        <div class="req-item">
          <span class="req-check ok">✓</span>
          <span class="req-label">Pontos Disponíveis</span>
          <span class="req-val ok">{{ pontosDisponiveis }} / 1</span>
        </div>
        <div class="req-item">
          <span class="req-check" :class="getPontos(skillSelecionada.habilidade) >= 40 ? 'ok' : 'pend'">
            {{ getPontos(skillSelecionada.habilidade) >= 40 ? '✓' : '○' }}
          </span>
          <span class="req-label">Nível 2 em {{ skillSelecionada.label }}</span>
          <span class="req-val" :class="getPontos(skillSelecionada.habilidade) >= 40 ? 'ok' : 'pend'">
            {{ getPontos(skillSelecionada.habilidade) >= 40 ? '✓' : Math.floor(getPontos(skillSelecionada.habilidade) / 20) + ' / 2' }}
          </span>
        </div>
        <div class="req-item">
          <span class="req-check" :class="getPontos('inteligencia') >= 20 ? 'ok' : 'pend'">
            {{ getPontos('inteligencia') >= 20 ? '✓' : '○' }}
          </span>
          <span class="req-label">Conhecimento Nível 2</span>
          <span class="req-val" :class="getPontos('inteligencia') >= 40 ? 'ok' : 'pend'">
            {{ getPontos('inteligencia') >= 40 ? '✓' : Math.floor(getPontos('inteligencia') / 20) + ' / 2' }}
          </span>
        </div>

        <!-- BOTÃO DESBLOQUEAR -->
        <button
          class="unlock-btn"
          :style="{ '--cor': skillSelecionada.cor }"
          :disabled="desbloqueando || getNivel(skillSelecionada.habilidade) >= 5"
          @click="desbloquearNivel"
        >
          {{ desbloqueando ? 'Desbloqueando...' : getNivel(skillSelecionada.habilidade) >= 5 ? '✓ Nível Máximo' : 'DESBLOQUEAR NÍVEL ' + Math.min(5, getNivel(skillSelecionada.habilidade) + 1) }}
        </button>

        <!-- FEEDBACK -->
        <div v-if="feedbackUnlock" class="feedback-unlock" :class="feedbackUnlock.includes('✓') ? 'ok' : 'err'">
          {{ feedbackUnlock }}
        </div>

        <!-- BOTÃO RECOMPENSAS -->
        <button class="reward-btn" @click="mostrarRecompensas = true">VISUALIZAR RECOMPENSAS</button>

        <div class="skill-section-label" style="margin-top:16px">SUAS SKILLS ATIVAS</div>
        <div class="skills-ativas">
          <div v-for="cat in Object.values(arvore).slice(0, 5)" :key="cat.id"
            class="skill-ativa-item" :style="{ '--cor': cat.cor }" @click="selecionarSkill(cat)">
            <div class="sa-hex" :style="{ '--cor': cat.cor }">
              <img
                :src="cat.imagem"
                :alt="cat.label"
                class="skill-img-active"
              >
            </div>
            <div class="sa-lvl" :style="{ color: cat.cor }">Nvl. {{ getNivel(cat.habilidade) }}</div>
          </div>
          <button class="sa-more">›</button>
        </div>
      </template>

      <template v-else>
        <div style="padding:24px; color:#6B6B8A; font-size:13px; text-align:center; line-height:1.7">
          <div style="font-size:32px; margin-bottom:12px">✦</div>
          Selecione uma habilidade na árvore para ver detalhes, requisitos e recompensas.
        </div>
        <div class="skill-section-label" style="margin-top:8px">SUAS SKILLS ATIVAS</div>
        <div class="skills-ativas">
          <div v-for="cat in Object.values(arvore).slice(0, 5)" :key="cat.id"
            class="skill-ativa-item" :style="{ '--cor': cat.cor }" @click="selecionarSkill(cat)">
            <div class="sa-hex" :style="{ '--cor': cat.cor }">
              <img
                :src="cat.imagem"
                :alt="cat.label"
                class="skill-img-active"
              >
            </div>
            <div class="sa-lvl" :style="{ color: cat.cor }">Nvl. {{ getNivel(cat.habilidade) }}</div>
          </div>
          <button class="sa-more">›</button>
        </div>
      </template>
    </aside>

    <!-- MODAL DE RECOMPENSAS -->
    <div v-if="mostrarRecompensas && skillSelecionada" class="modal-overlay" @click.self="mostrarRecompensas = false">
      <div class="modal-box">
        <div class="modal-header" :style="{ borderColor: skillSelecionada.cor + '44' }">
          <div class="modal-ico" :style="{ '--cor': skillSelecionada.cor }">
            <img
              :src="skillSelecionada.imagem"
              :alt="skillSelecionada.label"
              class="skill-img-modal"
            >
          </div>
          <div>
            <div class="modal-title">Recompensas — {{ skillSelecionada.label }}</div>
            <div class="modal-sub" :style="{ color: skillSelecionada.cor }">
              Nível atual: {{ getNivel(skillSelecionada.habilidade) }} / 5
            </div>
          </div>
          <button class="modal-close" @click="mostrarRecompensas = false">✕</button>
        </div>
        <div class="modal-list">
          <div v-for="r in getRecompensas(skillSelecionada.habilidade)" :key="r.nivel"
            class="modal-item" :class="{ unlocked: getNivel(skillSelecionada.habilidade) >= r.nivel }">
            <div class="modal-nivel"
              :style="{ background: getNivel(skillSelecionada.habilidade) >= r.nivel ? skillSelecionada.cor : '#2a2a4a' }">
              Nvl {{ r.nivel }}
            </div>
            <div class="modal-item-ico">{{ r.item.split(' ')[0] }}</div>
            <div class="modal-item-info">
              <div class="modal-item-nome">{{ r.item.split(' ').slice(1).join(' ') }}</div>
              <div class="modal-item-desc">{{ r.desc }}</div>
            </div>
            <div class="modal-status">
              <span v-if="getNivel(skillSelecionada.habilidade) >= r.nivel" class="status-ok">✓ Desbloqueado</span>
              <span v-else class="status-lock">🔒 Bloqueado</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.skilltree-root {
  display: grid;
  grid-template-columns: 200px 1fr 280px;
  height: 100vh;
  background: #07090F;
  color: #DDD8FF;
  font-family: 'Syne', 'Segoe UI', sans-serif;
  overflow: hidden;
}
.sidebar {
  border-right: 1px solid rgba(127,119,221,0.12);
  background: rgba(83,74,183,0.04);
  display: flex; flex-direction: column;
  padding: 16px 0; overflow-y: auto;
}
.sidebar-avatar { padding: 0 16px 16px; border-bottom: 1px solid rgba(127,119,221,0.1); margin-bottom: 8px; }
.av-ring { width: 72px; height: 72px; border-radius: 50%; border: 2px solid #534AB7; box-shadow: 0 0 16px rgba(83,74,183,0.4); overflow: hidden; margin: 0 auto 10px; }
.av-img { width: 100%; height: 100%; object-fit: cover; }
.av-name { font-size: 14px; font-weight: 700; text-align: center; color: #DDD8FF; }
.av-tag { color: #534AB7; font-size: 12px; }
.av-level-badge { text-align: center; font-size: 10px; background: rgba(83,74,183,0.2); color: #7F77DD; border-radius: 100px; padding: 2px 10px; margin: 6px auto 8px; width: fit-content; letter-spacing: 1px; }
.av-xp-bar { height: 4px; background: rgba(127,119,221,0.15); border-radius: 2px; overflow: hidden; margin-bottom: 4px; }
.av-xp-fill { height: 100%; background: linear-gradient(90deg, #534AB7, #7F77DD); border-radius: 2px; transition: width 0.6s; }
.av-xp-label { font-size: 10px; color: #4E4B6B; text-align: center; }
.sidebar-nav { padding: 8px 0; flex: 1; }
.nav-item { display: flex; align-items: center; gap: 10px; padding: 8px 16px; font-size: 12px; color: #6B6B8A; cursor: pointer; text-decoration: none; transition: all 0.2s; border-left: 2px solid transparent; }
.nav-item:hover { color: #AFA9EC; background: rgba(83,74,183,0.08); }
.nav-item.active { color: #DDD8FF; background: rgba(83,74,183,0.15); border-left-color: #7F77DD; }
.nav-ico { font-size: 14px; }
.sidebar-rep { padding: 14px 16px; border-top: 1px solid rgba(127,119,221,0.1); }
.rep-label { font-size: 9px; letter-spacing: 2px; color: #4E4B6B; margin-bottom: 4px; }
.rep-heart { color: #F472B6; margin-right: 4px; }
.rep-value { font-size: 18px; font-weight: 700; color: #F472B6; }
.rep-rank { font-size: 11px; color: #6B6B8A; margin: 2px 0 6px; }
.rep-dots { display: flex; gap: 4px; }
.rep-dot { width: 10px; height: 4px; border-radius: 2px; background: rgba(244,114,182,0.2); transition: background 0.3s; }
.rep-dot.active { background: #F472B6; }
.main-area { display: flex; flex-direction: column; overflow: hidden; }
.topbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; border-bottom: 1px solid rgba(127,119,221,0.1); background: rgba(7,9,15,0.9); flex-shrink: 0; }
.topbar-brand { display: flex; align-items: center; gap: 10px; }
.topbar-logo { font-size: 20px; color: #534AB7; }
.topbar-title { font-size: 14px; font-weight: 800; letter-spacing: 2px; }
.topbar-sub { font-size: 10px; color: #6B6B8A; }
.topbar-nav { display: flex; gap: 4px; }
.tnav { padding: 6px 12px; font-size: 11px; color: #6B6B8A; text-decoration: none; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
.tnav:hover { color: #AFA9EC; background: rgba(83,74,183,0.1); }
.tnav.active { color: #DDD8FF; background: rgba(83,74,183,0.2); }
.topbar-icons { display: flex; gap: 12px; }
.ticon { font-size: 16px; color: #534AB7; cursor: pointer; }
.cat-bar { display: flex; align-items: center; gap: 4px; padding: 8px 16px; border-bottom: 1px solid rgba(127,119,221,0.08); flex-shrink: 0; }
.cat-btn { padding: 5px 12px; font-size: 10px; font-weight: 700; letter-spacing: 1px; border: none; border-radius: 100px; background: rgba(83,74,183,0.08); color: #6B6B8A; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.cat-btn:hover { background: rgba(83,74,183,0.15); color: #AFA9EC; }
.cat-btn.active { background: #534AB7; color: #fff; }
.pts-badge { margin-left: auto; font-size: 11px; color: #AFA9EC; background: rgba(83,74,183,0.12); border: 1px solid rgba(83,74,183,0.25); padding: 4px 12px; border-radius: 100px; display: flex; align-items: center; gap: 6px; }
.pts-star { color: #7F77DD; }
.graph-area { flex: 1; position: relative; overflow: hidden; }
.particles-canvas { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.nodo { position: absolute; transform: translate(-50%, -50%); cursor: pointer; transition: opacity 0.3s; }
.centro-nodo { z-index: 10; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.centro-avatar { position: relative; width: 64px; height: 64px; }
.centro-img { width: 100%; height: 100%; border-radius: 50%; border: 2px solid #534AB7; object-fit: cover; box-shadow: 0 0 20px rgba(83,74,183,0.5); }
.centro-pulse { position: absolute; inset: -6px; border-radius: 50%; border: 1px solid rgba(83,74,183,0.4); animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%,100%{transform:scale(1);opacity:.6} 50%{transform:scale(1.1);opacity:.2} }
.centro-label { font-size: 10px; font-weight: 700; color: #7F77DD; letter-spacing: 1px; }
.hexagon { width: 52px; height: 52px; background: linear-gradient(135deg, color-mix(in srgb, var(--cor) 25%, transparent), color-mix(in srgb, var(--cor) 10%, transparent)); border: 1.5px solid var(--cor); border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px color-mix(in srgb, var(--cor) 30%, transparent); transition: all 0.2s; position: relative; }
.raiz-nodo:hover .hexagon, .raiz-nodo.selecionado .hexagon { box-shadow: 0 0 24px color-mix(in srgb, var(--cor) 60%, transparent); transform: scale(1.1); }
.hexagon-sm { width: 38px; height: 38px; background: color-mix(in srgb, var(--cor) 12%, transparent); border: 1px solid color-mix(in srgb, var(--cor) 60%, transparent); border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.filho-nodo:hover .hexagon-sm, .filho-nodo.selecionado .hexagon-sm { box-shadow: 0 0 14px color-mix(in srgb, var(--cor) 50%, transparent); transform: scale(1.12); border-color: var(--cor); }
.nodo-icone { font-size: 20px; z-index: 1; }
.nodo-icone-sm { font-size: 14px; }
.nodo-nivel { font-size: 11px; font-weight: 700; margin-top: 4px; letter-spacing: 0.5px; }
.nodo-nivel-sm { font-size: 10px; font-weight: 600; margin-top: 3px; }
.nodo-glow { position: absolute; inset: -8px; border-radius: 16px; pointer-events: none; opacity: 0; transition: opacity 0.2s; }
.raiz-nodo.selecionado .nodo-glow { opacity: 1; }
.cat-label { position: absolute; transform: translateX(-50%); font-size: 10px; font-weight: 700; letter-spacing: 1.5px; pointer-events: none; opacity: 0; transition: opacity 0.3s; white-space: nowrap; }
.cat-label.visible { opacity: 1; }
.raiz-nodo, .filho-nodo { opacity: 0; pointer-events: none; transition: opacity 0.3s; }
.raiz-nodo.visible, .filho-nodo.visible { opacity: 1; pointer-events: all; }
.graph-footer { display: flex; justify-content: center; gap: 16px; padding: 10px; border-top: 1px solid rgba(127,119,221,0.08); flex-shrink: 0; }
.footer-btn { font-size: 11px; color: #6B6B8A; background: none; border: none; cursor: pointer; font-family: inherit; letter-spacing: 0.5px; transition: color 0.2s; }
.footer-btn:hover { color: #AFA9EC; }
.right-panel { border-left: 1px solid rgba(127,119,221,0.12); background: rgba(83,74,183,0.03); padding: 20px 16px; overflow-y: auto; }
.skill-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
.hexagon-big { width: 56px; height: 56px; background: color-mix(in srgb, var(--cor) 15%, transparent); border: 1.5px solid var(--cor); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 0 16px color-mix(in srgb, var(--cor) 35%, transparent); }
.skill-cat-label { font-size: 10px; letter-spacing: 2px; margin-bottom: 2px; }
.skill-name { font-size: 16px; font-weight: 700; color: #DDD8FF; }
.skill-level-label { font-size: 11px; color: #6B6B8A; margin-top: 2px; }
.skill-desc { font-size: 12px; color: #8585A8; line-height: 1.6; margin-bottom: 14px; }
.skill-section-label { font-size: 9px; letter-spacing: 2px; color: #534AB7; font-weight: 700; margin-bottom: 8px; }
.prox-nivel-badge { font-size: 11px; font-weight: 600; color: #AFA9EC; margin-bottom: 8px; }
.prox-bonus { margin-bottom: 4px; }
.bonus-item { font-size: 11px; color: #6B6B8A; padding-left: 12px; position: relative; margin-bottom: 4px; line-height: 1.4; }
.bonus-item::before { content: '+'; position: absolute; left: 0; color: #534AB7; }
.req-item { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 12px; }
.req-check { font-size: 12px; width: 16px; }
.req-check.ok { color: #1D9E75; }
.req-check.pend { color: #6B6B8A; }
.req-label { flex: 1; color: #AFA9EC; }
.req-val { font-size: 11px; }
.req-val.ok { color: #1D9E75; }
.req-val.pend { color: #EF9F27; }
.unlock-btn { width: 100%; padding: 12px; background: var(--cor, #534AB7); border: none; border-radius: 10px; color: #fff; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; letter-spacing: 1px; margin-top: 14px; margin-bottom: 8px; transition: opacity 0.2s; box-shadow: 0 4px 16px color-mix(in srgb, var(--cor, #534AB7) 40%, transparent); }
.unlock-btn:hover:not(:disabled) { opacity: 0.85; }
.unlock-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.feedback-unlock { text-align: center; font-size: 12px; font-weight: 600; padding: 6px; border-radius: 8px; margin-bottom: 8px; }
.feedback-unlock.ok { color: #34D399; background: rgba(52,211,153,0.1); }
.feedback-unlock.err { color: #FF6B6B; background: rgba(255,107,107,0.1); }
.reward-btn { width: 100%; padding: 10px; background: rgba(83,74,183,0.1); border: 1px solid rgba(83,74,183,0.25); border-radius: 10px; color: #AFA9EC; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; letter-spacing: 1px; transition: all 0.2s; }
.reward-btn:hover { background: rgba(83,74,183,0.2); }
.skills-ativas { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.skill-ativa-item { display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; }
.sa-hex { width: 36px; height: 36px; background: color-mix(in srgb, var(--cor) 15%, transparent); border: 1px solid color-mix(in srgb, var(--cor) 50%, transparent); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; transition: all 0.2s; }
.skill-ativa-item:hover .sa-hex { box-shadow: 0 0 10px color-mix(in srgb, var(--cor) 50%, transparent); }
.sa-lvl { font-size: 9px; }
.sa-more { width: 36px; height: 36px; background: rgba(83,74,183,0.1); border: 1px solid rgba(83,74,183,0.2); border-radius: 8px; color: #6B6B8A; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-box { background: #0F0F1E; border: 1px solid rgba(127,119,221,0.25); border-radius: 16px; width: 420px; max-height: 80vh; overflow-y: auto; padding: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
.modal-header { display: flex; align-items: center; gap: 12px; padding-bottom: 14px; border-bottom: 1px solid; margin-bottom: 16px; }
.modal-ico { width: 44px; height: 44px; border-radius: 10px; background: color-mix(in srgb, var(--cor) 15%, transparent); border: 1px solid color-mix(in srgb, var(--cor) 40%, transparent); display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
.modal-title { font-size: 15px; font-weight: 700; }
.modal-sub { font-size: 11px; margin-top: 2px; }
.modal-close { margin-left: auto; background: none; border: none; color: #6B6B8A; font-size: 16px; cursor: pointer; flex-shrink: 0; }
.modal-close:hover { color: #DDD8FF; }
.modal-list { display: flex; flex-direction: column; gap: 8px; }
.modal-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(127,119,221,0.1); background: rgba(83,74,183,0.05); opacity: 0.5; transition: all 0.2s; }
.modal-item.unlocked { opacity: 1; border-color: rgba(52,211,153,0.2); background: rgba(52,211,153,0.05); }
.modal-nivel { font-size: 9px; font-weight: 700; letter-spacing: 1px; padding: 3px 7px; border-radius: 4px; color: #fff; flex-shrink: 0; }
.modal-item-ico { font-size: 20px; flex-shrink: 0; }
.modal-item-info { flex: 1; }
.modal-item-nome { font-size: 12px; font-weight: 600; }
.modal-item-desc { font-size: 10px; color: #6B6B8A; margin-top: 2px; }
.status-ok { font-size: 10px; color: #34D399; white-space: nowrap; }
.status-lock { font-size: 10px; color: #4E4B6B; white-space: nowrap; }

.skill-img-root {
  width: 34px;
  height: 34px;
  object-fit: contain;
}

.skill-img-child {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.skill-img-big {
  width: 90px;
  height: 90px;
  object-fit: contain;
}

.skill-img-active {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.skill-img-modal {
  width: 48px;
  height: 48px;
  object-fit: contain;
}
</style>
