FROM node:20 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration production

FROM nginx:alpine
COPY --from=build /app/dist/company001-front /usr/share/nginx/html
EXPOSE 80
