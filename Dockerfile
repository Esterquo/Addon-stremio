FROM node:18

# Instala o Python e dependências do sistema
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv && rm -rf /var/lib/apt/lists/*

# Configura o diretório de trabalho
WORKDIR /app

# Copia os arquivos do projeto
COPY package*.json ./
RUN npm install

# Instala o scraper em Python globalmente
RUN pip3 install --break-system-packages git+https://github.com/cleitonleonel/redecanais.git

# Copia o resto do código
COPY . .

# Expõe a porta e inicia o servidor
EXPOSE 3000
CMD ["node", "server.js"]
