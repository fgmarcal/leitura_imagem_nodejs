# Use uma imagem base oficial do Node.js
FROM node:18 AS build

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências da aplicação
RUN npm install

# Copia todos os arquivos do projeto para o diretório de trabalho
COPY . .

# Gera o build do projeto
RUN npm run build

# Usa uma imagem base menor para a aplicação final
FROM node:18-slim

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos do build e as dependências da imagem anterior
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package*.json ./

# Expõe a porta em que a aplicação será executada
EXPOSE 3000

# Define o comando para iniciar a aplicação
CMD ["node", "dist/server.js"]
