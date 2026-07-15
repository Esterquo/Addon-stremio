# RedeCanais + Nuvio - Resumo do Projeto

## ✅ Arquivos Criados

- `server.js` - Servidor principal com handlers Stremio
- `scraper.py` - Script Python que busca conteúdo do RedeCanais
- `nuvio-uploader.js` - Módulo de integração com Nuvio
- `test-redecanais.py` - Script de teste da biblioteca
- `package.json` - Dependências Node.js
- `requirements.txt` - Dependências Python
- `render.yaml` - Configuração do Render
- `.env.example` - Exemplo de variáveis de ambiente
- `.gitignore` - Arquivos ignorados pelo Git
- `README.md` - Documentação principal
- `DEPLOY.md` - Guia de deploy no Render
- `GITHUB_SETUP.md` - Como conectar ao GitHub

## 📋 O Que Falta Fazer

### 1. Conectar ao GitHub (OBRIGATÓRIO)
```bash
# Leia GITHUB_SETUP.md para instruções completas
git remote add origin https://github.com/SEU_USERNAME/Addon-stremio-main.git
git branch -M main
git push -u origin main
```

### 2. Instalar Biblioteca RedeCanais Localmente (OPCIONAL - para testar)
```bash
pip install git+https://github.com/cleitonleonel/redecanais.git

# Testar se funciona
python test-redecanais.py

# Testar scraper
python scraper.py
```

### 3. Deploy no Render.com (OBRIGATÓRIO)
- Leia `DEPLOY.md` para instruções passo a passo
- Crie conta no Render (grátis)
- Conecte seu repositório GitHub
- Configure variáveis de ambiente
- Deploy automático vai rodar

### 4. Configurar Nuvio (OPCIONAL)
Se você tem conta Nuvio:
- Adicione `NUVIO_API_KEY` nas variáveis de ambiente do Render
- Os streams serão hospedados no Nuvio automaticamente

Se NÃO tem conta Nuvio:
- O addon vai usar as URLs originais do RedeCanais
- Funciona do mesmo jeito

### 5. Adicionar no Stremio
Após deploy no Render:
1. Copie a URL: `https://seu-app.onrender.com/manifest.json`
2. Stremio → Configurações → Addons → Add Addon
3. Cole a URL e instale

## 🚀 Fluxo de Funcionamento

1. Render executa `scraper.py` na primeira inicialização
2. Scraper busca filmes/séries/canais do RedeCanais
3. Dados salvos em `data.json`
4. `nuvio-uploader.js` processa URLs (se configurado)
5. Servidor Node.js serve catálogo para Stremio
6. Atualização automática a cada 1 hora

## 📝 Notas Importantes

- **Plano Free do Render**: 750h/mês grátis, app "dorme" após 15min inativo
- **First load**: Pode demorar ~30s (cold start)
- **Python no Render**: Instalado automaticamente pelo `requirements.txt`
- **Logs**: Acesse no Render Dashboard para debug

## 🔧 Comandos Úteis

```bash
# Ver status local
git status

# Testar scraper
python scraper.py

# Instalar dependências localmente
npm install
pip install -r requirements.txt

# Rodar servidor local
npm start
# Acesse: http://localhost:10000/manifest.json
```

## 📞 Próximo Passo

Execute os comandos de `GITHUB_SETUP.md` para fazer push para o GitHub!
