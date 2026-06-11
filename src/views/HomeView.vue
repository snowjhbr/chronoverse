<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Header from '@/components/Header.vue'
import Itens from '@/components/Itens.vue'
import { CopyIcon, CheckIcon, ZapIcon } from '@lucide/vue'
import { useAvatarStore } from '@/stores/avatar'

const store = useAvatarStore()
const copiado = ref(false)
const canvasRef = ref(null)
const gridRef = ref(null)
let animId = null
let ctx = null

onMounted(async () => {
  await store.carregar()
  initCanvas()
  window.addEventListener('resize', initCanvas)
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
  window.removeEventListener('resize', initCanvas)
})

function copiarId() {
  navigator.clipboard.writeText(store.avatar?.id || '')
  copiado.value = true
  setTimeout(() => copiado.value = false, 2000)
}

function formatarData(data) {
  if (!data) return '—'
  return new Date(data).toLocaleDateString('pt-BR')
}

function formatarDataEvento(data) {
  if (!data) return '—'
  const hoje = new Date().toISOString().slice(0, 10)
  if (data === hoje) return 'HOJE'
  return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR')
}

const xpProximoNivel = computed(() => ((store.avatar?.nivel ?? 0) + 1) * 200)
const xpPct = computed(() => {
  if (!store.avatar) return 0
  return Math.min(100, Math.round(((store.avatar.xp_total % 200) / 200) * 100))
})

const habilidadesOrdenadas = computed(() =>
  [...(store.habilidades ?? [])].sort((a, b) => b.pontos - a.pontos).slice(0, 4)
)

const coresEventos = ['#A78BFA', '#38BDF8', '#F472B6', '#34D399', '#FBBF24']
function corEvento(i) { return coresEventos[i % coresEventos.length] }
const eventosRecentes = computed(() => (store.eventos ?? []).slice(0, 5))

// ── CANVAS CYBERPUNK ───────────────────────────────────────────────────────
function initCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  ctx = canvas.getContext('2d')

  const cols = Math.floor(canvas.width / 28)
  const rows = Math.floor(canvas.height / 28)

  // nós da grade
  const nodes = []
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      if (Math.random() < 0.06) {
        nodes.push({
          x: c * 28 + 14,
          y: r * 28 + 14,
          alpha: Math.random(),
          alphaDir: Math.random() > 0.5 ? 0.005 : -0.005,
          size: Math.random() * 1.2 + 0.3,
          pulse: Math.random() * Math.PI * 2,
          color: Math.random() > 0.6 ? '#A78BFA' : Math.random() > 0.5 ? '#38BDF8' : '#534AB7'
        })
      }
    }
  }

  // fluxos de dados — linhas que percorrem a grade
  const flows = Array.from({ length: 18 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.8,
    vy: (Math.random() - 0.5) * 0.8,
    len: 40 + Math.random() * 80,
    alpha: Math.random() * 0.4 + 0.1,
    color: Math.random() > 0.5 ? '#A78BFA' : Math.random() > 0.5 ? '#38BDF8' : '#534AB7',
    trail: []
  }))

  // hexágonos decorativos
  const hexs = Array.from({ length: 6 }, (_, i) => ({
    x: (canvas.width / 7) * (i + 0.5),
    y: Math.random() * canvas.height,
    r: 30 + Math.random() * 50,
    alpha: 0.03 + Math.random() * 0.04,
    rot: Math.random() * Math.PI,
    rotSpeed: (Math.random() - 0.5) * 0.002,
    color: i % 3 === 0 ? '#A78BFA' : i % 3 === 1 ? '#38BDF8' : '#534AB7'
  }))

  function drawHex(cx, cy, r, rot) {
    ctx.beginPath()
    for (let i = 0; i < 6; i++) {
      const a = rot + (i * Math.PI) / 3
      const x = cx + r * Math.cos(a)
      const y = cy + r * Math.sin(a)
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.closePath()
  }

  // linhas de grade finas
  function drawGrid() {
    ctx.strokeStyle = 'rgba(83,74,183,0.04)'
    ctx.lineWidth = 0.5
    for (let x = 0; x < canvas.width; x += 28) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke()
    }
    for (let y = 0; y < canvas.height; y += 28) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke()
    }
  }

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // grade de fundo
    drawGrid()

    // hexágonos giratórios
    hexs.forEach(h => {
      h.rot += h.rotSpeed
      ctx.strokeStyle = h.color + Math.round(h.alpha * 255).toString(16).padStart(2, '0')
      ctx.lineWidth = 0.8
      drawHex(h.x, h.y, h.r, h.rot); ctx.stroke()
      drawHex(h.x, h.y, h.r * 0.7, -h.rot); ctx.stroke()
    })

    // nós pulsantes
    nodes.forEach(n => {
      n.pulse += 0.03
      n.alpha += n.alphaDir
      if (n.alpha > 0.8 || n.alpha < 0.05) n.alphaDir *= -1
      const glow = Math.abs(Math.sin(n.pulse)) * 6

      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glow + 2)
      grad.addColorStop(0, n.color + 'ff')
      grad.addColorStop(1, n.color + '00')
      ctx.beginPath()
      ctx.arc(n.x, n.y, glow + n.size, 0, Math.PI * 2)
      ctx.fillStyle = n.color + Math.round(n.alpha * 80).toString(16).padStart(2, '0')
      ctx.fill()
      ctx.beginPath()
      ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2)
      ctx.fillStyle = n.color + Math.round(n.alpha * 255).toString(16).padStart(2, '0')
      ctx.fill()
    })

    // fluxos de dados com trilha
    flows.forEach(f => {
      f.trail.push({ x: f.x, y: f.y })
      if (f.trail.length > f.len) f.trail.shift()
      f.x += f.vx; f.y += f.vy
      if (f.x < 0 || f.x > canvas.width) f.vx *= -1
      if (f.y < 0 || f.y > canvas.height) f.vy *= -1

      if (f.trail.length > 1) {
        for (let i = 1; i < f.trail.length; i++) {
          const t = i / f.trail.length
          ctx.beginPath()
          ctx.moveTo(f.trail[i-1].x, f.trail[i-1].y)
          ctx.lineTo(f.trail[i].x, f.trail[i].y)
          ctx.strokeStyle = f.color + Math.round(t * f.alpha * 255).toString(16).padStart(2, '0')
          ctx.lineWidth = t * 1.5
          ctx.stroke()
        }
        // cabeça brilhante
        const head = f.trail[f.trail.length - 1]
        ctx.beginPath()
        ctx.arc(head.x, head.y, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = f.color
        ctx.fill()
        const g = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 8)
        g.addColorStop(0, f.color + '88')
        g.addColorStop(1, f.color + '00')
        ctx.beginPath()
        ctx.arc(head.x, head.y, 8, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      }
    })

    animId = requestAnimationFrame(frame)
  }
  frame()
}
</script>

<template>
  <div class="home-root">
    <canvas ref="canvasRef" class="bg-canvas"></canvas>

    <!-- vinheta radial para profundidade -->
    <div class="vinheta"></div>

    <div class="home-content">
      <Header />

      <section class="grid-layout">

        <!-- ── COL ESQUERDA ────────────────────────────────── -->
        <div class="col-left">

          <!-- IDENTIDADE -->
          <div class="card card-identity">
            <div class="card-corner tl"></div>
            <div class="card-corner tr"></div>
            <div class="card-corner bl"></div>
            <div class="card-corner br"></div>
            <div class="scan-line"></div>
            <div class="card-label">⬡ IDENTIDADE</div>
            <div class="divider"></div>
            <div class="identity-body">
              <div class="av-wrap">
                <div class="av-hex">
                  <img src="@/assets/profile.png" alt="avatar" class="av-img" />
                </div>
                <div class="av-orbit av-orbit-1"></div>
                <div class="av-orbit av-orbit-2">
                  <div class="orbit-dot"></div>
                </div>
                <div class="av-glow"></div>
                <div class="av-status">● ONLINE</div>
              </div>
              <div class="id-data">
                <div class="id-field">
                  <span class="field-lbl">ID</span>
                  <div class="id-chip" @click="copiarId">
                    <span>{{ store.avatar?.id?.slice(0, 10) ?? '...' }}...</span>
                    <CopyIcon class="w-3 h-3" />
                    <span v-if="copiado" class="chip-ok">✓</span>
                  </div>
                </div>
                <div class="id-field">
                  <span class="field-lbl">NOME</span>
                  <span class="field-val">{{ store.avatar?.nome ?? '...' }}</span>
                </div>
                <div class="id-field">
                  <span class="field-lbl">MEMBRO DESDE</span>
                  <span class="field-val">{{ formatarData(store.avatar?.criado_em) }}</span>
                </div>
                <div class="id-field">
                  <span class="field-lbl">MOEDAS</span>
                  <span class="field-val gold">⬡ {{ store.avatar?.moedas ?? 0 }}</span>
                </div>
              </div>
            </div>
            <p class="id-motto">Seu avatar. Sua história. Seu mundo. Sua realidade.</p>
          </div>

          <!-- NÍVEL -->
          <div class="card card-nivel">
            <div class="card-corner tl"></div>
            <div class="card-corner tr"></div>
            <div class="card-label">◈ NÍVEL</div>
            <div class="divider"></div>
            <div class="nivel-grid">
              <div class="nivel-stat">
                <span class="n-lbl">NÍVEL ATUAL</span>
                <div class="n-big purple">
                  {{ store.avatar?.nivel ?? '—' }}
                  <div class="n-glow purple-glow"></div>
                </div>
              </div>
              <div class="nivel-stat">
                <span class="n-lbl">XP TOTAL</span>
                <div class="n-med blue">{{ (store.avatar?.xp_total ?? 0).toLocaleString('pt-BR') }}</div>
              </div>
              <div class="nivel-stat">
                <span class="n-lbl">PRÓXIMO NÍVEL</span>
                <div class="n-med green">{{ xpProximoNivel.toLocaleString('pt-BR') }}</div>
              </div>
            </div>
            <div class="xp-bar-wrap">
              <div class="xp-track">
                <div class="xp-fill" :style="{ width: xpPct + '%' }">
                  <div class="xp-head"></div>
                  <div class="xp-shimmer"></div>
                </div>
              </div>
              <span class="xp-pct">{{ xpPct }}%</span>
            </div>
          </div>

          <!-- HABILIDADES -->
          <div class="card card-hab">
            <div class="card-label">◆ HABILIDADES</div>
            <div class="divider"></div>
            <div class="hab-list">
              <div v-for="hab in habilidadesOrdenadas" :key="hab.nome" class="hab-row">
                <span class="hab-nome">{{ hab.nome.toUpperCase() }}</span>                <div class="hab-track">
                  <div class="hab-fill"
                    :style="{
                      width: hab.pontos + '%',
                      background: hab.pontos > 60
                        ? 'linear-gradient(90deg,#7C3AED,#A78BFA)'
                        : hab.pontos > 30
                          ? 'linear-gradient(90deg,#0369A1,#38BDF8)'
                          : 'linear-gradient(90deg,#065F46,#34D399)'
                    }">
                    <div class="hab-shine"></div>
                  </div>
                </div>
                <span class="hab-pts">{{ hab.pontos }}</span>
              </div>
            </div>
          </div>

          <Itens />
        </div>

        <!-- ── COL CENTRO ──────────────────────────────────── -->
        <div class="col-center">

          <!-- HERO AVATAR -->
          <div class="hero-wrap">
            <div class="hero-label">AVATAR INTEROPERÁVEL</div>
            <div class="hero-stage">
              <!-- anéis -->
              <div class="ring ring-1"></div>
              <div class="ring ring-2"></div>
              <div class="ring ring-3"></div>
              <!-- hologramas HUD -->
              <div class="hud hud-tl">
                <div class="hud-line"></div>
                <span>SYS.ONLINE</span>
              </div>
              <div class="hud hud-tr">
                <div class="hud-line"></div>
                <span>ID.VERIFIED</span>
              </div>
              <!-- plataforma base -->
              <div class="base-ring base-1"></div>
              <div class="base-ring base-2"></div>
              <div class="base-glow"></div>
              <!-- avatar -->
              <img src="@/assets/avatar-original.png" alt="avatar" class="hero-img" />
              <!-- chips flutuantes -->
              <div class="float-chip chip-xp">
                <ZapIcon class="w-3 h-3" />
                <span>{{ (store.avatar?.xp_total ?? 0).toLocaleString('pt-BR') }} XP</span>
              </div>
              <div class="float-chip chip-lvl">
                <span>LVL {{ store.avatar?.nivel ?? 1 }}</span>
              </div>
              <div class="float-chip chip-coin">
                <span>⬡ {{ store.avatar?.moedas ?? 0 }}</span>
              </div>
              <!-- scanner -->
              <div class="scanner"></div>
            </div>
          </div>

          <!-- SKILLS & CONQUISTAS -->
          <div class="card card-skills">
            <div class="card-label">✦ SKILLS & CONQUISTAS GLOBAIS</div>
            <div class="divider"></div>
            <div class="skills-grid">
              <div v-for="(hab, i) in habilidadesOrdenadas" :key="i" class="skill-orb">
                <div class="orb-outer" :style="{ '--cor': coresEventos[i] }">
                  <div class="orb-ring"></div>
                  <div class="orb-inner">
                    <span class="orb-val">{{ hab.pontos }}</span>
                  </div>
                </div>
                <span class="orb-lbl">{{ hab.nome.toUpperCase() }}</span>              </div>
            </div>
          </div>

          <!-- REGISTRAR -->
          <div class="card card-reg">
            <div class="card-label">+ REGISTRAR EXPERIÊNCIA</div>
            <div class="divider"></div>
            <div class="reg-btns">
              <RouterLink to="/events"  class="reg-btn primary">
                <span class="btn-icon">⚡</span> Novo Evento
              </RouterLink>
              <RouterLink to="/explore" class="reg-btn ghost">
                <span class="btn-icon">🔗</span> Conectar Plataforma
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- ── COL DIREITA ─────────────────────────────────── -->
        <div class="col-right">

          <!-- LINHA DO TEMPO -->
          <div class="card card-timeline">
            <div class="card-corner tl"></div>
            <div class="card-corner tr"></div>
            <div class="card-label">⧗ LINHA DO TEMPO</div>
            <div class="divider"></div>
            <div class="tl-list">
              <div v-if="!eventosRecentes.length" class="empty-msg">Nenhum evento ainda.</div>
              <div v-for="(ev, i) in eventosRecentes" :key="i" class="tl-item">
                <div class="tl-dot" :style="{ background: corEvento(i), boxShadow: '0 0 8px ' + corEvento(i) }"></div>
                <div class="tl-body">
                  <span class="tl-date">{{ formatarDataEvento(ev.data_evento) }}</span>
                  <span class="tl-title">{{ ev.titulo }}</span>
                  <span v-if="ev.verificado" class="tl-badge">✓ verificado</span>
                </div>
                <span class="tl-xp" :style="{ color: corEvento(i) }">+{{ ev.xp_gerado }}</span>
              </div>
            </div>
            <RouterLink to="/timeline" class="card-link">Ver tudo →</RouterLink>
          </div>

          <!-- EVENTOS -->
          <div class="card card-events">
            <div class="card-label">◎ EVENTOS</div>
            <div class="divider"></div>
            <div class="ev-list">
              <div v-if="!eventosRecentes.length" class="empty-msg">Nenhum evento registrado.</div>
              <div v-for="(ev, i) in eventosRecentes" :key="i" class="ev-item">
                <div class="ev-ico" :style="{ background: corEvento(i) + '22', border: '1px solid ' + corEvento(i) + '55' }">
                  <CheckIcon class="w-4 h-4" :style="{ color: corEvento(i) }" />
                </div>
                <div class="ev-body">
                  <span class="ev-title">{{ ev.titulo }}</span>
                  <span class="ev-tipo">{{ ev.tipo?.replace(/_/g, ' ') }}</span>
                </div>
                <span class="ev-xp">+{{ ev.xp_gerado }} XP</span>
              </div>
            </div>
            <RouterLink to="/events" class="card-link">Ver tudo →</RouterLink>
          </div>

          <!-- DESTINOS -->
          <div class="card card-destinos">
            <div class="card-label">🌐 DESTINOS & COMUNIDADES</div>
            <div class="divider"></div>
            <div class="destinos-row">
              <RouterLink to="/explore" v-for="i in 3" :key="i" class="destino-node">
                <div class="destino-hex">
                  <div class="destino-inner"></div>
                  <div class="destino-ring"></div>
                </div>
                <span class="destino-lbl">Destino {{ i }}</span>
                <span class="destino-sub">Comunidade</span>
              </RouterLink>
              <RouterLink to="/explore" class="destino-add">
                <span>+</span>
                <span class="add-lbl">EXPLORAR</span>
              </RouterLink>
            </div>
          </div>
        </div>

      </section>
    </div>
  </div>
</template>

<style scoped>
/* ── ROOT ───────────────────────────────────────────────────────────────── */
.home-root {
  min-height: 100vh;
  background: #04050D;
  color: #DDD8FF;
  font-family: 'Syne', 'Segoe UI', sans-serif;
  position: relative;
  overflow-x: hidden;
}

.bg-canvas {
  position: fixed; inset: 0;
  width: 100%; height: 100%;
  pointer-events: none; z-index: 0;
}

.vinheta {
  position: fixed; inset: 0;
  background: radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(4,5,13,0.85) 100%);
  pointer-events: none; z-index: 0;
}

.home-content {
  position: relative; z-index: 1;
  max-width: 1400px; margin: 0 auto;
  padding: 0 16px 40px;
}

.grid-layout {
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  gap: 14px;
  margin-top: 18px;
  align-items: start;
}

/* ── CARDS ──────────────────────────────────────────────────────────────── */
.card {
  background: rgba(10, 10, 24, 0.82);
  border: 1px solid rgba(127,119,221,0.18);
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 12px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(16px);
  transition: border-color 0.3s, box-shadow 0.3s;
}
.card:hover {
  border-color: rgba(167,139,250,0.35);
  box-shadow: 0 0 30px rgba(83,74,183,0.1), inset 0 0 30px rgba(83,74,183,0.03);
}
.card::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(83,74,183,0.07) 0%, transparent 55%);
  pointer-events: none;
}

/* cantos decorativos */
.card-corner {
  position: absolute;
  width: 10px; height: 10px;
  border-color: #534AB7;
  border-style: solid;
  opacity: 0.6;
}
.card-corner.tl { top: 0; left: 0; border-width: 1px 0 0 1px; }
.card-corner.tr { top: 0; right: 0; border-width: 1px 1px 0 0; }
.card-corner.bl { bottom: 0; left: 0; border-width: 0 0 1px 1px; }
.card-corner.br { bottom: 0; right: 0; border-width: 0 1px 1px 0; }

.scan-line {
  position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent 0%, #A78BFA 50%, transparent 100%);
  animation: scan-anim 4s ease-in-out infinite;
}
@keyframes scan-anim { 0%,100%{opacity:0.2;top:0%} 50%{opacity:1;top:100%} }

.card-label {
  font-size: 9px; letter-spacing: 2.5px;
  color: #534AB7; font-weight: 700; margin-bottom: 6px;
}
.divider {
  height: 1px;
  background: linear-gradient(90deg, rgba(167,139,250,0.3), transparent);
  margin-bottom: 12px;
}
.card-link {
  display: block; text-align: center; font-size: 11px;
  color: #6B6B8A; margin-top: 10px; padding: 6px;
  border: 1px solid rgba(127,119,221,0.12); border-radius: 8px;
  text-decoration: none; transition: all 0.2s;
}
.card-link:hover { color: #AFA9EC; background: rgba(83,74,183,0.1); }
.empty-msg { font-size: 11px; color: #4E4B6B; text-align: center; padding: 14px; }

/* ── IDENTIDADE ─────────────────────────────────────────────────────────── */
.identity-body { display: flex; gap: 14px; margin-bottom: 10px; }

.av-wrap { position: relative; width: 84px; height: 84px; flex-shrink: 0; }
.av-hex {
  width: 84px; height: 84px; border-radius: 18px; overflow: hidden;
  border: 2px solid rgba(167,139,250,0.5);
  box-shadow: 0 0 24px rgba(83,74,183,0.5), inset 0 0 16px rgba(83,74,183,0.15);
  position: relative; z-index: 2;
}
.av-img { width: 100%; height: 100%; object-fit: cover; }
.av-orbit {
  position: absolute; border-radius: 50%;
  border: 1px solid rgba(167,139,250,0.2);
}
.av-orbit-1 { inset: -8px; animation: spin 8s linear infinite; }
.av-orbit-2 { inset: -16px; animation: spin 14s linear infinite reverse; border-style: dashed; }
@keyframes spin { to { transform: rotate(360deg); } }
.orbit-dot {
  position: absolute; top: 50%; right: -3px;
  width: 6px; height: 6px; border-radius: 50%;
  background: #A78BFA; transform: translateY(-50%);
  box-shadow: 0 0 8px #A78BFA;
}
.av-glow {
  position: absolute; inset: -4px; border-radius: 20px;
  background: rgba(167,139,250,0.1);
  filter: blur(8px); z-index: 1;
  animation: pulse-glow 3s ease-in-out infinite;
}
@keyframes pulse-glow { 0%,100%{opacity:0.6} 50%{opacity:1} }
.av-status {
  position: absolute; bottom: -22px; left: 50%; transform: translateX(-50%);
  font-size: 8px; color: #34D399; white-space: nowrap; letter-spacing: 1px;
  text-shadow: 0 0 8px #34D399;
}

.id-data { flex: 1; display: flex; flex-direction: column; gap: 7px; padding-top: 2px; }
.id-field { display: flex; flex-direction: column; gap: 1px; }
.field-lbl { font-size: 8px; letter-spacing: 1.5px; color: #4E4B6B; }
.field-val { font-size: 11px; color: #DDD8FF; font-weight: 600; }
.field-val.gold { color: #FBBF24; text-shadow: 0 0 12px rgba(251,191,36,0.4); }
.id-chip {
  display: inline-flex; align-items: center; gap: 5px;
  background: rgba(83,74,183,0.18); border: 1px solid rgba(127,119,221,0.25);
  border-radius: 6px; padding: 3px 8px;
  font-size: 10px; color: #AFA9EC; cursor: pointer; transition: all 0.2s;
}
.id-chip:hover { background: rgba(83,74,183,0.3); border-color: rgba(167,139,250,0.4); }
.chip-ok { color: #34D399; }
.id-motto { font-size: 9px; color: #4E4B6B; letter-spacing: 0.5px; padding-top: 8px; border-top: 1px solid rgba(127,119,221,0.08); }

/* ── NÍVEL ───────────────────────────────────────────────────────────────── */
.nivel-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-bottom: 14px; }
.nivel-stat { text-align: center; }
.n-lbl { font-size: 8px; letter-spacing: 1px; color: #4E4B6B; display: block; margin-bottom: 4px; }
.n-big { font-size: 36px; font-weight: 800; display: block; position: relative; }
.n-med { font-size: 16px; font-weight: 700; display: block; margin-top: 4px; }
.n-big.purple { color: #A78BFA; text-shadow: 0 0 30px rgba(167,139,250,0.6); }
.n-med.blue { color: #38BDF8; text-shadow: 0 0 20px rgba(56,189,248,0.4); }
.n-med.green { color: #34D399; text-shadow: 0 0 20px rgba(52,211,153,0.4); }

.xp-bar-wrap { display: flex; align-items: center; gap: 8px; }
.xp-track {
  flex: 1; height: 8px;
  background: rgba(127,119,221,0.08);
  border-radius: 4px; overflow: hidden;
  border: 1px solid rgba(127,119,221,0.12);
}
.xp-fill {
  height: 100%;
  background: linear-gradient(90deg, #3730A3, #7C3AED, #A78BFA);
  border-radius: 4px; position: relative;
  transition: width 1s ease;
  box-shadow: 0 0 10px rgba(167,139,250,0.4);
}
.xp-head {
  position: absolute; right: -1px; top: 50%; transform: translateY(-50%);
  width: 10px; height: 10px; border-radius: 50%;
  background: #A78BFA; box-shadow: 0 0 12px #A78BFA;
}
.xp-shimmer {
  position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%);
  animation: shimmer 2s ease-in-out infinite;
  background-size: 200% 100%;
}
@keyframes shimmer { 0%{background-position:200%} 100%{background-position:-200%} }
.xp-pct { font-size: 10px; color: #A78BFA; font-weight: 700; width: 34px; text-align: right; }

/* ── HABILIDADES ─────────────────────────────────────────────────────────── */
.hab-list { display: flex; flex-direction: column; gap: 9px; }
.hab-row { display: flex; align-items: center; gap: 8px; }
.hab-nome { font-size: 8px; letter-spacing: 1px; color: #6B6B8A; width: 68px; flex-shrink: 0; }
.hab-track {
  flex: 1; height: 5px;
  background: rgba(127,119,221,0.08); border-radius: 3px; overflow: hidden;
  border: 1px solid rgba(127,119,221,0.08);
}
.hab-fill { height: 100%; border-radius: 3px; position: relative; transition: width 1s ease; }
.hab-shine {
  position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
  animation: shimmer 3s ease-in-out infinite;
  background-size: 200% 100%;
}
.hab-pts { font-size: 10px; color: #AFA9EC; width: 24px; text-align: right; flex-shrink: 0; }

/* ── HERO ────────────────────────────────────────────────────────────────── */
.hero-wrap { margin-bottom: 12px; }
.hero-label {
  text-align: center; font-size: 11px; font-weight: 700;
  letter-spacing: 3px; color: #AFA9EC; margin-bottom: 8px;
}
.hero-stage {
  position: relative; height: 320px;
  display: flex; align-items: flex-end; justify-content: center;
}

.ring {
  position: absolute; border-radius: 50%;
  border: 1px solid rgba(167,139,250,0.12);
  pointer-events: none;
}
.ring-1 { width: 220px; height: 220px; bottom: 20px; left: 50%; transform: translateX(-50%); animation: spin 12s linear infinite; }
.ring-2 { width: 290px; height: 290px; bottom: -10px; left: 50%; transform: translateX(-50%); animation: spin 20s linear infinite reverse; border-style: dashed; border-color: rgba(56,189,248,0.1); }
.ring-3 { width: 360px; height: 100px; bottom: 8px; left: 50%; transform: translateX(-50%); border-radius: 50%; border-color: rgba(83,74,183,0.08); }

.hud { position: absolute; display: flex; align-items: center; gap: 6px; font-size: 9px; letter-spacing: 1px; color: rgba(167,139,250,0.5); z-index: 5; }
.hud-tl { top: 30px; left: 10px; }
.hud-tr { top: 30px; right: 10px; }
.hud-line { width: 20px; height: 1px; background: rgba(167,139,250,0.3); }

.base-ring {
  position: absolute; border-radius: 50%;
  bottom: 0; left: 50%; transform: translateX(-50%);
}
.base-1 { width: 160px; height: 30px; border: 1px solid rgba(167,139,250,0.3); animation: pulse-glow 2s ease-in-out infinite; }
.base-2 { width: 220px; height: 40px; border: 1px solid rgba(167,139,250,0.1); animation: pulse-glow 2s ease-in-out infinite 0.5s; }
.base-glow {
  position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%);
  width: 160px; height: 60px;
  background: radial-gradient(ellipse, rgba(167,139,250,0.35) 0%, transparent 70%);
  filter: blur(12px);
}

.hero-img {
  position: relative; z-index: 3;
  height: 300px; object-fit: contain;
  filter: drop-shadow(0 0 30px rgba(167,139,250,0.4)) drop-shadow(0 0 60px rgba(83,74,183,0.2));
}

.float-chip {
  position: absolute; z-index: 10;
  display: flex; align-items: center; gap: 5px;
  background: rgba(10,10,24,0.88); backdrop-filter: blur(10px);
  border: 1px solid rgba(167,139,250,0.3); border-radius: 20px;
  padding: 5px 12px; font-size: 10px; color: #AFA9EC;
  box-shadow: 0 0 20px rgba(83,74,183,0.2);
}
.chip-xp  { top: 30px; left: 15px; animation: float 3s ease-in-out infinite; color: #A78BFA; }
.chip-lvl { top: 60px; right: 15px; animation: float 3s ease-in-out infinite 1s; color: #38BDF8; }
.chip-coin{ bottom: 50px; left: 20px; animation: float 3s ease-in-out infinite 2s; color: #FBBF24; }
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

.scanner {
  position: absolute; inset: 0; z-index: 4; pointer-events: none;
  background: linear-gradient(180deg, transparent 0%, rgba(167,139,250,0.04) 50%, transparent 100%);
  animation: scanner-anim 4s ease-in-out infinite;
}
@keyframes scanner-anim { 0%,100%{transform:translateY(-100%)} 50%{transform:translateY(100%)} }

/* ── SKILLS ORBS ─────────────────────────────────────────────────────────── */
.skills-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; }
.skill-orb { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.orb-outer {
  width: 64px; height: 64px; position: relative;
  display: flex; align-items: center; justify-content: center;
}
.orb-ring {
  position: absolute; inset: 0; border-radius: 50%;
  border: 2px solid var(--cor);
  opacity: 0.5; animation: spin 4s linear infinite;
  box-shadow: 0 0 10px var(--cor), inset 0 0 10px color-mix(in srgb, var(--cor) 20%, transparent);
}
.orb-inner {
  width: 48px; height: 48px; border-radius: 50%;
  background: color-mix(in srgb, var(--cor) 12%, rgba(10,10,24,0.9));
  border: 1px solid color-mix(in srgb, var(--cor) 40%, transparent);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 16px color-mix(in srgb, var(--cor) 20%, transparent);
}
.orb-val { font-size: 15px; font-weight: 800; color: var(--cor); text-shadow: 0 0 12px var(--cor); }
.orb-lbl { font-size: 8px; letter-spacing: 1px; color: #6B6B8A; text-align: center; word-break: break-word; max-width: 60px; line-height: 1.3; }
/* ── REGISTRAR ───────────────────────────────────────────────────────────── */
.reg-btns { display: flex; gap: 8px; }
.reg-btn {
  flex: 1; padding: 11px; border-radius: 10px; font-size: 11px;
  font-weight: 700; text-align: center; text-decoration: none;
  cursor: pointer; transition: all 0.2s; display: flex;
  align-items: center; justify-content: center; gap: 6px; letter-spacing: 0.5px;
}
.reg-btn.primary {
  background: linear-gradient(135deg, #3730A3, #534AB7);
  color: #fff; box-shadow: 0 0 24px rgba(83,74,183,0.35);
  border: 1px solid rgba(167,139,250,0.3);
}
.reg-btn.primary:hover { box-shadow: 0 0 36px rgba(83,74,183,0.55); transform: translateY(-1px); }
.reg-btn.ghost {
  background: rgba(83,74,183,0.08);
  border: 1px solid rgba(127,119,221,0.2); color: #AFA9EC;
}
.reg-btn.ghost:hover { background: rgba(83,74,183,0.18); }
.btn-icon { font-size: 14px; }

/* ── TIMELINE ────────────────────────────────────────────────────────────── */
.tl-list { display: flex; flex-direction: column; gap: 6px; }
.tl-item {
  display: flex; align-items: center; gap: 10px;
  padding: 7px 8px; border-radius: 8px;
  background: rgba(83,74,183,0.04); border: 1px solid rgba(127,119,221,0.07);
  transition: all 0.2s; cursor: default;
}
.tl-item:hover { background: rgba(83,74,183,0.1); border-color: rgba(127,119,221,0.18); transform: translateX(3px); }
.tl-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.tl-body { flex: 1; display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.tl-date { font-size: 8px; color: #4E4B6B; letter-spacing: 1px; }
.tl-title { font-size: 11px; color: #AFA9EC; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tl-badge { font-size: 8px; color: #34D399; letter-spacing: 0.5px; }
.tl-xp { font-size: 11px; font-weight: 700; flex-shrink: 0; }

/* ── EVENTOS ─────────────────────────────────────────────────────────────── */
.ev-list { display: flex; flex-direction: column; gap: 6px; }
.ev-item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px; border-radius: 10px;
  background: rgba(83,74,183,0.04); border: 1px solid rgba(127,119,221,0.07);
  transition: all 0.2s; cursor: default;
}
.ev-item:hover { transform: translateX(3px); background: rgba(83,74,183,0.1); border-color: rgba(127,119,221,0.18); }
.ev-ico {
  width: 32px; height: 32px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.ev-body { flex: 1; min-width: 0; }
.ev-title { font-size: 11px; color: #DDD8FF; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ev-tipo { font-size: 9px; color: #4E4B6B; }
.ev-xp { font-size: 11px; font-weight: 700; color: #34D399; flex-shrink: 0; white-space: nowrap; }

/* ── DESTINOS ────────────────────────────────────────────────────────────── */
.destinos-row { display: flex; gap: 8px; align-items: flex-start; flex-wrap: wrap; }
.destino-node {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  text-decoration: none; transition: all 0.2s;
}
.destino-node:hover { transform: translateY(-3px); }
.destino-hex {
  width: 52px; height: 52px; border-radius: 50%; position: relative;
  display: flex; align-items: center; justify-content: center;
}
.destino-inner {
  width: 40px; height: 40px; border-radius: 50%;
  background: radial-gradient(circle, rgba(83,74,183,0.3), rgba(10,10,24,0.8));
  border: 1px solid rgba(127,119,221,0.3);
  background-image: url('@/assets/profile.png');
  background-size: cover; background-position: center;
  filter: hue-rotate(60deg) saturate(1.5);
}
.destino-ring {
  position: absolute; inset: 0; border-radius: 50%;
  border: 1px solid rgba(167,139,250,0.25); animation: spin 6s linear infinite;
}
.destino-lbl { font-size: 9px; color: #AFA9EC; font-weight: 600; }
.destino-sub { font-size: 8px; color: #4E4B6B; }
.destino-add {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  text-decoration: none; cursor: pointer;
  width: 52px;
}
.destino-add span:first-child {
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(83,74,183,0.06); border: 1px dashed rgba(127,119,221,0.25);
  display: flex; align-items: center; justify-content: center;
  color: #534AB7; font-size: 20px; transition: all 0.2s;
}
.destino-add:hover span:first-child { background: rgba(83,74,183,0.18); border-color: #A78BFA; color: #A78BFA; }
.add-lbl { font-size: 8px; color: #4E4B6B; letter-spacing: 1px; }
</style>