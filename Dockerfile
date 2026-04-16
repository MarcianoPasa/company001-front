# Estágio 1: Compilação (Build)
FROM node:24.14.1-alpine AS build
WORKDIR /app

# Copia arquivos de dependências primeiro para aproveitar o cache do Docker
COPY package*.json ./
RUN npm install

# Copia o restante do código fonte
COPY . .

# Executa o build de produção (Angular 21 gera em dist/company001-front/browser)
RUN npm run build -- --configuration production

# Estágio 2: Servidor Web (Runtime)
FROM nginx:alpine

# Limpa o diretório padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia o build gerado no estágio anterior para o diretório do Nginx
# Nota: O caminho '/browser' é o padrão nas versões mais recentes do Angular
COPY --from=build /app/dist/company001-front/browser /usr/share/nginx/html

# Copia a configuração customizada do Nginx (necessária para rotas como /principal)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
