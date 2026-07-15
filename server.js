const express = require('express');
const { addonBuilder } = require('stremio-addon-sdk');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// Variável global para manter o catálogo na memória do servidor
let catalogoLocal = { MOVIES: [], CHANNELS: [], SERIES: [] };

// Configuração básica do Manifesto
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

// Função para executar o scraper Python e atualizar o catálogo
async function atualizarCatalogoAutomatico() {
    console.log("Executando scraper do RedeCanais...");

    return new Promise((resolve, reject) => {
        exec('python3 scraper.py', { cwd: __dirname }, (error, stdout, stderr) => {
            if (error) {
                console.error("Erro ao executar scraper:", error);
                console.error("stderr:", stderr);
                // Tenta carregar data.json existente como fallback
                try {
                    const dataPath = path.join(__dirname, 'data.json');
                    if (fs.existsSync(dataPath)) {
                        const dados = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
                        catalogoLocal = dados;
                        console.log("Carregado catálogo existente do data.json");
                    }
                } catch (e) {
                    console.error("Erro ao carregar data.json:", e);
                }
                resolve();
                return;
            }

            try {
                // Lê o data.json atualizado pelo scraper
                const dataPath = path.join(__dirname, 'data.json');
                const dados = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
                catalogoLocal = dados;

                console.log(`Catálogo atualizado: ${catalogoLocal.MOVIES?.length || 0} filmes, ${catalogoLocal.SERIES?.length || 0} séries, ${catalogoLocal.CHANNELS?.length || 0} canais`);
                resolve();
            } catch (e) {
                console.error("Erro ao processar dados do scraper:", e);
                reject(e);
            }
        });
    });
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

const addonInterface = builder.getInterface();
app.get('/manifest.json', (req, res) => res.json(addonInterface.manifest));
app.get('/catalog/:type/:id.json', (req, res) => addonInterface.get('catalog', { type: req.params.type, id: req.params.id }).then(r => res.json(r)));
app.get('/meta/:type/:id.json', (req, res) => addonInterface.get('meta', { type: req.params.type, id: req.params.id }).then(r => res.json(r)));
app.get('/stream/:type/:id.json', (req, res) => addonInterface.get('stream', { type: req.params.type, id: req.params.id }).then(r => res.json(r)));

// Inicialização controlada
async function iniciarServidor() {
    await atualizarCatalogoAutomatico();
    
    app.listen(PORT, () => {
        console.log(`Servidor rodando e pronto para o Stremio na porta ${PORT}`);
    });

    setInterval(atualizarCatalogoAutomatico, 3600000);
}

iniciarServidor();
