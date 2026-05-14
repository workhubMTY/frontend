FROM node:20-alpine AS deps
WORKDIR /frontend
COPY package*.json ./
RUN npm install

FROM node:20-alpine AS builder
WORKDIR /frontend
COPY --from=deps /frontend/node_modules ./node_modules
COPY . .
RUN npm run build 

FROM node:20-alpine AS runner
WORKDIR /frontend
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /frontend/public ./public
COPY --from=builder /frontend/.next/standalone ./
COPY --from=builder /frontend/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]