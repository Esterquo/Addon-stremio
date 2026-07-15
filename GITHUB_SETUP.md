# Como Conectar ao GitHub e Fazer Push

## Opção 1: Se o repositório JÁ EXISTE no GitHub

```bash
cd "C:\Users\Usuario\Documents\Addon-stremio-main"

# Adicionar remote (substitua pelo seu username)
git remote add origin https://github.com/SEU_USERNAME/Addon-stremio-main.git

# Fazer push
git branch -M main
git push -u origin main
```

## Opção 2: Se o repositório NÃO EXISTE no GitHub

1. Acesse https://github.com/new
2. Nome do repositório: `Addon-stremio-main`
3. Deixe PÚBLICO (para funcionar no Render grátis)
4. Não adicione README, .gitignore ou LICENSE (já temos)
5. Clique em "Create repository"

Depois execute:

```bash
cd "C:\Users\Usuario\Documents\Addon-stremio-main"

# Adicionar remote (GitHub vai mostrar essa URL)
git remote add origin https://github.com/SEU_USERNAME/Addon-stremio-main.git

# Fazer push
git branch -M main
git push -u origin main
```

## Verificar se deu certo

```bash
git remote -v
# Deve mostrar:
# origin  https://github.com/SEU_USERNAME/Addon-stremio-main.git (fetch)
# origin  https://github.com/SEU_USERNAME/Addon-stremio-main.git (push)
```

## Próximos Passos

Após fazer push:
1. Acesse o repositório no GitHub
2. Vá para DEPLOY.md para instruções de deploy no Render
3. Configure o Render para conectar ao seu repositório
4. Adicione variáveis de ambiente (NUVIO_API_KEY se tiver)
5. Deploy automático vai começar
