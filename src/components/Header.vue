<script setup>
import { ref, onMounted } from 'vue'
import { CopyIcon } from '@lucide/vue'
import { buscarAvatar } from '@/lib/iterop-api'
import { useAvatarStore } from '@/stores/avatar'

const store = useAvatarStore()
const copiado = ref(false)

onMounted(async () => {
  if (!store.avatar) await store.carregar()
})

function copiarId() {
  if (!store.avatar?.id) return
  navigator.clipboard.writeText(store.avatar.id)
  copiado.value = true
  setTimeout(() => copiado.value = false, 2000)
}
</script>

<template>
  <header class="navbar">

    <!-- LINHA DE SCAN SUPERIOR -->
    <div class="navbar-scan"></div>

    <!-- LOGO -->
    <RouterLink to="/" class="navbar-logo">
      <img src="@/assets/logo.png" alt="Chronoverse" class="logo-img" />
    </RouterLink>

    <!-- NAV CENTRAL -->
    <nav class="navbar-nav">
      <RouterLink to="/"           class="nav-link">
        <span class="nav-ico">⊙</span> Início
      </RouterLink>
      <RouterLink to="/skilltree"  class="nav-link">
        <span class="nav-ico">✦</span> Skills
      </RouterLink>
      <RouterLink to="/missoes"    class="nav-link">
        <span class="nav-ico">◎</span> Missões
      </RouterLink>
      <RouterLink to="/events"     class="nav-link">
        <span class="nav-ico">⚡</span> Eventos
      </RouterLink>
      <RouterLink to="/timeline"   class="nav-link">
        <span class="nav-ico">⧗</span> Timeline
      </RouterLink>
      <RouterLink to="/inventario" class="nav-link">
        <span class="nav-ico">⊞</span> Inventário
      </RouterLink>
      <RouterLink to="/explore"    class="nav-link">
        <span class="nav-ico">🔗</span> Conexões
      </RouterLink>
    </nav>

    <!-- ÁREA DO USUÁRIO -->
    <div class="navbar-user">

      <!-- MOEDAS -->
      <div class="user-chip moedas-chip">
        <span class="moeda-ico">⬡</span>
        <span class="moeda-val">{{ store.avatar?.moedas ?? 0 }}</span>
      </div>

      <!-- NÍVEL -->
      <div class="user-chip nivel-chip">
        <span class="nivel-lbl">LVL</span>
        <span class="nivel-val">{{ store.avatar?.nivel ?? 1 }}</span>
      </div>

      <div class="navbar-divider"></div>

      <!-- IDENTIDADE -->
      <div class="user-identity">
        <div class="user-av">
          <img src="@/assets/profile.png" alt="avatar" class="user-av-img" />
          <div class="user-av-online"></div>
        </div>
        <div class="user-info">
          <span class="user-nome">{{ store.avatar?.nome ?? '...' }}</span>
          <div class="user-id" @click="copiarId">
            <span>{{ store.avatar?.id?.slice(0, 8) ?? 'X0d12Des' }}...</span>
            <CopyIcon class="w-2.5 h-2.5" />
            <span v-if="copiado" class="id-copied">✓</span>
          </div>
        </div>
      </div>

    </div>

    <!-- LINHA DE SCAN INFERIOR -->
    <div class="navbar-bottom-line"></div>
  </header>
</template>

<style scoped>
.navbar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0 10px;
  gap: 16px;
}

/* scan superior */
.navbar-scan {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(167,139,250,0.6) 30%,
    rgba(56,189,248,0.8) 50%,
    rgba(167,139,250,0.6) 70%,
    transparent 100%);
  animation: scan-move 6s ease-in-out infinite;
}
@keyframes scan-move {
  0%, 100% { opacity: 0.3; transform: scaleX(0.6); }
  50%       { opacity: 1;   transform: scaleX(1); }
}

/* linha inferior */
.navbar-bottom-line {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg,
    transparent,
    rgba(83,74,183,0.4) 20%,
    rgba(167,139,250,0.2) 50%,
    rgba(83,74,183,0.4) 80%,
    transparent);
}

/* LOGO */
.navbar-logo {
  text-decoration: none;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}
.logo-img {
  height: 48px;
  width: auto;
  object-fit: contain;
  mix-blend-mode: screen;
  filter: brightness(1.15) drop-shadow(0 0 8px rgba(56,189,248,0.3));
  transition: filter 0.3s;
}
.navbar-logo:hover .logo-img {
  filter: brightness(1.3) drop-shadow(0 0 16px rgba(56,189,248,0.6));
}

/* NAV */
.navbar-nav {
  display: flex;
  align-items: center;
  gap: 2px;
  background: rgba(83,74,183,0.06);
  border: 1px solid rgba(127,119,221,0.12);
  border-radius: 12px;
  padding: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 11px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 500;
  color: #6B6B8A;
  text-decoration: none;
  transition: all 0.2s;
  letter-spacing: 0.3px;
  white-space: nowrap;
  position: relative;
}
.nav-link:hover {
  color: #DDD8FF;
  background: rgba(83,74,183,0.15);
}
.nav-link.router-link-active {
  color: #DDD8FF;
  background: rgba(83,74,183,0.25);
  box-shadow: 0 0 12px rgba(167,139,250,0.15), inset 0 0 12px rgba(167,139,250,0.05);
}
.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 2px; left: 50%;
  transform: translateX(-50%);
  width: 14px; height: 2px;
  background: linear-gradient(90deg, #A78BFA, #38BDF8);
  border-radius: 1px;
}
.nav-ico {
  font-size: 12px;
  opacity: 0.7;
}

/* USUÁRIO */
.navbar-user {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 5px;
  border-radius: 8px;
  padding: 5px 10px;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid;
}

.moedas-chip {
  background: rgba(251,191,36,0.08);
  border-color: rgba(251,191,36,0.2);
  color: #FBBF24;
}
.moeda-ico { font-size: 12px; }
.moeda-val { font-size: 12px; }

.nivel-chip {
  background: rgba(167,139,250,0.08);
  border-color: rgba(167,139,250,0.2);
  gap: 3px;
}
.nivel-lbl { font-size: 8px; color: #6B6B8A; letter-spacing: 1px; }
.nivel-val { font-size: 13px; color: #A78BFA; }

.navbar-divider {
  width: 1px;
  height: 28px;
  background: rgba(127,119,221,0.15);
}

.user-identity {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(83,74,183,0.08);
  border: 1px solid rgba(127,119,221,0.15);
  border-radius: 10px;
  padding: 5px 10px 5px 6px;
  cursor: default;
  transition: all 0.2s;
}
.user-identity:hover {
  border-color: rgba(167,139,250,0.3);
  background: rgba(83,74,183,0.14);
}

.user-av {
  position: relative;
  width: 28px; height: 28px;
  flex-shrink: 0;
}
.user-av-img {
  width: 100%; height: 100%;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid rgba(167,139,250,0.3);
}
.user-av-online {
  position: absolute;
  bottom: -1px; right: -1px;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #34D399;
  border: 1.5px solid #04050D;
  box-shadow: 0 0 6px #34D399;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.user-nome {
  font-size: 11px;
  font-weight: 600;
  color: #DDD8FF;
  line-height: 1;
}
.user-id {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 9px;
  color: #4E4B6B;
  cursor: pointer;
  transition: color 0.2s;
}
.user-id:hover { color: #AFA9EC; }
.id-copied { color: #34D399; font-weight: 700; }
</style>