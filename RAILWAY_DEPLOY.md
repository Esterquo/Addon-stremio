# Guia de Deploy no Railway.app

## Por que Railway?

✅ Suporta Python + Node.js nativamente
✅ 500 horas grátis por mês
✅ Deploy automático do GitHub
✅ Sem cold start (servidor sempre ativo)
✅ Configuração super simples
✅ Logs em tempo real

## Passo 1: Criar Conta

1. Acesse https://railway.app
2. Clique em "Start a New Project"
3. Faça login com GitHub

## Passo 2: Conectar Repositório

1. No dashboard, clique em "New Project"
2. Selecione "Deploy from GitHub repo"
3. Escolha o repositório `Addon-stremio`
4. Clique em "Deploy Now"

## Passo 3: Configuração Automática

O Railway detecta automaticamente:
- ✅ `package.json` → Instala Node.js
- ✅ `requirements.txt` → Instala Python
- ✅ `railway.json` → Usa as configurações

**Não precisa configurar nada manualmente!**

## Passo 4: Variáveis de Ambiente

1. No projeto, clique em "Variables"
2. Adicione:

```
GITHUB_REPO=Esterquo/Addon-stremio
PORT=10000
```

## Passo 5: Obter URL Pública

1. Clique em "Settings"
2. Role até "Networking"
3. Clique em "Generate Domain"
4. Copie a URL: `https://seu-projeto.up.railway.app`

## Passo 6: Testar

Teste o manifest:
```
https://seu-projeto.up.railway.app/manifest.json
```

## Passo 7: Adicionar no Stremio

1. Abra Stremio
2. Configurações → Addons → Add Addon
3. Cole: `https://seu-projeto.up.railway.app/manifest.json`
4. Instale

## Troubleshooting

### Deploy falhou
- Verifique os logs no dashboard
- Confirme que `railway.json` existe

### Catálogo vazio
- Verifique se `data.json` existe no GitHub
- Confirme a variável `GITHUB_REPO`

### Servidor não responde
- Verifique a variável `PORT=10000`
- Confirme que o domínio foi gerado

## Limites do Plano Free

- **500 horas/mês** = ~20 dias rodando 24/7
- **100GB bandwidth/mês**
- **512MB RAM**
- **1GB disco**

## URLs Importantes

- Dashboard: https://railway.app/dashboard
- Documentação: https://docs.railway.app
