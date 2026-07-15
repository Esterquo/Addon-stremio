# RedeCanais + Nuvio Addon para Stremio

Addon do Stremio que integra conteúdo do RedeCanais com hospedagem no Nuvio.

## Funcionalidades

- Scraping automático de filmes, séries e canais ao vivo do RedeCanais
- Upload e hospedagem de streams no Nuvio
- Atualização automática do catálogo a cada 1 hora
- Integração completa com Stremio

## Requisitos

- Node.js 18+
- Python 3.7+
- Conta Nuvio (para hospedagem de streams)

## Instalação Local

1. Instalar dependências Node.js:
```bash
npm install
```

2. Instalar dependências Python:
```bash
pip install -r requirements.txt
```

3. Configurar variáveis de ambiente (opcional):
```bash
# .env
NUVIO_API_KEY=sua_chave_aqui
NUVIO_API_URL=https://api.nuvio.com
PORT=10000
```

4. Executar:
```bash
npm start
```

## Deploy no Render.com

1. Criar novo Web Service no Render
2. Conectar ao repositório GitHub
3. Configurar:
   - Build Command: `npm install && pip install -r requirements.txt`
   - Start Command: `npm start`
   - Environment: Node 18+
4. Adicionar variáveis de ambiente:
   - `NUVIO_API_KEY`: Sua chave da API Nuvio
   - `NUVIO_API_URL`: URL da API Nuvio (opcional)

## Configuração do Stremio

Após deploy, adicione o addon no Stremio usando a URL:
```
https://seu-app.onrender.com/manifest.json
```

## Estrutura do Projeto

- `server.js` - Servidor Express + handlers do Stremio
- `scraper.py` - Script Python que busca conteúdo do RedeCanais
- `nuvio-uploader.js` - Módulo para upload de streams no Nuvio
- `data.json` - Cache local do catálogo
- `requirements.txt` - Dependências Python
- `package.json` - Dependências Node.js

## Como Funciona

1. `scraper.py` busca conteúdo do RedeCanais usando a biblioteca oficial
2. Os dados são salvos em `data.json`
3. `nuvio-uploader.js` processa as URLs e faz upload para Nuvio (se configurado)
4. `server.js` serve o catálogo para o Stremio
5. Atualização automática a cada hora

## Troubleshooting

### Python não encontrado
```bash
# Windows
winget install Python.Python.3.11

# Linux/Mac
apt install python3 python3-pip
```

### Erro ao instalar redecanais
```bash
pip install git+https://github.com/cleitonleonel/redecanais.git
```

### Streams não funcionam
- Verifique se `NUVIO_API_KEY` está configurada
- Teste o scraper manualmente: `python3 scraper.py`
- Verifique logs do servidor

## Licença

MIT
