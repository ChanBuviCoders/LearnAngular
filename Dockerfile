# Stage 1: Build Angular application
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build -- --configuration production

# Stage 2: Run Angular using Nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/LearnAngular /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]