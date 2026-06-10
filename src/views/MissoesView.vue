<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAvatarStore } from '@/stores/avatar'

const store = useAvatarStore()
onMounted(() => { if (!store.avatar) store.carregar() })

const filtroAtivo = ref('todas')
const filtros = [
  { id: 'todas',      label: 'Todas',      icone: '⊞' },
  { id: 'diarias',    label: 'Diárias',    icone: '📅' },
  { id: 'semanais',   label: 'Semanais',   icone: '📆' },
  { id: 'eventos',    label: 'Eventos',    icone: '🎯' },
  { id: 'conquistas', label: 'Conquistas', icone: '🏆' },
]

const todasMissoes = [
  { id: 1,  tipo: 'diarias',    icone: '🎯', cor: '#A78BFA', titulo: 'Participar de um evento',      descricao: 'Participe de qualquer evento presencial ou online.',     xp: 100, progresso: 0, meta: 1, acao: '/explore' },
  { id: 2,  tipo: 'diarias',    icone: '👥', cor: '#38BDF8', titulo: 'Conectar com 3 pessoas',       descricao: 'Adicione ou interaja com 3 novos contatos.',             xp: 75,  progresso: 1, meta: 3, acao: '/explore' },
  { id: 3,  tipo: 'diarias',    icone: '📍', cor: '#34D399', titulo: 'Realizar check-in diário',     descricao: 'Faça seu check-in em um evento ou local.',               xp: 50,  progresso: 1, meta: 1, acao: '/' },
  { id: 4,  tipo: 'diarias',    icone: '📚', cor: '#FBBF24', titulo: 'Completar um curso',           descricao: 'Conclua qualquer curso ou trilha de aprendizado.',        xp: 150, progresso: 0, meta: 1, acao: '/explore' },
  { id: 5,  tipo: 'diarias',    icone: '🎯', cor: '#F472B6', titulo: 'Alcançar 80% em uma skill',    descricao: 'Evolua qualquer skill para pelo menos 80%.',             xp: 120, progresso: 0, meta: 1, acao: '/skilltree' },
  { id: 6,  tipo: 'semanais',   icone: '🎪', cor: '#A78BFA', titulo: 'Participar de 5 eventos',      descricao: 'Participe de 5 eventos diferentes esta semana.',         xp: 250, progresso: 2, meta: 5, acao: '/explore' },
  { id: 7,  tipo: 'semanais',   icone: '⚡', cor: '#FBBF24', titulo: 'Ganhar 500 XP',               descricao: 'Acumule 500 XP através de qualquer atividade.',          xp: 200, progresso: 230, meta: 500, acao: '/' },
  { id: 8,  tipo: 'semanais',   icone: '👫', cor: '#34D399', titulo: 'Interagir com 10 pessoas',     descricao: 'Interaja com 10 usuários diferentes.',                   xp: 150, progresso: 6, meta: 10, acao: '/explore' },
  { id: 9,  tipo: 'eventos',    icone: '🌍', cor: '#A78BFA', titulo: 'Explorador de Mundos',         descricao: 'Participe de 3 eventos diferentes em qualquer lugar.',  xp: 300, progresso: 2, meta: 3, destaque: true, acao: '/explore' },
  { id: 10, tipo: 'eventos',    icone: '🔗', cor: '#38BDF8', titulo: 'Mestre das Conexões',          descricao: 'Conecte pelo menos 5 plataformas externas.',             xp: 400, progresso: 1, meta: 5, acao: '/explore' },
  { id: 11, tipo: 'conquistas', icone: '🚀', cor: '#F472B6', titulo: 'Nível 10',                    descricao: 'Alcance o nível 10 no Chronoverse.',                     xp: 500, progresso: 0, meta: 10, acao: '/' },
  { id: 12, tipo: 'conquistas', icone: '✅', cor: '#34D399', titulo: 'Primeira Verificação',         descricao: 'Importe seu primeiro evento verificado de uma plataforma.', xp: 200, progresso: 0, meta: 1, acao: '/explore' },
]

const missaoDestaque = computed(() => todasMissoes.find(m => m.destaque) ?? todasMissoes[0])
const missoesFiltradas = computed(() => {
  if (filtroAtivo.value === 'todas') return todasMissoes.filter(m => !m.destaque)
  return todasMissoes.filter(m => m.tipo === filtroAtivo.value && !m.destaque)
})
const missoesDiarias  = computed(() => todasMissoes.filter(m => m.tipo === 'diarias').slice(0, 1))
const missoesSemanais = computed(() => todasMissoes.filter(m => m.tipo === 'semanais').slice(0, 3))

function progPct(m) { return Math.min(100, Math.round((m.progresso / m.meta) * 100)) }
function concluida(m) { return m.progresso >= m.meta }

const timer = ref('')
let timerInterval = null
function calcTimer() {
  const agora = new Date()
  const meia  = new Date(); meia.setHours(23, 59, 59, 999)
  const diff  = meia - agora
  const h = String(Math.floor(diff / 3600000)).padStart(2, '0')
  const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0')
  const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0')
  timer.value = `${h}h ${m}m ${s}s`
}
onMounted(() => { calcTimer(); timerInterval = setInterval(calcTimer, 1000) })
onUnmounted(() => clearInterval(timerInterval))
</script>

<template>
  <div class="missoes-root">

    <!-- SIDEBAR -->
    <aside class="sidebar">
      <div class="sidebar-brand">
        <span class="brand-logo">▼</span>
        <div>
          <div class="brand-title">AVATARES</div>
          <div class="brand-sub">INTEROPERÁVEIS</div>
        </div>
      </div>
      <nav class="sidebar-nav">
        <RouterLink to="/"          class="nav-item"><span>⊙</span> Início</RouterLink>
        <RouterLink to="/"          class="nav-item"><span>👤</span> Avatar</RouterLink>
        <RouterLink to="/skilltree" class="nav-item"><span>✦</span> Skills</RouterLink>
        <RouterLink to="/missoes"   class="nav-item active"><span>📅</span> Missões</RouterLink>
        <RouterLink to="/"          class="nav-item"><span>⊞</span> Inventário</RouterLink>
        <RouterLink to="/events"    class="nav-item"><span>⚡</span> Eventos</RouterLink>
        <RouterLink to="/"          class="nav-item"><span>★</span> Conquistas</RouterLink>
        <RouterLink to="/explore"   class="nav-item"><span>🌐</span> Rede Social</RouterLink>
        <RouterLink to="/"          class="nav-item"><span>⚙</span> Configurações</RouterLink>
      </nav>
      <div class="sidebar-footer">
        <div class="sf-avatar">
          <img src="@/assets/profile.png" alt="avatar" class="sf-img" />
          <div class="sf-pulse"></div>
        </div>
        <div class="sf-name">{{ store.avatar?.nome ?? 'Avatar' }}<span class="sf-tag">#2587</span></div>
        <div class="sf-level">NÍVEL {{ store.avatar?.nivel ?? 1 }}</div>
        <div class="sf-xp-bar">
          <div class="sf-xp-fill" :style="{ width: Math.min(100, ((store.avatar?.xp_total ?? 0) % 200) / 2) + '%' }"></div>
        </div>
        <div class="sf-xp-label">{{ (store.avatar?.xp_total ?? 0).toLocaleString('pt-BR') }} / {{ ((store.avatar?.nivel ?? 1) + 1) * 200 }} XP</div>
        <div class="sf-rep">
          <span class="sf-heart">♥</span>
          {{ store.habilidades?.find(h => h.nome === 'reputacao')?.pontos ?? 0 }}
          <span class="sf-rep-label">Reputação</span>
        </div>
      </div>
    </aside>

    <!-- MAIN -->
    <main class="main-area">
      <header class="topbar">
        <div>
          <h1 class="top-title">Missões</h1>
          <p class="top-sub">Complete desafios, ganhe XP e evolua seu avatar.</p>
        </div>
        <div class="top-stats">
          <div class="stat-chip">
            <div class="stat-ico">XP</div>
            <div>
              <div class="stat-label">XP</div>
              <div class="stat-val">{{ (store.avatar?.xp_total ?? 0).toLocaleString('pt-BR') }}</div>
            </div>
          </div>
          <div class="stat-chip rep-chip">
            <div class="stat-ico heart-ico">♥</div>
            <div>
              <div class="stat-label">Reputação</div>
              <div class="stat-val">{{ store.habilidades?.find(h => h.nome === 'reputacao')?.pontos ?? 0 }}</div>
            </div>
          </div>
          <button class="notif-btn">🔔</button>
        </div>
      </header>

      <div class="filtros-bar">
        <button
          v-for="f in filtros" :key="f.id"
          class="filtro-btn"
          :class="{ active: filtroAtivo === f.id }"
          @click="filtroAtivo = f.id"
        >{{ f.icone }} {{ f.label }}</button>
      </div>

      <div class="content-scroll">

        <!-- DESTAQUE -->
        <div class="destaque-card">
          <div class="destaque-info">
            <div class="destaque-tag">MISSÃO EM DESTAQUE</div>
            <h2 class="destaque-titulo">{{ missaoDestaque.titulo }}</h2>
            <p class="destaque-desc">{{ missaoDestaque.descricao }}</p>
            <div class="destaque-xp">
              <span class="xp-badge">XP</span>
              +{{ missaoDestaque.xp }} XP
            </div>
          </div>
          <div class="destaque-right">
            <div class="destaque-globe">🌍</div>
            <div class="destaque-prog-label">Progresso</div>
            <div class="destaque-prog-val">{{ missaoDestaque.progresso }}/{{ missaoDestaque.meta }}</div>
            <div class="destaque-bar">
              <div class="destaque-fill" :style="{ width: progPct(missaoDestaque) + '%' }"></div>
            </div>
            <RouterLink :to="missaoDestaque.acao" class="destaque-btn">Ver detalhes</RouterLink>
          </div>
        </div>

        <h3 class="section-title">TODAS AS MISSÕES</h3>

        <div class="missoes-lista">
          <div
            v-for="m in missoesFiltradas" :key="m.id"
            class="missao-item"
            :class="{ concluida: concluida(m) }"
          >
            <div class="missao-icone" :style="{ background: m.cor + '22', border: '1px solid ' + m.cor + '44' }">
              {{ m.icone }}
            </div>
            <div class="missao-info">
              <div class="missao-titulo">{{ m.titulo }}</div>
              <div class="missao-desc">{{ m.descricao }}</div>
              <div class="missao-bar-wrap">
                <div class="missao-bar">
                  <div class="missao-fill" :style="{ width: progPct(m) + '%', background: concluida(m) ? '#34D399' : m.cor }"></div>
                </div>
                <span class="missao-pct">{{ m.progresso }}/{{ m.meta }}</span>
              </div>
            </div>
            <div class="missao-xp">
              +{{ m.xp }} XP <span class="xp-badge-sm">XP</span>
            </div>
            <RouterLink :to="m.acao" class="missao-btn" :class="{ done: concluida(m) }">
              <span v-if="concluida(m)">✓</span>
              <span v-else>Ir agora</span>
            </RouterLink>
          </div>
        </div>

        <div class="mais-label">✦ Mais missões em breve. Fique ligado!</div>
      </div>
    </main>

    <!-- PAINEL DIREITO -->
    <aside class="right-panel">

      <div class="rp-section">
        <div class="rp-header">
          <span class="rp-title">MISSÃO DIÁRIA</span>
          <span class="rp-timer">{{ timer }}</span>
        </div>
        <div v-for="m in missoesDiarias" :key="m.id" class="rp-missao">
          <div class="rp-missao-ico" :style="{ background: m.cor + '22', border: '1px solid ' + m.cor + '44' }">
            {{ m.icone }}
          </div>
          <div class="rp-missao-info">
            <div class="rp-missao-titulo">{{ m.titulo }}</div>
            <div class="rp-missao-desc">{{ m.descricao }}</div>
            <div class="rp-bar">
              <div class="rp-fill" :style="{ width: progPct(m) + '%', background: m.cor }"></div>
            </div>
            <div class="rp-meta">{{ m.progresso }}/{{ m.meta }} <span class="rp-xp">+{{ m.xp }} XP</span></div>
          </div>
        </div>
        <RouterLink to="/missoes" class="rp-btn">Ver missão</RouterLink>
      </div>

      <div class="rp-section">
        <div class="rp-header">
          <span class="rp-title">MISSÕES SEMANAIS</span>
          <span class="rp-timer">Renova em 2d 10h</span>
        </div>
        <div v-for="m in missoesSemanais" :key="m.id" class="rp-missao-sm">
          <div class="rp-missao-ico-sm" :style="{ background: m.cor + '22', border: '1px solid ' + m.cor + '44' }">
            {{ m.icone }}
          </div>
          <div class="rp-missao-info">
            <div class="rp-missao-titulo">{{ m.titulo }}</div>
            <div class="rp-bar">
              <div class="rp-fill" :style="{ width: progPct(m) + '%', background: m.cor }"></div>
            </div>
          </div>
          <div class="rp-xp-badge">+{{ m.xp }} XP</div>
        </div>
        <RouterLink to="/missoes" class="rp-btn-ghost">Ver todas</RouterLink>
      </div>

      <div class="rp-section">
        <div class="rp-title rp-title-mb">RECOMPENSAS</div>
        <p class="rp-desc">Resgate recompensas ao completar missões e desafios.</p>
        <div class="chest-area">🎁</div>
        <RouterLink to="/" class="rp-btn">Ver recompensas</RouterLink>
      </div>

    </aside>
  </div>
</template>

<style scoped>
.missoes-root {
  display: grid;
  grid-template-columns: 200px 1fr 280px;
  height: 100vh;
  background: #07090F;
  color: #DDD8FF;
  font-family: 'Syne', 'Segoe UI', sans-serif;
  overflow: hidden;
}

/* SIDEBAR */
.sidebar {
  border-right: 1px solid rgba(127,119,221,0.12);
  background: rgba(83,74,183,0.04);
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  overflow-y: auto;
}
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px 16px;
  border-bottom: 1px solid rgba(127,119,221,0.1);
}
.brand-logo { font-size: 20px; color: #534AB7; }
.brand-title { font-size: 12px; font-weight: 800; letter-spacing: 2px; }
.brand-sub { font-size: 9px; color: #534AB7; letter-spacing: 2px; }
.sidebar-nav { padding: 8px 0; flex: 1; }
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  font-size: 12px;
  color: #6B6B8A;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
  border-left: 2px solid transparent;
}
.nav-item:hover { color: #AFA9EC; background: rgba(83,74,183,0.08); }
.nav-item.active { color: #DDD8FF; background: rgba(83,74,183,0.15); border-left-color: #7F77DD; }
.sidebar-footer {
  padding: 14px 16px;
  border-top: 1px solid rgba(127,119,221,0.1);
  text-align: center;
}
.sf-avatar { position: relative; width: 48px; height: 48px; margin: 0 auto 10px; }
.sf-img { width: 100%; height: 100%; border-radius: 50%; border: 2px solid #534AB7; object-fit: cover; }
.sf-pulse {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1px solid rgba(83,74,183,0.4);
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse { 0%,100%{transform:scale(1);opacity:.6} 50%{transform:scale(1.1);opacity:.2} }
.sf-name { font-size: 13px; font-weight: 700; }
.sf-tag { color: #534AB7; font-size: 11px; }
.sf-level { font-size: 9px; color: #7F77DD; letter-spacing: 1px; margin: 4px 0; }
.sf-xp-bar { height: 3px; background: rgba(127,119,221,0.15); border-radius: 2px; overflow: hidden; margin-bottom: 3px; }
.sf-xp-fill { height: 100%; background: linear-gradient(90deg, #534AB7, #7F77DD); border-radius: 2px; transition: width 0.6s; }
.sf-xp-label { font-size: 9px; color: #4E4B6B; margin-bottom: 8px; }
.sf-rep { font-size: 14px; font-weight: 700; color: #F472B6; }
.sf-heart { margin-right: 4px; }
.sf-rep-label { font-size: 10px; color: #6B6B8A; display: block; }

/* MAIN */
.main-area { display: flex; flex-direction: column; overflow: hidden; }
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(127,119,221,0.1);
  flex-shrink: 0;
}
.top-title { font-size: 24px; font-weight: 700; }
.top-sub { font-size: 11px; color: #6B6B8A; margin-top: 2px; }
.top-stats { display: flex; align-items: center; gap: 12px; }
.stat-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(83,74,183,0.1);
  border: 1px solid rgba(83,74,183,0.2);
  border-radius: 10px;
  padding: 8px 12px;
}
.stat-ico {
  width: 28px; height: 28px;
  border-radius: 8px;
  background: #534AB7;
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 800;
}
.rep-chip .stat-ico { background: #F472B6; }
.heart-ico { font-size: 14px; }
.stat-label { font-size: 9px; color: #6B6B8A; letter-spacing: 1px; }
.stat-val { font-size: 14px; font-weight: 700; }
.notif-btn { background: none; border: none; font-size: 20px; cursor: pointer; color: #6B6B8A; }

.filtros-bar {
  display: flex;
  gap: 4px;
  padding: 10px 20px;
  border-bottom: 1px solid rgba(127,119,221,0.08);
  flex-shrink: 0;
}
.filtro-btn {
  padding: 6px 14px;
  font-size: 11px; font-weight: 600;
  border: none; border-radius: 8px;
  background: rgba(83,74,183,0.08);
  color: #6B6B8A;
  cursor: pointer; font-family: inherit;
  transition: all 0.2s;
}
.filtro-btn:hover { background: rgba(83,74,183,0.15); color: #AFA9EC; }
.filtro-btn.active { background: #534AB7; color: #fff; }

.content-scroll { flex: 1; overflow-y: auto; padding: 20px; }

/* DESTAQUE */
.destaque-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, rgba(83,74,183,0.2) 0%, rgba(167,139,250,0.08) 100%);
  border: 1px solid rgba(127,119,221,0.25);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
}
.destaque-card::before {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 70% 50%, rgba(127,119,221,0.15) 0%, transparent 70%);
  pointer-events: none;
}
.destaque-tag { font-size: 10px; color: #A78BFA; letter-spacing: 2px; font-weight: 700; margin-bottom: 8px; }
.destaque-titulo { font-size: 22px; font-weight: 800; margin-bottom: 8px; }
.destaque-desc { font-size: 12px; color: #8585A8; line-height: 1.5; margin-bottom: 14px; max-width: 320px; }
.destaque-xp { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; color: #A78BFA; }
.xp-badge { background: #534AB7; color: #fff; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px; }
.destaque-right { text-align: center; min-width: 140px; z-index: 1; }
.destaque-globe { font-size: 52px; margin-bottom: 8px; }
.destaque-prog-label { font-size: 10px; color: #6B6B8A; letter-spacing: 1px; }
.destaque-prog-val { font-size: 20px; font-weight: 800; color: #DDD8FF; margin: 2px 0 8px; }
.destaque-bar { height: 4px; background: rgba(127,119,221,0.15); border-radius: 2px; overflow: hidden; margin-bottom: 12px; }
.destaque-fill { height: 100%; background: #A78BFA; border-radius: 2px; transition: width 0.6s; }
.destaque-btn {
  display: inline-block;
  padding: 8px 20px;
  background: rgba(83,74,183,0.3);
  border: 1px solid rgba(127,119,221,0.3);
  border-radius: 8px;
  font-size: 12px; color: #DDD8FF;
  text-decoration: none;
  transition: all 0.2s;
}
.destaque-btn:hover { background: rgba(83,74,183,0.5); }

/* LISTA */
.section-title { font-size: 11px; color: #4E4B6B; letter-spacing: 2px; font-weight: 700; margin-bottom: 12px; }
.missoes-lista { display: flex; flex-direction: column; gap: 8px; }
.missao-item {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(83,74,183,0.05);
  border: 1px solid rgba(127,119,221,0.1);
  border-radius: 12px;
  padding: 14px 16px;
  transition: all 0.2s;
}
.missao-item:hover { border-color: rgba(127,119,221,0.25); background: rgba(83,74,183,0.08); }
.missao-item.concluida { border-color: rgba(52,211,153,0.2); opacity: 0.7; }
.missao-icone {
  width: 42px; height: 42px;
  border-radius: 10px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
}
.missao-info { flex: 1; min-width: 0; }
.missao-titulo { font-size: 13px; font-weight: 600; margin-bottom: 2px; }
.missao-desc { font-size: 11px; color: #6B6B8A; margin-bottom: 8px; }
.missao-bar-wrap { display: flex; align-items: center; gap: 8px; }
.missao-bar { flex: 1; height: 4px; background: rgba(127,119,221,0.12); border-radius: 2px; overflow: hidden; }
.missao-fill { height: 100%; border-radius: 2px; transition: width 0.6s; }
.missao-pct { font-size: 10px; color: #6B6B8A; white-space: nowrap; }
.missao-xp { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; color: #A78BFA; white-space: nowrap; flex-shrink: 0; }
.xp-badge-sm { background: #534AB7; color: #fff; font-size: 8px; font-weight: 800; padding: 1px 5px; border-radius: 3px; }
.missao-btn {
  padding: 7px 16px;
  border-radius: 8px;
  font-size: 11px; font-weight: 600;
  background: rgba(83,74,183,0.15);
  border: 1px solid rgba(83,74,183,0.3);
  color: #AFA9EC;
  text-decoration: none; flex-shrink: 0;
  transition: all 0.2s; cursor: pointer;
}
.missao-btn:hover { background: rgba(83,74,183,0.3); }
.missao-btn.done { background: rgba(52,211,153,0.1); border-color: rgba(52,211,153,0.3); color: #34D399; }
.mais-label { text-align: center; font-size: 11px; color: #4E4B6B; margin-top: 20px; padding-bottom: 20px; }

/* PAINEL DIREITO */
.right-panel {
  border-left: 1px solid rgba(127,119,221,0.12);
  background: rgba(83,74,183,0.03);
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.rp-section {
  background: rgba(83,74,183,0.06);
  border: 1px solid rgba(127,119,221,0.1);
  border-radius: 12px;
  padding: 14px;
}
.rp-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.rp-title { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; color: #AFA9EC; }
.rp-title-mb { margin-bottom: 8px; }
.rp-timer { font-size: 10px; color: #A78BFA; font-weight: 600; }
.rp-missao { display: flex; gap: 10px; margin-bottom: 10px; }
.rp-missao-ico {
  width: 40px; height: 40px;
  border-radius: 10px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
}
.rp-missao-info { flex: 1; }
.rp-missao-titulo { font-size: 12px; font-weight: 600; margin-bottom: 3px; }
.rp-missao-desc { font-size: 10px; color: #6B6B8A; margin-bottom: 6px; line-height: 1.4; }
.rp-bar { height: 3px; background: rgba(127,119,221,0.12); border-radius: 2px; overflow: hidden; margin-bottom: 4px; }
.rp-fill { height: 100%; border-radius: 2px; transition: width 0.6s; }
.rp-meta { font-size: 10px; color: #6B6B8A; }
.rp-xp { color: #A78BFA; font-weight: 700; }
.rp-btn {
  display: block; width: 100%;
  padding: 9px;
  background: #534AB7; border: none;
  border-radius: 8px;
  color: #fff; font-size: 11px; font-weight: 700;
  text-align: center; text-decoration: none;
  cursor: pointer; font-family: inherit;
  transition: opacity 0.2s;
  margin-top: 8px;
}
.rp-btn:hover { opacity: 0.85; }
.rp-btn-ghost {
  display: block; width: 100%;
  padding: 8px;
  background: rgba(83,74,183,0.1);
  border: 1px solid rgba(83,74,183,0.2);
  border-radius: 8px;
  color: #AFA9EC; font-size: 11px;
  text-align: center; text-decoration: none;
  margin-top: 8px;
  transition: all 0.2s;
}
.rp-btn-ghost:hover { background: rgba(83,74,183,0.2); }
.rp-missao-sm { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.rp-missao-ico-sm {
  width: 32px; height: 32px;
  border-radius: 8px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px;
}
.rp-xp-badge { font-size: 11px; font-weight: 700; color: #A78BFA; white-space: nowrap; }
.rp-desc { font-size: 11px; color: #6B6B8A; line-height: 1.5; margin-bottom: 12px; }
.chest-area { text-align: center; font-size: 52px; margin: 8px 0 12px; }
</style>
