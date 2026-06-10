// src/lib/iterop-api.js
import { supabase } from './supabase'

export const AVATAR_ID = '6e64904d-96bb-4236-b8f7-8501a668b5e8'

export const TIPOS_DE_EVENTO = {
  conhecimento: ['leitura', 'podcast', 'documentario', 'curso_online', 'palestra', 'workshop'],
  escola:       ['prova_aprovado', 'prova_reprovado', 'trabalho_entregue', 'apresentacao', 'formatura'],
  esporte:      ['corrida', 'musculacao', 'natacao', 'futebol', 'ciclismo', 'yoga', 'artes_marciais'],
  social:       ['voluntariado', 'clube', 'grupo_estudo', 'amigos', 'familia'],
  redes:        ['post_publicado', 'live_realizada', 'video_publicado', 'conquista_seguidores'],
  profissional: ['emprego_novo', 'promocao', 'freelance', 'projeto_entregue', 'certificado'],
  criatividade: ['musica', 'arte', 'escrita', 'fotografia', 'design', 'programacao_pessoal'],
  saude:        ['meditacao', 'sono_regulado', 'consulta_medica', 'habito_saudavel'],
  viagem:       ['viagem_nacional', 'viagem_internacional', 'evento_cultural'],
  conquista:    ['meta_batida', 'desafio_superado', 'habito_30dias', 'primeiro_lugar']
}

export async function buscarAvatar() {
  const { data, error } = await supabase
    .from('avatars')
    .select('*')
    .eq('id', AVATAR_ID)
    .single()
  if (error) throw new Error('Erro ao buscar avatar: ' + error.message)
  return data
}

export async function buscarHabilidades() {
  const { data, error } = await supabase
    .from('habilidades')
    .select('nome, pontos')
    .eq('avatar_id', AVATAR_ID)
    .order('pontos', { ascending: false })
  if (error) throw new Error('Erro ao buscar habilidades: ' + error.message)
  return data
}

export async function buscarEventos(limite = 20) {
  const { data, error } = await supabase
    .from('eventos')
    .select('tipo, titulo, descricao, data_evento, xp_gerado, verificado, fonte, criado_em')
    .eq('avatar_id', AVATAR_ID)
    .order('criado_em', { ascending: false })
    .limit(limite)
  if (error) throw new Error('Erro ao buscar eventos: ' + error.message)
  return data
}

export async function registrarEvento(tipo, titulo, data_evento, descricao = '', verificado = false, fonte = 'manual') {
  const { data, error } = await supabase
    .from('eventos')
    .insert({ avatar_id: AVATAR_ID, tipo, titulo, data_evento, descricao, verificado, fonte })
    .select()
    .single()
  if (error) throw new Error('Erro ao registrar evento: ' + error.message)
  return data
}

export async function importarEventosDePlataforma(plataforma) {
  const resultados = []
  for (const evento of plataforma.eventos) {
    const result = await registrarEvento(
      evento.tipo,
      evento.titulo,
      evento.data_evento,
      evento.descricao,
      true,
      plataforma.id
    )
    resultados.push(result)
    await new Promise(r => setTimeout(r, 400))
  }
  return resultados
}

export async function carregarTudo() {
  const [avatar, habilidades, eventos] = await Promise.all([
    buscarAvatar(),
    buscarHabilidades(),
    buscarEventos(10)
  ])
  return { avatar, habilidades, eventos }
}