# Use Node.js LTS
FROM node:20

WORKDIR /app

# Copy frontend package files
COPY frontend-web/package*.json ./

RUN npm install

# Copy frontend code
COPY frontend-web/ ./

# Build React app
RUN npm run build

# Use nginx to serve build
FROM nginx:alpine

COPY --from=0 /app/build /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
