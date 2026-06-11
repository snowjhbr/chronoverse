// src/lib/plataformas.js
import linkedinLogo  from '@/assets/logos/linkedinlogo.png'
import instagramLogo from '@/assets/logos/instagramlogo.png'
import githubLogo    from '@/assets/logos/githublogo.png'
import stravaLogo    from '@/assets/logos/stravalogo.png'
import duolingoLogo  from '@/assets/logos/duolingologo.png'
import unifapLogo    from '@/assets/logos/unifaplogo.png'
import courseraLogo  from '@/assets/logos/courseralogo.png'
import symplalogo  from '@/assets/logos/symplalogo.png'


export const PLATAFORMAS = [
  {
    id: 'linkedin', nome: 'LinkedIn',
    descricao: 'Conquistas e certificações profissionais',
    cor: '#0A66C2', logo: linkedinLogo,
    eventos: [
      { tipo: 'certificado',  titulo: 'Certificado: Gestão de Projetos', descricao: 'Emitido pelo LinkedIn Learning', data_evento: '2026-03-10' },
      { tipo: 'emprego_novo', titulo: 'Nova posição: Designer UX',       descricao: 'Empresa de tecnologia',         data_evento: '2026-01-15' },
      { tipo: 'curso_online', titulo: 'Curso: Liderança e Gestão',       descricao: 'LinkedIn Learning · 4h',        data_evento: '2026-02-20' },
    ]
  },
  {
    id: 'instagram', nome: 'Instagram',
    descricao: 'Posts, reels e conquistas de engajamento',
    cor: '#E1306C', logo: instagramLogo,
    eventos: [
      { tipo: 'video_publicado',      titulo: 'Reel sobre identidade digital',    descricao: '1.2k visualizações',   data_evento: '2026-04-05' },
      { tipo: 'conquista_seguidores', titulo: 'Marco: 500 seguidores',            descricao: 'Crescimento orgânico', data_evento: '2026-03-28' },
      { tipo: 'post_publicado',       titulo: 'Post sobre avatares no metaverso', descricao: '87 curtidas',          data_evento: '2026-04-12' },
    ]
  },
  {
    id: 'github', nome: 'GitHub',
    descricao: 'Projetos, commits e contribuições open source',
    cor: '#6e40c9', logo: githubLogo,
    eventos: [
      { tipo: 'programacao_pessoal', titulo: 'Projeto: Chronoverse no GitHub',   descricao: '47 commits · repositório público', data_evento: '2026-05-01' },
      { tipo: 'projeto_entregue',    titulo: 'Contribuição: open source plugin', descricao: 'Pull request aceito',             data_evento: '2026-04-18' },
      { tipo: 'certificado',         titulo: 'GitHub Arctic Code Vault',         descricao: 'Código preservado no ártico',     data_evento: '2026-02-01' },
    ]
  },
  {
    id: 'strava', nome: 'Strava',
    descricao: 'Atividades físicas e conquistas esportivas',
    cor: '#FC4C02', logo: stravaLogo,
    eventos: [
      { tipo: 'corrida',     titulo: 'Corrida: 10km em 52min',       descricao: 'GPS verificado',   data_evento: '2026-05-10' },
      { tipo: 'ciclismo',    titulo: 'Ciclismo: 35km trilha urbana', descricao: 'GPS verificado',   data_evento: '2026-04-27' },
      { tipo: 'meta_batida', titulo: 'Meta: 50km rodados no mês',    descricao: 'Conquista mensal', data_evento: '2026-04-30' },
    ]
  },
  {
    id: 'duolingo', nome: 'Duolingo',
    descricao: 'Progresso em idiomas e streaks',
    cor: '#58CC02', logo: duolingoLogo,
    eventos: [
      { tipo: 'habito_30dias', titulo: 'Streak de 30 dias — Inglês',  descricao: 'Sequência sem pausas',             data_evento: '2026-04-01' },
      { tipo: 'curso_online',  titulo: 'Nível B1 concluído — Inglês', descricao: 'Duolingo English Test verificado', data_evento: '2026-03-15' },
      { tipo: 'conquista',     titulo: 'Liga Diamante alcançada',     descricao: 'Top 10 da semana',                 data_evento: '2026-05-05' },
    ]
  },
  {
    id: 'moodle', nome: 'Portal Educacional',
    descricao: 'Provas, trabalhos e frequência escolar',
    cor: '#F98012', logo: unifapLogo,
    eventos: [
      { tipo: 'prova_aprovado',    titulo: 'Prova: Cálculo I — 8.5',         descricao: 'UniFAP · verificado',       data_evento: '2026-03-20' },
      { tipo: 'trabalho_entregue', titulo: 'TCC: Avatares Interoperáveis',   descricao: 'Orientador: Prof. Silva',   data_evento: '2026-05-15' },
      { tipo: 'apresentacao',      titulo: 'Seminário: Design Especulativo', descricao: 'Apresentação para turma',   data_evento: '2026-04-10' },
    ]
  },
  {
    id: 'sympla', nome: 'Sympla',
    descricao: 'Participação em eventos presenciais e online',
    cor: '#F05537', logo: symplalogo,
    eventos: [
      { tipo: 'evento',          titulo: 'Campus Party Brasil 2026',      descricao: 'Check-in verificado', data_evento: '2026-02-10' },
      { tipo: 'palestra',        titulo: 'Palestra: Futuro do Metaverso', descricao: 'Ingresso validado',   data_evento: '2026-03-05' },
      { tipo: 'evento_cultural', titulo: 'Festival de Arte Digital',      descricao: 'Presença confirmada', data_evento: '2026-04-22' },
    ]
  },
  {
    id: 'coursera', nome: 'Coursera',
    descricao: 'Cursos online e certificações internacionais',
    cor: '#0056D2', logo: courseraLogo,
    eventos: [
      { tipo: 'curso_online', titulo: 'UX Design — Google Certificate', descricao: 'Coursera · verificado', data_evento: '2026-01-30' },
      { tipo: 'certificado',  titulo: 'AWS Cloud Practitioner',         descricao: 'Amazon · válido',        data_evento: '2026-03-01' },
      { tipo: 'workshop',     titulo: 'Workshop: Figma Avançado',       descricao: 'Udemy · 12 horas',       data_evento: '2026-04-08' },
    ]
  }
]