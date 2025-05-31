# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --force

COPY . .
RUN yarn run build

# Stage 2: Serve with Nginx
FROM nginx:1.28.0-alpine-slim

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace default nginx config if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
