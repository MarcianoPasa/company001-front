# build
FROM node:20 as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --configuration production

# nginx
FROM nginx:alpine
COPY --from=build /app/dist/company001-front /usr/share/nginx/html
EXPOSE 80

