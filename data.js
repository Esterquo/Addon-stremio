// Lista de canais / streams.
// IMPORTANTE: coloque aqui apenas URLs de conteudo que voce tem direito de
// distribuir (canais com licenca aberta, streams oficiais publicos, etc).
// As entradas abaixo sao apenas EXEMPLOS de conteudo de dominio publico /
// livre, para voce testar a estrutura.

const CHANNELS = [
  {
    id: "canal_exemplo_1",
    name: "Canal Exemplo 1 (Big Buck Bunny - CC)",
    poster: "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg",
    streamUrl: "http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_1080p_30fps_normal.mp4"
  },
  {
    id: "canal_exemplo_2",
    name: "Canal Exemplo 2 (Sintel - CC)",
    poster: "https://durian.blender.org/wp-content/uploads/2010/06/sintel_poster.jpg",
    streamUrl: "https://download.blender.org/durian/movies/sintel-1024-surround.mp4"
  }
];

const MOVIES = [
  {
    id: "filme_exemplo_1",
    name: "Big Buck Bunny",
    poster: "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg",
    description: "Filme curto de animacao com licenca Creative Commons.",
    streamUrl: "http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_1080p_30fps_normal.mp4"
  },
  {
    id: "filme_exemplo_2",
    name: "Sintel",
    poster: "https://durian.blender.org/wp-content/uploads/2010/06/sintel_poster.jpg",
    description: "Curta-metragem de animacao com licenca Creative Commons.",
    streamUrl: "https://download.blender.org/durian/movies/sintel-1024-surround.mp4"
  }
];

module.exports = { CHANNELS, MOVIES };
