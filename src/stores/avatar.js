import { defineStore } from 'pinia'
import { ref } from 'vue'
import { carregarTudo } from '@/lib/iterop-api'

export const useAvatarStore = defineStore('avatar', () => {
  const avatar           = ref(null)
  const habilidades      = ref([])
  const eventos          = ref([])
  const carregando       = ref(false)
  const plataformasConectadas = ref(
    JSON.parse(localStorage.getItem('plataformas_conectadas') || '[]')
  )

  async function carregar() {
    carregando.value = true
    const dados = await carregarTudo()
    avatar.value      = dados.avatar
    habilidades.value = dados.habilidades
    eventos.value     = dados.eventos
    carregando.value  = false
  }

  function conectarPlataforma(id) {
    if (!plataformasConectadas.value.includes(id)) {
      plataformasConectadas.value.push(id)
      localStorage.setItem('plataformas_conectadas', JSON.stringify(plataformasConectadas.value))
    }
  }

  function desconectarPlataforma(id) {
    plataformasConectadas.value = plataformasConectadas.value.filter(p => p !== id)
    localStorage.setItem('plataformas_conectadas', JSON.stringify(plataformasConectadas.value))
  }

  function estaConectada(id) {
    return plataformasConectadas.value.includes(id)
  }

  return {
    avatar, habilidades, eventos, carregando,
    plataformasConectadas,
    carregar, conectarPlataforma, desconectarPlataforma, estaConectada
  }
})