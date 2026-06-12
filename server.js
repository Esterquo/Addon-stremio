const express = require('express');
const axios = require('axios');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// CONFIGURAÇÕES E LINKS
// ==========================================
// Mude para o link "Raw" do seu arquivo data.json no GitHub
const DATA_URL = 'https://raw.githubusercontent.com/cleitonleonel/redecanais/main/data.json';

// Configurações para o Scraper em Python (caso vá utilizá-lo no Render)
const PYTHON_CMD = 'python3';

// ==========================================
// 1. MANIFESTO DO STREMIO
// ==========================================
app.get('/manifest.json', (req, res) => {
    res.json({
        id: 'com.redecanais.stremio',
        version: '1.0.0',
        name: 'RedeCanais Completo',
        description: 'Addon que integra sua lista do GitHub e o backend do RedeCanais ao Stremio.',
        catalogs: [
            {
                type: 'movie',
                id: 'redecanais_movies',
                name: 'Filmes (GitHub)',
                extra: [{ name: 'search', isRequired: false }] // Permite busca se necessário
            },
            {
                type: 'other',
                id: 'redecanais_channels',
                name: 'Canais Ao Vivo (GitHub)',
                extra: []
            }
        ],
        resources: ['catalog', 'stream'],
        types: ['movie', 'other'],
        idPrefixes: ['rc', 'tt']
    });
});

// ==========================================
// FUNÇÃO AUXILIAR: BUSCAR DADOS DO GITHUB
// ==========================================
async function getRemoteData() {
    try {
        const response = await axios.get(DATA_URL);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados do GitHub:', error.message);
        // Retorna uma estrutura vazia padrão para não quebrar o addon se o GitHub falhar
        return { CHANNELS: [], MOVIES: [] };
    }
}

// ==========================================
// 2. LÓGICA DOS CATÁLOGOS (EXIBIÇÃO)
// ==========================================
app.get('/catalog/:type/:id/:extra?.json', async (req, res) => {
    const catalogId = req.params.id;
    let extra = {};
    
    if (req.params.extra) {
        try {
            // O Stremio envia os parâmetros extras (como busca) em formato de string/JSON
            const cleanExtra = req.params.extra.replace('.json', '');
            extra = JSON.parse(decodeURIComponent(cleanExtra));
        } catch(e) {
            extra = {};
        }
    }

    // SE O USUÁRIO FIZER UMA BUSCA POR TEXTO (Usa o Scraper do Python)
    if (extra.search) {
        const query = extra.search;
        const command = `${PYTHON_CMD} -m redecanais --all "${query}"`;

        return exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Erro no Scraper Python: ${error}`);
                return res.json({ metas: [] });
            }

            const metas = [];
            const lines = stdout.split('\n');
            lines.forEach((line, index) => {
                if (line.trim().length > 5) {
                    metas.push({
                        id: `tt_py_${Date.now()}_${index}`, 
                        type: 'movie',
                        name: line.substring(0, 50),
                        poster: 'https://via.placeholder.com/300x450?text=RedeCanais+Python',
                        description: 'Resultado encontrado via Scraper Python.'
                    });
                }
            });
            return res.json({ metas: metas.slice(0, 20) });
        });
    }

    // CASO CONTRÁRIO: EXIBE A SUA LISTA FIXA DO DATA.JSON DO GITHUB
    const data = await getRemoteData();
    let metas = [];

    if (catalogId === 'redecanais_movies') {
        metas = (data.MOVIES || []).map(m => ({
            id: `rc:${m.id}`,
            type: 'movie',
            name: m.name,
            poster: m.poster,
            description: m.description || 'Conteúdo de Domínio Público'
        }));
    } else if (catalogId === 'redecanais_channels') {
        metas = (data.CHANNELS || []).map(c => ({
            id: `rc:${c.id}`,
            type: 'other',
            name: c.name,
            poster: c.poster,
            description: 'Transmissão de Canal Ao Vivo'
        }));
    }

    res.json({ metas });
});

// ==========================================
// 3. LÓGICA DOS STREAMS (REPRODUÇÃO)
// ==========================================
app.get('/stream/:type/:id.json', async (req, res) => {
    const fullId = req.params.id.replace('.json', '');
    const streams = [];

    // Se o ID veio da sua lista do GitHub (começa com rc:)
    if (fullId.startsWith('rc:')) {
        const cleanId = fullId.replace('rc:', '');
        const data = await getRemoteData();
        
        // Procura o item tanto na lista de Filmes quanto de Canais
        const item = [...(data.MOVIES || []), ...(data.CHANNELS || [])].find(i => i.id === cleanId);

        if (item && item.streamUrl) {
            streams.push({
                name: 'RedeCanais Direct',
                title: item.name,
                url: item.streamUrl,
                behaviorHints: {
                    notWebReady: false,
                    bingeGroup: `rc:${cleanId}`
                }
            });
        }
    } 
    // Se o ID veio do Scraper do Python (começa com tt_py_)
    else if (fullId.startsWith('tt_py_')) {
        // Aqui você colocaria a lógica de extração em tempo real se necessário, ex:
        // python -m redecanais --url "nome_do_filme"
        streams.push({
            name: 'RedeCanais Python',
            title: 'Assistir via Scraper',
            url: 'http://exemplo.com/stream_do_python_aqui.m3u8' 
        });
    }

    res.json({ streams });
});

// ==========================================
// INICIALIZAÇÃO DO SERVIDOR
// ==========================================
app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`Addon do Stremio rodando com sucesso na porta ${PORT}`);
    console.log(`Endereço do Manifesto para colar no Stremio:`);
    console.log(`http://localhost:${PORT}/manifest.json`);
    console.log(`==================================================`);
});
