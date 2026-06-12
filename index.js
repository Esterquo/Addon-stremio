const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const { CHANNELS, MOVIES } = require("./data");

const PREFIX_CHANNEL = "meuaddon_channel_";
const PREFIX_MOVIE = "meuaddon_movie_";

const manifest = {
  id: "org.meuaddon.canais",
  version: "1.0.0",
  name: "Meu Addon de Canais e Filmes",
  description: "Addon com catalogo de canais ao vivo e filmes/series de fontes livres.",
  logo: "https://i.imgur.com/Bb8nKmU.png",
  resources: ["catalog", "meta", "stream"],
  types: ["tv", "movie"],
  catalogs: [
    {
      type: "tv",
      id: "meuaddon_canais",
      name: "Canais"
    },
    {
      type: "movie",
      id: "meuaddon_filmes",
      name: "Filmes"
    }
  ],
  idPrefixes: [PREFIX_CHANNEL, PREFIX_MOVIE]
};

const builder = new addonBuilder(manifest);

// CATALOG HANDLER
builder.defineCatalogHandler(({ type, id }) => {
  if (type === "tv" && id === "meuaddon_canais") {
    const metas = CHANNELS.map((c) => ({
      id: PREFIX_CHANNEL + c.id,
      type: "tv",
      name: c.name,
      poster: c.poster,
      posterShape: "square"
    }));
    return Promise.resolve({ metas });
  }

  if (type === "movie" && id === "meuaddon_filmes") {
    const metas = MOVIES.map((m) => ({
      id: PREFIX_MOVIE + m.id,
      type: "movie",
      name: m.name,
      poster: m.poster,
      posterShape: "poster"
    }));
    return Promise.resolve({ metas });
  }

  return Promise.resolve({ metas: [] });
});

// META HANDLER
builder.defineMetaHandler(({ type, id }) => {
  if (type === "tv" && id.startsWith(PREFIX_CHANNEL)) {
    const realId = id.replace(PREFIX_CHANNEL, "");
    const channel = CHANNELS.find((c) => c.id === realId);
    if (channel) {
      return Promise.resolve({
        meta: {
          id,
          type: "tv",
          name: channel.name,
          poster: channel.poster,
          posterShape: "square"
        }
      });
    }
  }

  if (type === "movie" && id.startsWith(PREFIX_MOVIE)) {
    const realId = id.replace(PREFIX_MOVIE, "");
    const movie = MOVIES.find((m) => m.id === realId);
    if (movie) {
      return Promise.resolve({
        meta: {
          id,
          type: "movie",
          name: movie.name,
          poster: movie.poster,
          description: movie.description,
          posterShape: "poster"
        }
      });
    }
  }

  return Promise.resolve({ meta: {} });
});

// STREAM HANDLER
builder.defineStreamHandler(({ type, id }) => {
  if (type === "tv" && id.startsWith(PREFIX_CHANNEL)) {
    const realId = id.replace(PREFIX_CHANNEL, "");
    const channel = CHANNELS.find((c) => c.id === realId);
    if (channel) {
      return Promise.resolve({
        streams: [
          {
            title: channel.name,
            url: channel.streamUrl
          }
        ]
      });
    }
  }

  if (type === "movie" && id.startsWith(PREFIX_MOVIE)) {
    const realId = id.replace(PREFIX_MOVIE, "");
    const movie = MOVIES.find((m) => m.id === realId);
    if (movie) {
      return Promise.resolve({
        streams: [
          {
            title: movie.name,
            url: movie.streamUrl
          }
        ]
      });
    }
  }

  return Promise.resolve({ streams: [] });
});

const PORT = process.env.PORT || 7000;

serveHTTP(builder.getInterface(), { port: PORT });

console.log(`Addon rodando na porta ${PORT}`);
console.log(`Manifest: http://127.0.0.1:${PORT}/manifest.json`);
