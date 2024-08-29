# Use uma imagem base oficial do Node.js
FROM node:18 AS build

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Cria diretório para imagens e dá autorização de escrita
RUN mkdir -p /usr/src/app/dist/public/img && chmod -R 755 /usr/src/app/dist


# Copia o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências da aplicação
RUN npm ci

# Copia todos os arquivos do projeto para o diretório de trabalho
COPY . .

# Gera o build do projeto
RUN npm run build

# Usa uma imagem base menor para a aplicação final
FROM node:18-slim

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Instala OpenSSL e outras dependências necessárias
RUN apt-get update -y && \
    apt-get install -y openssl && \
    apt-get clean

# Copia os arquivos do build e as dependências da imagem anterior
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/prisma ./prisma

# Instala o Prisma CLI
RUN npm install -g prisma

# Expõe a porta em que a aplicação será executada
EXPOSE 3000

# Comando para aplicar migrações e iniciar a aplicação
CMD ["sh", "-c", "prisma migrate deploy && node dist/server.js"]
