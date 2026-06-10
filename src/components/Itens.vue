<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAvatarStore } from '@/stores/avatar'

const store = useAvatarStore()
onMounted(() => { if (!store.avatar) store.carregar() })

const itemSelecionado = ref(null)
const comprando = ref(false)
const feedback = ref('')

// Catálogo da loja — itens compráveis com moedas
const catalogo = [
  { id: 1,  nome: 'Jaqueta Holográfica', icone: '🧥', preco: 30,  categoria: 'cosmetico', descricao: 'Visual holográfico exclusivo para seu avatar.', cor: '#A78BFA' },
  { id: 2,  nome: 'Espada de Energia',   icone: '⚔️', preco: 50,  categoria: 'arma',      descricao: 'Lâmina de plasma com brilho neon.', cor: '#34D399' },
  { id: 3,  nome: 'Núcleo de Dados',     icone: '🔮', preco: 40,  categoria: 'acessorio', descricao: 'Cristal que amplifica sua presença digital.', cor: '#F472B6' },
  { id: 4,  nome: 'Botas Tech',          icone: '👟', preco: 25,  categoria: 'cosmetico', descricao: 'Tênis com propulsores de velocidade.', cor: '#38BDF8' },
  { id: 5,  nome: 'Escudo Quantico',     icone: '🛡️', preco: 60,  categoria: 'defesa',    descricao: 'Barreira energética contra instabilidades.', cor: '#FBBF24' },
  { id: 6,  nome: 'Óculos AR',           icone: '🥽', preco: 35,  categoria: 'acessorio', descricao: 'Realidade aumentada integrada à visão.', cor: '#A78BFA' },
  { id: 7,  nome: 'Capa Neural',         icone: '🦾', preco: 45,  categoria: 'cosmetico', descricao: 'Interface neural wearable de última geração.', cor: '#34D399' },
  { id: 8,  nome: 'Drone Companion',     icone: '🚁', preco: 80,  categoria: 'especial',  descricao: 'Companheiro autônomo que acompanha seu avatar.', cor: '#F472B6' },
]

const itensComprados = ref(
  JSON.parse(localStorage.getItem('itens_comprados') || '[]')
)

const moedas = computed(() => store.avatar?.moedas ?? 0)

function jaComprou(id) {
  return itensComprados.value.includes(id)
}

async function comprar(item) {
  if (jaComprou(item.id)) return
  if (moedas.value < item.preco) {
    feedback.value = 'Moedas insuficientes!'
    setTimeout(() => feedback.value = '', 2500)
    return
  }

  comprando.value = item.id
  try {
    // Deduz moedas no Supabase
    const { supabase } = await import('@/lib/supabase')
    const { AVATAR_ID } = await import('@/lib/iterop-api')
    await supabase
      .from('avatars')
      .update({ moedas: moedas.value - item.preco })
      .eq('id', AVATAR_ID)

    // Salva item comprado localmente
    itensComprados.value.push(item.id)
    localStorage.setItem('itens_comprados', JSON.stringify(itensComprados.value))

    // Recarrega dados do avatar
    await store.carregar()

    feedback.value = `✓ ${item.nome} adquirido!`
    itemSelecionado.value = null
  } catch (e) {
    feedback.value = 'Erro ao comprar. Tente novamente.'
  } finally {
    comprando.value = false
    setTimeout(() => feedback.value = '', 3000)
  }
}

const itensPossuidos = computed(() =>
  catalogo.filter(i => jaComprou(i.id))
)
</script>

<template>
  <div class="border-2 border-[#16162A] bg-[#0F0F1E] rounded-lg p-2.5 shadow-lg mb-5">

    <!-- CABEÇALHO -->
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-md font-thin">EQUIPAMENTOS & COSMÉTICOS</h3>
      <div class="flex items-center gap-1.5 bg-[#1a1a30] px-3 py-1 rounded-full text-xs">
        <span class="text-[#FFB347]">⬡</span>
        <span class="text-[#FFB347] font-bold">{{ moedas }}</span>
        <span class="text-[#505070]">moedas</span>
      </div>
    </div>
    <span class="block mb-3 w-full h-px bg-[#16162A]"></span>

    <!-- ITENS POSSUÍDOS -->
    <div v-if="itensPossuidos.length > 0" class="mb-4">
      <div class="text-[10px] text-[#505070] tracking-widest mb-2">EQUIPADO</div>
      <div class="grid grid-cols-4 gap-3">
        <div
          v-for="item in itensPossuidos.slice(0, 4)" :key="item.id"
          @click="itemSelecionado = item"
          class="hover:scale-95 transition-all cursor-pointer"
        >
          <div class="w-full aspect-square rounded-lg flex items-center justify-center text-2xl"
            :style="{ background: item.cor + '22', border: '1px solid ' + item.cor + '44' }">
            {{ item.icone }}
          </div>
          <span class="text-[10px] block text-center mt-1 text-[#A0A0C0] truncate">{{ item.nome }}</span>
        </div>
      </div>
    </div>

    <!-- SLOTS VAZIOS se não tiver itens -->
    <div v-else class="grid grid-cols-4 gap-3 mb-4">
      <div v-for="i in 4" :key="i" class="hover:scale-95 transition-all cursor-pointer opacity-40">
        <div class="w-full aspect-square rounded-lg bg-[#2A2A4A] animate-pulse flex items-center justify-center">
          <span class="text-[#3a3a5a] text-lg">?</span>
        </div>
        <span class="text-[10px] block text-center mt-1 text-[#505070]">Vazio</span>
      </div>
    </div>

    <!-- LOJA -->
    <div>
      <div class="text-[10px] text-[#505070] tracking-widest mb-2">LOJA — COMPRAR COM MOEDAS</div>
      <div class="text-[9px] text-[#3a3a5a] mb-3">
        Moedas são ganhas apenas em eventos verificados por plataformas conectadas.
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div
          v-for="item in catalogo" :key="item.id"
          @click="itemSelecionado = item"
          class="flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all"
          :class="jaComprou(item.id)
            ? 'border-[#3DFFB4]/30 bg-[#3DFFB4]/05 opacity-60'
            : moedas >= item.preco
              ? 'border-[#16162A] hover:border-[#534AB7]/50 hover:bg-[#1a1a30]'
              : 'border-[#16162A] opacity-40 cursor-not-allowed'"
        >
          <div class="w-8 h-8 rounded-lg flex items-center justify-center text-lg shrink-0"
            :style="{ background: item.cor + '22', border: '1px solid ' + item.cor + '33' }">
            {{ item.icone }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-[11px] font-medium truncate">{{ item.nome }}</div>
            <div class="text-[10px]" :class="jaComprou(item.id) ? 'text-[#3DFFB4]' : moedas >= item.preco ? 'text-[#FFB347]' : 'text-[#505070]'">
              {{ jaComprou(item.id) ? '✓ Adquirido' : '⬡ ' + item.preco + ' moedas' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FEEDBACK -->
    <div v-if="feedback" class="mt-3 text-center text-xs py-2 rounded-lg"
      :class="feedback.includes('✓') ? 'text-[#3DFFB4] bg-[#3DFFB4]/10' : 'text-[#FF6B6B] bg-[#FF6B6B]/10'">
      {{ feedback }}
    </div>

    <!-- MODAL DO ITEM -->
    <div v-if="itemSelecionado"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      @click.self="itemSelecionado = null">
      <div class="bg-[#0F0F1E] border-2 border-[#16162A] rounded-xl p-6 w-72 shadow-2xl">
        <div class="flex flex-col items-center gap-3 mb-4">
          <div class="w-20 h-20 rounded-xl flex items-center justify-center text-4xl"
            :style="{ background: itemSelecionado.cor + '22', border: '2px solid ' + itemSelecionado.cor + '55' }">
            {{ itemSelecionado.icone }}
          </div>
          <div class="text-center">
            <div class="font-bold text-lg">{{ itemSelecionado.nome }}</div>
            <div class="text-[10px] tracking-widest uppercase mt-0.5"
              :style="{ color: itemSelecionado.cor }">{{ itemSelecionado.categoria }}</div>
          </div>
        </div>

        <p class="text-xs text-[#A0A0C0] text-center mb-4 leading-relaxed">{{ itemSelecionado.descricao }}</p>

        <div v-if="!jaComprou(itemSelecionado.id)">
          <div class="flex items-center justify-between mb-3 text-sm">
            <span class="text-[#A0A0C0]">Preço</span>
            <span class="text-[#FFB347] font-bold">⬡ {{ itemSelecionado.preco }} moedas</span>
          </div>
          <div class="flex items-center justify-between mb-4 text-sm">
            <span class="text-[#A0A0C0]">Suas moedas</span>
            <span :class="moedas >= itemSelecionado.preco ? 'text-[#3DFFB4]' : 'text-[#FF6B6B]'" class="font-bold">
              ⬡ {{ moedas }}
            </span>
          </div>

          <button
            @click="comprar(itemSelecionado)"
            :disabled="moedas < itemSelecionado.preco || comprando === itemSelecionado.id"
            class="w-full py-2.5 rounded-lg font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            :style="{ background: itemSelecionado.cor, color: '#fff' }"
          >
            {{ comprando === itemSelecionado.id ? 'Comprando...' : moedas < itemSelecionado.preco ? 'Moedas insuficientes' : 'Comprar agora' }}
          </button>
          <div v-if="moedas < itemSelecionado.preco" class="text-[10px] text-[#505070] text-center mt-2">
            Conecte plataformas para ganhar moedas com eventos verificados.
          </div>
        </div>

        <div v-else class="text-center">
          <div class="text-[#3DFFB4] font-medium mb-3">✓ Item adquirido!</div>
          <div class="text-xs text-[#A0A0C0]">Este item já está no seu inventário.</div>
        </div>

        <button @click="itemSelecionado = null"
          class="w-full mt-3 py-2 rounded-lg text-xs text-[#A0A0C0] border border-[#16162A] hover:bg-[#1a1a30] transition-all">
          Fechar
        </button>
      </div>
    </div>

  </div>
</template>
