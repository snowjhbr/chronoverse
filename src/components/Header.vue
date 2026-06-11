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
  <header class="header">

    <!-- LOGO -->
    <RouterLink to="/" class="logo-wrap">
      <img src="@/assets/logo.png" alt="Chronoverse" class="logo-img" />
    </RouterLink>

    <!-- NAVEGAÇÃO CENTRAL -->
    <nav class="nav">
      <RouterLink to="/"           class="nav-item">Início</RouterLink>
      <RouterLink to="/skilltree"  class="nav-item">✦ Skills</RouterLink>
      <RouterLink to="/missoes"    class="nav-item">📅 Missões</RouterLink>
      <RouterLink to="/events"     class="nav-item">Eventos</RouterLink>
      <RouterLink to="/timeline"   class="nav-item">Timeline</RouterLink>
      <RouterLink to="/inventario" class="nav-item">Inventário</RouterLink>
      <RouterLink to="/explore"    class="nav-item">Conexões</RouterLink>
    </nav>

    <!-- USUÁRIO -->
    <div class="user-area">
      <span class="user-label">
        CONECTADO COMO <span class="user-name">{{ avatar?.nome ?? '...' }}</span>
      </span>
      <div class="divider-v"></div>
      <div @click="copiarId" class="id-chip">
        <span>{{ avatar?.id ? avatar.id.slice(0, 10) + '...' : 'X0d12Des...' }}</span>
        <CopyIcon class="w-3.5 h-3.5" />
        <span v-if="copiado" class="copied">✓</span>
      </div>
    </div>

  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0 8px;
  border-bottom: 1px solid rgba(127,119,221,0.1);
  position: relative;
}

/* linha de scan no rodapé do header */
.header::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(167,139,250,0.4), transparent);
  animation: scan-h 4s ease-in-out infinite;
}
@keyframes scan-h { 0%,100%{opacity:0.3} 50%{opacity:1} }

.logo-wrap {
  text-decoration: none;
  display: flex;
  align-items: center;
}

.logo-img {
  height: 90px;
  width: auto;
  object-fit: contain;
  /* remove o fundo preto da imagem com mix-blend-mode */
  mix-blend-mode: screen;
  filter: brightness(1.1);
}

.nav {
  display: flex;
  align-items: center;
  gap: 2px;
}

.nav-item {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 11px;
  color: #6B6B8A;
  text-decoration: none;
  transition: all 0.2s;
  letter-spacing: 0.3px;
  position: relative;
}
.nav-item:hover {
  color: #DDD8FF;
  background: rgba(83,74,183,0.12);
}
.nav-item.router-link-active {
  color: #DDD8FF;
  background: rgba(83,74,183,0.18);
}
.nav-item.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 2px; left: 50%; transform: translateX(-50%);
  width: 16px; height: 2px;
  background: #A78BFA;
  border-radius: 1px;
}

.user-area {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  color: #6B6B8A;
}

.user-label { white-space: nowrap; }
.user-name { color: #DDD8FF; font-weight: 600; }

.divider-v {
  width: 1px;
  height: 24px;
  background: rgba(127,119,221,0.15);
}

.id-chip {
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(83,74,183,0.1);
  border: 1px solid rgba(127,119,221,0.15);
  border-radius: 8px;
  padding: 4px 10px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.id-chip:hover {
  background: rgba(83,74,183,0.2);
  border-color: rgba(167,139,250,0.3);
}
.copied { color: #34D399; font-weight: 700; }
</style>