# Stage 1: Build the backend application
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Copy backend source code
COPY . .

# Build application (compiles TS to JS in dist/)
RUN npm run build

# Stage 2: Production runtime environment
FROM node:20-alpine

WORKDIR /app

# Copy package files and prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies only
RUN npm install --only=production

# Copy compiled files from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/swagger.html ./swagger.html

# Expose backend port
EXPOSE 5001

# Environment defaults
ENV PORT=5001
ENV NODE_ENV=production
ENV DATABASE_URL="file:/app/prisma/dev.db"

# Startup command: Run prisma schema sync, seed only if database is new, and start backend
CMD ["sh", "-c", "npx prisma generate && HAS_DB=$(if [ -f /app/prisma/dev.db ]; then echo 'yes'; else echo 'no'; fi) && npx prisma db push --accept-data-loss && (if [ \"$HAS_DB\" = \"no\" ]; then npm run seed; fi) && node dist/server.js"]
