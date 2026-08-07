# Stage 1: Build Dependencies & Production Bundle
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client & Build Vite static bundle
RUN npx prisma generate
RUN npm run build

# Stage 2: Production NGINX Static Serve & Runtime
FROM nginx:alpine AS runner

# Copy built dist files to NGINX HTML directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom NGINX config for React Router fallback
RUN echo $'server {\n\
    listen 3000;\n\
    location / {\n\
        root /usr/share/nginx/html;\n\
        index index.html index.htm;\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
