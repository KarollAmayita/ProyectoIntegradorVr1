FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY backend/ .
COPY frontend/ ../frontend/
EXPOSE 3001
CMD ["node", "--max-old-space-size=128", "src/app.js"]
