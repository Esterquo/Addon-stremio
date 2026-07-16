const express = require('express');
const { addonBuilder } = require('stremio-addon-sdk');
const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);

const app = express();
const PORT = process.env.PORT || 10000;

// URL bruta do seu data.json no GitHub (Substitua com o seu usuário e repositório real)
// Exemplo: 'https://raw.githubusercontent.com/SEU_USUARIO/SEU_REPOSITORIO/main/data.json'
const GITHUB_DATA_URL = `https://raw.githubusercontent.com/${process.env.GITHUB_REPO || 'Esterquo/Addon-stremio'}/main/data.json`;

let catalogoLocal = { MOVIES: [], CHANNELS: [], SERIES: [] };

const manifest = {
    id: "com.redecanais.stremio",
    version: "2.0.0",
    name: "RedeCanais + Nuvio",
    description: "Addon RedeCanais integrado com Nuvio para streaming.",
    catalogs: [
        { type: "movie", id: "redecanais_movies", name: "Filmes RedeCanais" },
        { type: "series", id: "redecanais_series", name: "Séries RedeCanais" },
        { type: "tv", id: "redecanais_channels", name: "Canais Ao Vivo" }
    ],
    resources: ["catalog", "meta", "stream"],
    types: ["movie", "series", "tv"],
    idPrefixes: ["rc_movie_", "rc_series_", "rc_channel_"]
};

const builder = new addonBuilder(manifest);

// Função para rodar o scraper
async function rodarScraper() {
    console.log("Executando scraper...");
    try {
        const { stdout, stderr } = await execPromise('python3 scraper.py');
        console.log("Scraper executado:", stdout);
        if (stderr) console.error("Scraper stderr:", stderr);
        return true;
    } catch (error) {
        console.error("Erro ao executar scraper:", error.message);
        return false;
    }
}

// Função rápida apenas para ler os dados que já foram salvos pelo scraper no GitHub
async function obterDadosDoGitHub() {
    console.log("Buscando catálogo atualizado do GitHub...");
    try {
        const response = await fetch(GITHUB_DATA_URL);
        if (response.ok) {
            const dados = await response.json();
            catalogoLocal = dados;
            console.log(`Catálogo carregado: ${catalogoLocal.MOVIES?.length || 0} filmes, ${catalogoLocal.SERIES?.length || 0} séries, ${catalogoLocal.CHANNELS?.length || 0} canais`);
        } else {
            console.error("Não foi possível carregar o data.json do GitHub. Status:", response.status);
        }
    } catch (e) {
        console.error("Erro ao buscar dados do GitHub:", e.message);
    }
}

// Configuração dos Handlers do Stremio
builder.defineCatalogHandler((args) => {
    return new Promise((resolve) => {
        if (args.id === 'redecanais_movies') {
            return resolve({ metas: catalogoLocal.MOVIES || [] });
        }
        if (args.id === 'redecanais_series') {
            return resolve({ metas: catalogoLocal.SERIES || [] });
        }
        if (args.id === 'redecanais_channels') {
            return resolve({ metas: catalogoLocal.CHANNELS || [] });
        }
        resolve({ metas: [] });
    });
});

builder.defineMetaHandler((args) => {
    return new Promise((resolve) => {
        const todos = [...(catalogoLocal.MOVIES || []), ...(catalogoLocal.SERIES || []), ...(catalogoLocal.CHANNELS || [])];
        const encontrado = todos.find(item => item.id === args.id);

        if (encontrado) {
            return resolve({
                meta: {
                    id: encontrado.id,
                    type: args.type,
                    name: encontrado.name,
                    poster: encontrado.poster,
                    description: encontrado.description
                }
            });
        }
        resolve({ meta: null });
    });
});

builder.defineStreamHandler((args) => {
    return new Promise((resolve) => {
        const todos = [...(catalogoLocal.MOVIES || []), ...(catalogoLocal.SERIES || []), ...(catalogoLocal.CHANNELS || [])];
        const encontrado = todos.find(item => item.id === args.id);

        if (encontrado && encontrado.streamUrl) {
            return resolve({
                streams: [{
                    title: "RedeCanais via Nuvio",
                    url: encontrado.streamUrl
                }]
            });
        }
        resolve({ streams: [] });
    });
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

// Middleware para garantir que o catálogo não esteja zerado em ambientes Serverless (Vercel)
app.use(async (req, res, next) => {
    if (!catalogoLocal.MOVIES || catalogoLocal.MOVIES.length === 0) {
        await obterDadosDoGitHub();
    }
    next();
});

const addonInterface = builder.getInterface();
app.get('/manifest.json', (req, res) => res.json(addonInterface.manifest));
app.get('/catalog/:type/:id.json', (req, res) => addonInterface.get('catalog', { type: req.params.type, id: req.params.id }).then(r => res.json(r)));
app.get('/meta/:type/:id.json', (req, res) => addonInterface.get('meta', { type: req.params.type, id: req.params.id }).then(r => res.json(r)));
app.get('/stream/:type/:id.json', (req, res) => addonInterface.get('stream', { type: req.params.type, id: req.params.id }).then(r => res.json(r)));

// Inicialização
async function iniciarServidor() {
    // Rodar scraper na inicialização (se estiver no Railway)
    if (process.env.RAILWAY_ENVIRONMENT) {
        console.log("Rodando no Railway - executando scraper...");
        await rodarScraper();
    }

    await obterDadosDoGitHub();

    // Se não for Vercel, o Express abre a porta localmente (como no Render ou local)
    if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    }
}

iniciarServidor();

module.exports = app; // Necessário para a Vercel
