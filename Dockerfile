FROM node:18

# Instala o Python e dependências do sistema
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv git && rm -rf /var/lib/apt/lists/*

# Configura o diretório de trabalho
WORKDIR /app

# Copia os arquivos do projeto
COPY package*.json ./
RUN npm install

# Copia requirements.txt e instala dependências Python
COPY requirements.txt ./
RUN pip3 install --break-system-packages --no-cache-dir -r requirements.txt && \
    python3 -c "import redecanais; print('redecanais instalado com sucesso')" || echo "ERRO: redecanais não foi instalado"

# Copia o resto do código
COPY . .

# Expõe a porta e inicia o servidor
EXPOSE 3000
CMD ["node", "server.js"]
