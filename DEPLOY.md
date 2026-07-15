# Guia de Deploy no Render.com

## Passo 1: Preparar o Repositório GitHub

1. Certifique-se que todos os arquivos estão commitados:
```bash
git add .
git commit -m "Integração RedeCanais + Nuvio completa"
git push origin main
```

## Passo 2: Criar Web Service no Render

1. Acesse https://render.com
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório GitHub
4. Selecione o repositório `Addon-stremio-main`

## Passo 3: Configurar o Web Service

### Build & Deploy

- **Name**: `redecanais-stremio-addon` (ou qualquer nome)
- **Region**: Escolha a região mais próxima
- **Branch**: `main`
- **Root Directory**: (deixe em branco)
- **Environment**: `Node`
- **Build Command**: 
  ```
  npm install && pip install -r requirements.txt
  ```
- **Start Command**: 
  ```
  npm start
  ```

### Environment Variables

Adicione as seguintes variáveis:

| Key | Value |
|-----|-------|
| `NODE_VERSION` | `18` |
| `PYTHON_VERSION` | `3.11` |
| `NUVIO_API_KEY` | `sua_chave_aqui` (se tiver) |
| `NUVIO_API_URL` | `https://api.nuvio.com` (se tiver) |

**Nota**: Se você não tem conta Nuvio ainda, deixe `NUVIO_API_KEY` vazio. O addon usará as URLs originais do RedeCanais.

## Passo 4: Deploy

1. Clique em "Create Web Service"
2. Aguarde o deploy (5-10 minutos)
3. Render vai:
   - Instalar Node.js 18
   - Instalar Python 3.11
   - Instalar dependências (`npm install`)
   - Instalar biblioteca redecanais (`pip install`)
   - Executar o servidor

## Passo 5: Verificar Deploy

Após deploy bem-sucedido, você verá a URL do seu addon:
```
https://seu-addon.onrender.com
```

Teste o manifest:
```
https://seu-addon.onrender.com/manifest.json
```

## Passo 6: Adicionar no Stremio

1. Abra o Stremio
2. Configurações → Addons
3. Clique em "Add Addon"
4. Cole a URL: `https://seu-addon.onrender.com/manifest.json`
5. Clique em "Install"

## Troubleshooting

### Python não encontrado no Render

Adicione um `runtime.txt`:
```
python-3.11
```

### Build falha ao instalar redecanais

Tente usar o comando direto no Build Command:
```bash
npm install && pip3 install git+https://github.com/cleitonleonel/redecanais.git
```

### Servidor não inicia

Verifique os logs no Render Dashboard. Pode ser:
- Porta incorreta (Render define automaticamente via `process.env.PORT`)
- Dependências faltando
- Erro no scraper Python

### Catálogo vazio no Stremio

1. Verifique logs do Render
2. Teste o scraper manualmente:
   ```bash
   python3 scraper.py
   ```
3. Verifique se `data.json` foi gerado

### Streams não funcionam

- Se não configurou Nuvio, as URLs serão as originais do RedeCanais
- Algumas URLs podem estar quebradas ou bloqueadas
- Configure `NUVIO_API_KEY` para usar hospedagem Nuvio

## Plano Free do Render

- 750 horas/mês grátis
- App "dorme" após 15 min de inatividade
- Primeiro acesso pode demorar ~30s (cold start)
- Suficiente para uso pessoal

## Atualização Automática

O addon atualiza o catálogo a cada 1 hora automaticamente. Não precisa fazer deploy novamente.

Para forçar atualização:
1. Render Dashboard → Manual Deploy
2. Ou faça novo commit no GitHub (deploy automático)

## URLs Importantes

- Dashboard: https://dashboard.render.com
- Logs: https://dashboard.render.com/web/[seu-app-id]/logs
- Documentação: https://render.com/docs
