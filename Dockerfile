# Stage 1 - build Angular app
FROM node:24 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2 - nginx to serve app
FROM nginx:alpine

COPY -COPY --from=build /app/dist/company001-front /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
