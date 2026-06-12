const express = require('express');
const { addonBuilder } = require('stremio-addon-sdk');
const fs = require('fs');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 10000;

// Configuração básica do Manifesto
const manifest = {
    id: "com.redecanais.stremio",
    version: "1.0.0",
    name: "RedeCanais Completo",
    description: "Addon automatizado integrado ao GitHub.",
    catalogs: [
        { type: "movie", id: "redecanais_movies", name: "Filmes (GitHub)" },
        { type: "other", id: "redecanais_channels", name: "Canais Ao Vivo (GitHub)" }
    ],
    resources: ["catalog", "stream"],
    types: ["movie", "other"],
    idPrefixes: ["rc", "tt"]
};

const builder = new addonBuilder(manifest);

// Função para buscar e salvar dados automaticamente via API do GitHub
async function atualizarCatalogoAutomatico() {
    console.log("Iniciando varredura automatizada...");
    
    // ---------------------------------------------------------
    // AQUI ENTRA A LÓGICA DO SEU SCRAPER PYTHON OU DO SITE
    // Para este exemplo, geramos os itens automaticamente com IDs corretos:
    // ---------------------------------------------------------
    const novosDados = {
        MOVIES: [
            {
                id: "tt0103759",
                name: "Batman: A Série Animada (Auto)",
                poster: "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg",
                description: "Atualizado automaticamente pelo servidor.",
                streamUrl: "http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_1080p_30fps_normal.mp4"
            }
        ],
        CHANNELS: [
            {
                id: "rc_canal_auto",
                name: "Canal Automático",
                poster: "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg",
                streamUrl: "http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_1080p_30fps_normal.mp4"
            }
        ]
    };

    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO;

    if (!token || !repo) {
        console.log("Variáveis de ambiente do GitHub não configuradas no Render.");
        return;
    }

    try {
        const url = `https://api.github.com/repos/${repo}/contents/data.json`;
        let sha = "";

        // 1. Tenta pegar o arquivo atual para obter o código SHA (necessário para atualizar)
        try {
            const res = await axios.get(url, { headers: { Authorization: `token ${token}` } });
            sha = res.data.sha;
        } catch (e) {
            console.log("Arquivo data.json não encontrado, criando um novo...");
        }

        // 2. Envia a nova lista atualizada de volta para o seu GitHub
        const contentBase64 = Buffer.from(JSON.stringify(novosDados, null, 2)).toString('base64');
        await axios.put(url, {
            message: "Atualização automática de catálogo",
            content: contentBase64,
            sha: sha || undefined
        }, {
            headers: { Authorization: `token ${token}` }
        });

        console.log("data.json atualizado com sucesso no GitHub!");
    } catch (error) {
        console.error("Erro ao enviar dados para o GitHub:", error.message);
    }
}

// Executa a automação assim que o servidor liga
atualizarCatalogoAutomatico();

// Agenda para rodar sozinho a cada 1 hora (3600000 milissegundos)
setInterval(atualizarCatalogoAutomatico, 3600000);

// Catálogos e Streams do Stremio
builder.defineCatalogHandler((args) => {
    return new Promise((resolve) => {
        if (fs.existsSync('data.json')) {
            const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
            if (args.id === 'redecanais_movies') {
                return resolve({ metas: data.MOVIES || [] });
            }
            if (args.id === 'redecanais_channels') {
                return resolve({ metas: data.CHANNELS || [] });
            }
        }
        resolve({ metas: [] });
    });
});

builder.defineStreamHandler((args) => {
    return new Promise((resolve) => {
        if (fs.existsSync('data.json')) {
            const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
            const todos = [...(data.MOVIES || []), ...(data.CHANNELS || [])];
            const encontrado = todos.find(item => item.id === args.id);

            if (encontrado) {
                return resolve({
                    streams: [{ title: "RedeCanais Direct (Auto)", url: encontrado.streamUrl }]
                });
            }
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
app.get('/stream/:type/:id.json', (req, res) => addonInterface.get('stream', { type: req.params.type, id: req.params.id }).then(r => res.json(r)));

app.listen(PORT, () => {
    console.log(`Servidor rodando e automatizado na porta ${PORT}`);
});
