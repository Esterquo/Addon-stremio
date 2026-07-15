/**
 * Nuvio Uploader - Faz upload de streams para Nuvio
 * Converte URLs do RedeCanais em URLs do Nuvio
 */

const axios = require('axios');

// Configuração do Nuvio (ajustar conforme API do Nuvio)
const NUVIO_API_URL = process.env.NUVIO_API_URL || 'https://api.nuvio.com';
const NUVIO_API_KEY = process.env.NUVIO_API_KEY || '';

/**
 * Faz upload de um vídeo para o Nuvio
 * @param {string} sourceUrl - URL original do vídeo
 * @param {object} metadata - Metadados (title, description, etc)
 * @returns {Promise<string>} URL do vídeo no Nuvio
 */
async function uploadToNuvio(sourceUrl, metadata = {}) {
    try {
        if (!NUVIO_API_KEY) {
            console.warn('NUVIO_API_KEY não configurada, retornando URL original');
            return sourceUrl;
        }

        // Faz requisição para API do Nuvio
        const response = await axios.post(`${NUVIO_API_URL}/upload`, {
            source_url: sourceUrl,
            title: metadata.title || 'Untitled',
            description: metadata.description || '',
            tags: metadata.tags || []
        }, {
            headers: {
                'Authorization': `Bearer ${NUVIO_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });

        if (response.data && response.data.stream_url) {
            console.log(`Upload concluído: ${metadata.title} -> ${response.data.stream_url}`);
            return response.data.stream_url;
        }

        return sourceUrl;
    } catch (error) {
        console.error(`Erro ao fazer upload para Nuvio: ${error.message}`);
        return sourceUrl; // Fallback para URL original
    }
}

/**
 * Processa um catálogo inteiro e faz upload para Nuvio
 * @param {Array} items - Array de itens do catálogo
 * @returns {Promise<Array>} Array com URLs atualizadas
 */
async function processarCatalogo(items) {
    const promises = items.map(async (item) => {
        if (!item.streamUrl) return item;

        const nuvioUrl = await uploadToNuvio(item.streamUrl, {
            title: item.name,
            description: item.description,
            tags: [item.type]
        });

        return {
            ...item,
            streamUrl: nuvioUrl,
            originalUrl: item.streamUrl
        };
    });

    return Promise.all(promises);
}

module.exports = {
    uploadToNuvio,
    processarCatalogo
};
