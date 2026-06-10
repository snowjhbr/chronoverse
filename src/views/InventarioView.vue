<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAvatarStore } from '@/stores/avatar'

const store = useAvatarStore()
onMounted(() => { if (!store.avatar) store.carregar() })

const filtroAtivo  = ref('todos')
const ordenacao    = ref('raridade')
const itemAtivo    = ref(null)
const ordenacaoOpen = ref(false)

const filtros = [
  { id: 'todos',        label: 'Todos',        icone: '⊞' },
  { id: 'equipamentos', label: 'Equipamentos', icone: '✏️' },
  { id: 'cosmeticos',   label: 'Cosméticos',   icone: '👕' },
  { id: 'consumiveis',  label: 'Consumíveis',  icone: '🧪' },
  { id: 'recursos',     label: 'Recursos',     icone: '📦' },
  { id: 'colecionaveis',label: 'Colecionáveis',icone: '☆' },
]

const ordenacoes = [
  { id: 'raridade', label: 'Raridade' },
  { id: 'nome',     label: 'Nome' },
  { id: 'recente',  label: 'Mais recente' },
]

// Catálogo de itens
const todosItens = ref([
  { id: 1,  nome: 'Jaqueta Holo',      tipo: 'equipamentos', raridade: 'ÉPICO',   icone: '🧥', quantidade: 1,  cor: '#A78BFA',
    atributos: [{ label: 'XP ganho', valor: '+15%' }, { label: 'Reputação', valor: '+10%' }, { label: 'Resistência', valor: '+5%' }],
    desc: 'Jaqueta com tecnologia holográfica que se adapta ao seu estilo e aumenta sua presença digital.',
    equipadoPor: true },
  { id: 2,  nome: 'Tênis Vórtice',     tipo: 'equipamentos', raridade: 'ÉPICO',   icone: '👟', quantidade: 1,  cor: '#A78BFA',
    atributos: [{ label: 'Velocidade', valor: '+20%' }, { label: 'Foco', valor: '+8%' }],
    desc: 'Calçado com propulsores de velocidade integrados para maior mobilidade digital.', equipadoPor: false },
  { id: 3,  nome: 'Cristal de XP',     tipo: 'recursos',     raridade: 'ÉPICO',   icone: '💎', quantidade: 15, cor: '#A78BFA',
    atributos: [{ label: 'XP bonus', valor: '+500' }],
    desc: 'Cristal energético que concede uma explosão de experiência ao ser consumido.', equipadoPor: false },
  { id: 4,  nome: 'Fone Nebuloso',     tipo: 'cosmeticos',   raridade: 'RARO',    icone: '🎧', quantidade: 1,  cor: '#38BDF8',
    atributos: [{ label: 'Carisma', valor: '+12%' }, { label: 'Criatividade', valor: '+8%' }],
    desc: 'Fone com realidade aumentada que amplifica percepção musical e social.', equipadoPor: false },
  { id: 5,  nome: 'Caixa de Energia',  tipo: 'consumiveis',  raridade: 'RARO',    icone: '📦', quantidade: 3,  cor: '#38BDF8',
    atributos: [{ label: 'Energia', valor: '+100%' }],
    desc: 'Caixa misteriosa com itens aleatórios de raridade variável.', equipadoPor: false },
  { id: 6,  nome: 'Óculos Cibernético',tipo: 'cosmeticos',   raridade: 'RARO',    icone: '🥽', quantidade: 1,  cor: '#38BDF8',
    atributos: [{ label: 'Percepção', valor: '+18%' }, { label: 'Inteligência', valor: '+10%' }],
    desc: 'Óculos AR com interface neural para análise em tempo real do ambiente.', equipadoPor: false },
  { id: 7,  nome: 'Token de Evento',   tipo: 'recursos',     raridade: 'RARO',    icone: '🏅', quantidade: 7,  cor: '#38BDF8',
    atributos: [{ label: 'Acesso', valor: 'Eventos VIP' }],
    desc: 'Token que garante acesso prioritário a eventos exclusivos da plataforma.', equipadoPor: false },
  { id: 8,  nome: 'Poção de XP',       tipo: 'consumiveis',  raridade: 'INCOMUM', icone: '🧪', quantidade: 5,  cor: '#34D399',
    atributos: [{ label: 'XP bonus', valor: '+200' }],
    desc: 'Poção alquímica que concede uma dose concentrada de experiência.', equipadoPor: false },
  { id: 9,  nome: 'Emblema de Honra',  tipo: 'colecionaveis',raridade: 'INCOMUM', icone: '🛡️', quantidade: 2,  cor: '#34D399',
    atributos: [{ label: 'Reputação', valor: '+5%' }],
    desc: 'Emblema concedido a usuários que demonstraram conduta exemplar.', equipadoPor: false },
  { id: 10, nome: 'Spray Grafite',     tipo: 'cosmeticos',   raridade: 'INCOMUM', icone: '🎨', quantidade: 3,  cor: '#34D399',
    atributos: [{ label: 'Criatividade', valor: '+15%' }],
    desc: 'Spray digital para personalizar ambientes e deixar sua marca.', equipadoPor: false },
  { id: 11, nome: 'Fragmento Tech',    tipo: 'recursos',     raridade: 'COMUM',   icone: '🔧', quantidade: 12, cor: '#6B6B8A',
    atributos: [{ label: 'Crafting', valor: '+1 material' }],
    desc: 'Fragmento tecnológico usado para crafting de equipamentos avançados.', equipadoPor: false },
  { id: 12, nome: 'Bateria de Energia',tipo: 'consumiveis',  raridade: 'COMUM',   icone: '🔋', quantidade: 8,  cor: '#6B6B8A',
    atributos: [{ label: 'Stamina', valor: '+50%' }],
    desc: 'Bateria de alta capacidade para recarregar habilidades esgotadas.', equipadoPor: false },
  { id: 13, nome: 'Moeda Nexus',       tipo: 'recursos',     raridade: 'COMUM',   icone: '🪙', quantidade: 25, cor: '#FBBF24',
    atributos: [{ label: 'Valor', valor: '1 Nexus' }],
    desc: 'Moeda digital universal aceita em todos os mercados do Chronoverse.', equipadoPor: false },
  { id: 14, nome: 'Chip de Dados',     tipo: 'recursos',     raridade: 'COMUM',   icone: '💾', quantidade: 10, cor: '#6B6B8A',
    atributos: [{ label: 'Armazenamento', valor: '+10 slots' }],
    desc: 'Chip de memória que expande a capacidade de armazenamento do avatar.', equipadoPor: false },
  { id: 15, nome: 'Chave de Acesso',   tipo: 'colecionaveis',raridade: 'COMUM',   icone: '🗝️', quantidade: 4,  cor: '#6B6B8A',
    atributos: [{ label: 'Acesso', valor: 'Área secreta' }],
    desc: 'Chave misteriosa que abre portas para áreas escondidas da plataforma.', equipadoPor: false },
])

const raridades = { 'ÉPICO': 0, 'RARO': 1, 'INCOMUM': 2, 'COMUM': 3 }
const coresRaridade = { 'ÉPICO': '#A78BFA', 'RARO': '#38BDF8', 'INCOMUM': '#34D399', 'COMUM': '#6B6B8A' }

const itensFiltrados = computed(() => {
  let lista = filtroAtivo.value === 'todos'
    ? todosItens.value
    : todosItens.value.filter(i => i.tipo === filtroAtivo.value)

  if (ordenacao.value === 'raridade') lista = [...lista].sort((a, b) => raridades[a.raridade] - raridades[b.raridade])
  if (ordenacao.value === 'nome')     lista = [...lista].sort((a, b) => a.nome.localeCompare(b.nome))
  return lista
})

const itemSelecionado = computed(() => itemAtivo.value ?? todosItens.value[0])

function equipar(item) {
  todosItens.value.forEach(i => { if (i.tipo === item.tipo) i.equipadoPor = false })
  item.equipadoPor = true
  itemAtivo.value = { ...item }
}

onMounted(() => { itemAtivo.value = todosItens.value[0] })

const totalItens  = computed(() => todosItens.value.reduce((s, i) => s + i.quantidade, 0))
const moedas      = computed(() => store.avatar?.moedas ?? 0)
</script>

<template>
  <div class="inv-root">

    <!-- SIDEBAR -->
    <aside class="sidebar">
      <div class="sidebar-brand">
        <span class="brand-logo">▼</span>
        <div>
          <div class="brand-title">AVATARES</div>
          <div class="brand-sub">INTEROPERÁVEIS</div>
        </div>
      </div>

      <div class="sidebar-avatar">
        <div class="av-ring">
          <img src="@/assets/profile.png" alt="avatar" class="av-img" />
          <div class="av-online"></div>
        </div>
        <div class="av-name">{{ store.avatar?.nome ?? 'Avatar' }}<span class="av-tag">#2587</span></div>
        <div class="av-badge">NÍVEL {{ store.avatar?.nivel ?? 1 }}</div>
        <div class="av-xp-bar"><div class="av-xp-fill" :style="{ width: Math.min(100, ((store.avatar?.xp_total ?? 0) % 200) / 2) + '%' }"></div></div>
        <div class="av-xp-label">{{ (store.avatar?.xp_total ?? 0).toLocaleString('pt-BR') }} / {{ ((store.avatar?.nivel ?? 1) + 1) * 200 }} XP</div>
      </div>

      <nav class="sidebar-nav">
        <RouterLink to="/"           class="nav-item"><span>⊙</span> Início</RouterLink>
        <RouterLink to="/"           class="nav-item"><span>👤</span> Avatar</RouterLink>
        <RouterLink to="/skilltree"  class="nav-item"><span>✦</span> Skills</RouterLink>
        <RouterLink to="/missoes"    class="nav-item"><span>📅</span> Missões</RouterLink>
        <RouterLink to="/inventario" class="nav-item active"><span>⊞</span> Inventário</RouterLink>
        <RouterLink to="/"           class="nav-item"><span>★</span> Conquistas</RouterLink>
        <RouterLink to="/events"     class="nav-item"><span>⚡</span> Eventos</RouterLink>
        <RouterLink to="/explore"    class="nav-item"><span>🌐</span> Rede Social</RouterLink>
        <RouterLink to="/"           class="nav-item"><span>⚙</span> Configurações</RouterLink>
      </nav>

      <div class="sidebar-footer">
        <div class="rep-label">REPUTAÇÃO</div>
        <div class="rep-val">
          <span class="rep-heart">♥</span>
          {{ store.habilidades?.find(h => h.nome === 'reputacao')?.pontos ?? 0 }}
        </div>
        <RouterLink to="/" class="ver-perfil">Ver perfil <span>→</span></RouterLink>
      </div>

      <div class="sidebar-bottom">
        <button class="sb-btn">☀</button>
        <button class="sb-btn">?</button>
        <button class="sb-btn">↪</button>
      </div>
    </aside>

    <!-- MAIN -->
    <main class="main-area">

      <!-- TOPBAR -->
      <header class="topbar">
        <div>
          <h1 class="top-title">Inventário</h1>
          <p class="top-sub">Seus itens, equipamentos e recursos adquiridos.</p>
        </div>
        <div class="top-stats">
          <div class="stat-chip xp-chip">
            <div class="stat-ico xp-ico">XP</div>
            <div class="stat-val">{{ (store.avatar?.xp_total ?? 0).toLocaleString('pt-BR') }}</div>
          </div>
          <div class="stat-chip rep-chip">
            <div class="stat-ico rep-ico">♥</div>
            <div class="stat-val">{{ store.habilidades?.find(h => h.nome === 'reputacao')?.pontos ?? 0 }}</div>
          </div>
          <div class="stat-chip moeda-chip">
            <div class="stat-ico moeda-ico">⬡</div>
            <div class="stat-val">{{ moedas }}</div>
          </div>
          <button class="notif-btn">🔔</button>
        </div>
      </header>

      <!-- FILTROS -->
      <div class="filtros-bar">
        <button v-for="f in filtros" :key="f.id"
          class="filtro-btn" :class="{ active: filtroAtivo === f.id }"
          @click="filtroAtivo = f.id">
          {{ f.icone }} {{ f.label }}
        </button>
      </div>

      <!-- CONTEÚDO -->
      <div class="content-scroll">

        <!-- HEADER DA GRADE -->
        <div class="grade-header">
          <span class="grade-titulo">TODOS OS ITENS</span>
          <div class="ordenacao-wrap">
            <button class="ordenacao-btn" @click="ordenacaoOpen = !ordenacaoOpen">
              Ordenar por: {{ ordenacoes.find(o => o.id === ordenacao)?.label }} ▾
            </button>
            <div v-if="ordenacaoOpen" class="ordenacao-dropdown">
              <button v-for="o in ordenacoes" :key="o.id"
                class="ord-item" :class="{ active: ordenacao === o.id }"
                @click="ordenacao = o.id; ordenacaoOpen = false">
                {{ o.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- GRADE DE ITENS -->
        <div class="itens-grid">
          <div v-for="item in itensFiltrados" :key="item.id"
            class="item-card"
            :class="{ selecionado: itemSelecionado?.id === item.id, [item.raridade.toLowerCase()]: true }"
            :style="{ '--cor': coresRaridade[item.raridade] }"
            @click="itemAtivo = item">
            <div class="item-qtd" v-if="item.quantidade > 1">{{ item.quantidade }}</div>
            <div class="item-icone">{{ item.icone }}</div>
            <div class="item-nome">{{ item.nome }}</div>
            <div class="item-raridade" :style="{ color: coresRaridade[item.raridade] }">{{ item.raridade }}</div>
          </div>
        </div>

        <!-- ESPAÇO DE INVENTÁRIO -->
        <div class="espaco-bar">
          <div class="espaco-ico">📦</div>
          <div class="espaco-info">
            <div class="espaco-titulo">Espaço de inventário</div>
            <div class="espaco-sub">{{ totalItens }} / 100 itens utilizados</div>
          </div>
          <div class="espaco-prog">
            <div class="espaco-fill" :style="{ width: Math.min(100, totalItens) + '%' }"></div>
          </div>
          <button class="espaco-btn">Aumentar espaço</button>
        </div>

      </div>
    </main>

    <!-- PAINEL DIREITO -->
    <aside class="right-panel" v-if="itemSelecionado">
      <div class="rp-header">
        <div>
          <h2 class="rp-nome">{{ itemSelecionado.nome }}</h2>
          <div class="rp-meta">
            <span class="rp-raridade" :style="{ color: coresRaridade[itemSelecionado.raridade] }">{{ itemSelecionado.raridade }}</span>
            <span class="rp-dot">•</span>
            <span class="rp-tipo">{{ filtros.find(f => f.id === itemSelecionado.tipo)?.label ?? itemSelecionado.tipo }}</span>
          </div>
        </div>
        <button class="rp-lock">🔒</button>
      </div>

      <!-- IMAGEM DO ITEM -->
      <div class="rp-item-img" :style="{ '--cor': coresRaridade[itemSelecionado.raridade] }">
        <div class="rp-item-glow"></div>
        <div class="rp-item-ico">{{ itemSelecionado.icone }}</div>
      </div>

      <!-- ATRIBUTOS -->
      <div class="rp-section-label">ATRIBUTOS</div>
      <div class="rp-atributos">
        <div v-for="(atr, i) in itemSelecionado.atributos" :key="i" class="atr-chip" :style="{ '--cor': coresRaridade[itemSelecionado.raridade] }">
          <div class="atr-valor">{{ atr.valor }}</div>
          <div class="atr-label">{{ atr.label }}</div>
        </div>
      </div>

      <!-- DESCRIÇÃO -->
      <div class="rp-section-label" style="margin-top:14px">DESCRIÇÃO</div>
      <p class="rp-desc">{{ itemSelecionado.desc }}</p>

      <!-- EQUIPADO POR -->
      <div class="rp-section-label" style="margin-top:14px">EQUIPADO POR</div>
      <div v-if="itemSelecionado.equipadoPor" class="rp-equipado">
        <img src="@/assets/profile.png" alt="avatar" class="rp-av-img" />
        <div>
          <div class="rp-av-nome">{{ store.avatar?.nome ?? 'Avatar' }}<span style="color:#534AB7">#2587</span></div>
          <div class="rp-av-nivel">Nível {{ store.avatar?.nivel ?? 1 }}</div>
        </div>
      </div>
      <div v-else class="rp-nao-equipado">Nenhum avatar equipando este item</div>

      <!-- BOTÕES -->
      <div class="rp-botoes">
        <button class="btn-equipar" :style="{ '--cor': coresRaridade[itemSelecionado.raridade] }" @click="equipar(itemSelecionado)">
          👕 {{ itemSelecionado.equipadoPor ? 'Equipado' : 'Equipar' }}
        </button>
        <button class="btn-detalhes">ℹ Detalhes</button>
      </div>
    </aside>

  </div>
</template>

<style scoped>
.inv-root {
  display: grid;
  grid-template-columns: 210px 1fr 300px;
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
  display: flex; flex-direction: column;
  padding: 16px 0; overflow-y: auto;
}
.sidebar-brand { display: flex; align-items: center; gap: 8px; padding: 0 16px 14px; border-bottom: 1px solid rgba(127,119,221,0.1); }
.brand-logo { font-size: 20px; color: #534AB7; }
.brand-title { font-size: 12px; font-weight: 800; letter-spacing: 2px; }
.brand-sub { font-size: 9px; color: #534AB7; letter-spacing: 2px; }
.sidebar-avatar { padding: 14px 16px; border-bottom: 1px solid rgba(127,119,221,0.08); text-align: center; }
.av-ring { width: 64px; height: 64px; border-radius: 50%; border: 2px solid #534AB7; box-shadow: 0 0 16px rgba(83,74,183,0.4); overflow: hidden; margin: 0 auto 8px; position: relative; }
.av-img { width: 100%; height: 100%; object-fit: cover; }
.av-online { position: absolute; bottom: 2px; right: 2px; width: 10px; height: 10px; background: #34D399; border-radius: 50%; border: 2px solid #07090F; }
.av-name { font-size: 13px; font-weight: 700; }
.av-tag { color: #534AB7; }
.av-badge { font-size: 9px; color: #7F77DD; background: rgba(83,74,183,0.2); border-radius: 100px; padding: 2px 8px; display: inline-block; margin: 4px 0; letter-spacing: 1px; }
.av-xp-bar { height: 3px; background: rgba(127,119,221,0.15); border-radius: 2px; overflow: hidden; margin-bottom: 3px; }
.av-xp-fill { height: 100%; background: linear-gradient(90deg, #534AB7, #A78BFA); border-radius: 2px; transition: width 0.6s; }
.av-xp-label { font-size: 9px; color: #4E4B6B; }
.sidebar-nav { padding: 8px 0; flex: 1; }
.nav-item { display: flex; align-items: center; gap: 10px; padding: 8px 16px; font-size: 12px; color: #6B6B8A; cursor: pointer; text-decoration: none; transition: all 0.2s; border-left: 2px solid transparent; }
.nav-item:hover { color: #AFA9EC; background: rgba(83,74,183,0.08); }
.nav-item.active { color: #DDD8FF; background: rgba(83,74,183,0.15); border-left-color: #A78BFA; }
.sidebar-footer { padding: 12px 16px; border-top: 1px solid rgba(127,119,221,0.1); }
.rep-label { font-size: 9px; letter-spacing: 2px; color: #4E4B6B; margin-bottom: 4px; }
.rep-val { font-size: 20px; font-weight: 700; color: #F472B6; }
.rep-heart { margin-right: 4px; }
.ver-perfil { display: flex; align-items: center; gap: 4px; font-size: 11px; color: #6B6B8A; text-decoration: none; margin-top: 6px; transition: color 0.2s; }
.ver-perfil:hover { color: #AFA9EC; }
.sidebar-bottom { display: flex; gap: 8px; padding: 10px 16px; border-top: 1px solid rgba(127,119,221,0.08); }
.sb-btn { background: none; border: none; color: #4E4B6B; font-size: 16px; cursor: pointer; padding: 4px; transition: color 0.2s; }
.sb-btn:hover { color: #AFA9EC; }

/* MAIN */
.main-area { display: flex; flex-direction: column; overflow: hidden; }
.topbar { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid rgba(127,119,221,0.1); flex-shrink: 0; }
.top-title { font-size: 24px; font-weight: 700; }
.top-sub { font-size: 11px; color: #6B6B8A; margin-top: 2px; }
.top-stats { display: flex; align-items: center; gap: 8px; }
.stat-chip { display: flex; align-items: center; gap: 6px; background: rgba(83,74,183,0.1); border: 1px solid rgba(83,74,183,0.2); border-radius: 10px; padding: 6px 10px; }
.stat-ico { width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 800; color: #fff; }
.xp-ico   { background: #534AB7; }
.rep-ico  { background: #F472B6; font-size: 12px; }
.moeda-ico{ background: #FBBF24; color: #1a1a00; }
.stat-val { font-size: 14px; font-weight: 700; }
.notif-btn { background: none; border: none; font-size: 20px; cursor: pointer; color: #6B6B8A; }
.filtros-bar { display: flex; gap: 4px; padding: 10px 20px; border-bottom: 1px solid rgba(127,119,221,0.08); flex-shrink: 0; }
.filtro-btn { padding: 6px 14px; font-size: 11px; font-weight: 600; border: none; border-radius: 8px; background: rgba(83,74,183,0.08); color: #6B6B8A; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.filtro-btn:hover { background: rgba(83,74,183,0.15); color: #AFA9EC; }
.filtro-btn.active { background: #534AB7; color: #fff; }
.content-scroll { flex: 1; overflow-y: auto; padding: 16px 20px; }

/* GRADE */
.grade-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.grade-titulo { font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #4E4B6B; }
.ordenacao-wrap { position: relative; }
.ordenacao-btn { background: rgba(83,74,183,0.08); border: 1px solid rgba(127,119,221,0.15); border-radius: 8px; color: #AFA9EC; font-size: 11px; padding: 5px 12px; cursor: pointer; font-family: inherit; }
.ordenacao-dropdown { position: absolute; right: 0; top: 110%; background: #0F0F1E; border: 1px solid rgba(127,119,221,0.2); border-radius: 8px; overflow: hidden; z-index: 10; min-width: 130px; }
.ord-item { display: block; width: 100%; padding: 8px 14px; font-size: 11px; color: #AFA9EC; background: none; border: none; text-align: left; cursor: pointer; font-family: inherit; transition: background 0.2s; }
.ord-item:hover { background: rgba(83,74,183,0.15); }
.ord-item.active { color: #DDD8FF; background: rgba(83,74,183,0.2); }

.itens-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 16px; }
.item-card {
  background: rgba(83,74,183,0.06);
  border: 1px solid rgba(127,119,221,0.1);
  border-radius: 12px; padding: 12px 8px;
  cursor: pointer; position: relative;
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  transition: all 0.2s;
}
.item-card:hover { border-color: var(--cor); background: rgba(83,74,183,0.12); transform: translateY(-2px); }
.item-card.selecionado { border-color: var(--cor); background: color-mix(in srgb, var(--cor) 10%, transparent); box-shadow: 0 0 16px color-mix(in srgb, var(--cor) 20%, transparent); }
.item-qtd { position: absolute; top: 6px; right: 8px; font-size: 10px; font-weight: 700; color: #DDD8FF; }
.item-icone { font-size: 28px; }
.item-nome { font-size: 10px; font-weight: 600; text-align: center; color: #DDD8FF; line-height: 1.3; }
.item-raridade { font-size: 9px; font-weight: 700; letter-spacing: 0.5px; }

/* ESPAÇO */
.espaco-bar { display: flex; align-items: center; gap: 12px; background: rgba(83,74,183,0.06); border: 1px solid rgba(127,119,221,0.1); border-radius: 12px; padding: 14px 16px; }
.espaco-ico { font-size: 24px; }
.espaco-info { flex: 1; }
.espaco-titulo { font-size: 12px; font-weight: 600; }
.espaco-sub { font-size: 10px; color: #6B6B8A; }
.espaco-prog { flex: 1; height: 4px; background: rgba(127,119,221,0.12); border-radius: 2px; overflow: hidden; }
.espaco-fill { height: 100%; background: #534AB7; border-radius: 2px; transition: width 0.6s; }
.espaco-btn { padding: 8px 16px; background: #534AB7; border: none; border-radius: 8px; color: #fff; font-size: 11px; font-weight: 600; cursor: pointer; font-family: inherit; white-space: nowrap; transition: opacity 0.2s; }
.espaco-btn:hover { opacity: 0.85; }

/* PAINEL DIREITO */
.right-panel { border-left: 1px solid rgba(127,119,221,0.12); background: rgba(83,74,183,0.03); padding: 20px 16px; overflow-y: auto; }
.rp-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
.rp-nome { font-size: 20px; font-weight: 800; margin-bottom: 4px; }
.rp-meta { display: flex; align-items: center; gap: 6px; font-size: 12px; }
.rp-raridade { font-weight: 700; }
.rp-dot { color: #4E4B6B; }
.rp-tipo { color: #8585A8; }
.rp-lock { background: rgba(83,74,183,0.1); border: 1px solid rgba(127,119,221,0.2); border-radius: 8px; padding: 6px 8px; cursor: pointer; font-size: 14px; }
.rp-item-img {
  width: 100%; aspect-ratio: 1;
  background: radial-gradient(ellipse at 50% 60%, color-mix(in srgb, var(--cor) 20%, transparent) 0%, transparent 70%);
  border: 1px solid color-mix(in srgb, var(--cor) 20%, transparent);
  border-radius: 16px; margin-bottom: 16px;
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
}
.rp-item-glow { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 60%; height: 30%; background: color-mix(in srgb, var(--cor) 30%, transparent); border-radius: 50%; filter: blur(20px); }
.rp-item-ico { font-size: 80px; z-index: 1; }
.rp-section-label { font-size: 9px; letter-spacing: 2px; color: #534AB7; font-weight: 700; margin-bottom: 8px; }
.rp-atributos { display: flex; gap: 8px; flex-wrap: wrap; }
.atr-chip { background: color-mix(in srgb, var(--cor) 10%, transparent); border: 1px solid color-mix(in srgb, var(--cor) 25%, transparent); border-radius: 8px; padding: 8px 12px; flex: 1; min-width: 70px; text-align: center; }
.atr-valor { font-size: 14px; font-weight: 800; color: #DDD8FF; }
.atr-label { font-size: 9px; color: #6B6B8A; margin-top: 2px; }
.rp-desc { font-size: 12px; color: #8585A8; line-height: 1.6; }
.rp-equipado { display: flex; align-items: center; gap: 10px; background: rgba(83,74,183,0.08); border-radius: 10px; padding: 10px; }
.rp-av-img { width: 36px; height: 36px; border-radius: 50%; border: 1px solid #534AB7; object-fit: cover; }
.rp-av-nome { font-size: 13px; font-weight: 700; }
.rp-av-nivel { font-size: 10px; color: #6B6B8A; }
.rp-nao-equipado { font-size: 11px; color: #4E4B6B; padding: 10px; background: rgba(83,74,183,0.05); border-radius: 8px; text-align: center; }
.rp-botoes { display: flex; gap: 8px; margin-top: 20px; }
.btn-equipar { flex: 1; padding: 11px; background: var(--cor, #534AB7); border: none; border-radius: 10px; color: #fff; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; letter-spacing: 0.5px; transition: opacity 0.2s; }
.btn-equipar:hover { opacity: 0.85; }
.btn-detalhes { flex: 1; padding: 11px; background: rgba(83,74,183,0.1); border: 1px solid rgba(83,74,183,0.25); border-radius: 10px; color: #AFA9EC; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.btn-detalhes:hover { background: rgba(83,74,183,0.2); }
</style>