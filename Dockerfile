# --- Stage 1: Builder ---
FROM node:25.1.0-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


# --- Stage 2: Runtime ---
FROM node:25.1.0-alpine AS runtime

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

CMD ["npm", "start"]
