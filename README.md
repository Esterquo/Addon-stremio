# Meu Addon Stremio (Canais + Filmes/Séries)

Addon de exemplo para Stremio com:
- Catálogo "Canais" (tipo `tv`)
- Catálogo "Filmes" (tipo `movie`)

⚠️ **Aviso importante**: as entradas em `data.js` são exemplos com
conteúdo de licença Creative Commons / domínio público (Big Buck Bunny,
Sintel). Substitua pelos seus próprios canais/filmes — use apenas fontes
que você tem direito de distribuir. Não inclua links de sites de pirataria
(ex.: Rede Canais), pois isso viola direitos de autor e as regras do
Stremio.

## Estrutura

- `index.js` — manifest, catalog/meta/stream handlers
- `data.js` — lista de canais e filmes (edite aqui)
- `package.json` — dependências

## Rodando localmente

```bash
npm install
npm start
```

O addon vai rodar em `http://127.0.0.1:7000/manifest.json`.

No Stremio: Configurações → Addons → "Add Addon" → cole a URL do manifest.

## Deploy no GitHub + hospedagem grátis

1. Crie um repositório no GitHub e suba estes arquivos.
2. Use um serviço de hospedagem Node.js (Render, Railway, Cyclic, Glitch, etc).
3. Configure o serviço para rodar `npm install && npm start`.
4. A plataforma definirá a variável `PORT` automaticamente.
5. Após o deploy, sua URL de manifest será algo como:
   `https://seu-addon.onrender.com/manifest.json`
6. Instale essa URL no Stremio.

## Adicionando seus próprios canais/filmes

Edite `data.js` e adicione objetos no formato:

```js
{
  id: "meu_canal",
  name: "Nome do Canal",
  poster: "https://.../poster.jpg",
  streamUrl: "https://.../stream.m3u8" // ou .mp4
}
```

Para listas de canais IPTV legais (ex.: TVs abertas com streams oficiais),
você pode integrar listas M3U públicas que tenham licença adequada,
gerando os objetos `CHANNELS` dinamicamente a partir delas.
