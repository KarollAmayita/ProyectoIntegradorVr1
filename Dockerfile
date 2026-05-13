FROM node:20-alpine AS build
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production

FROM node:20-alpine
RUN apk add --no-cache tini
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY backend/ .
COPY frontend/ ../frontend/
EXPOSE 3001
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "src/app.js"]
