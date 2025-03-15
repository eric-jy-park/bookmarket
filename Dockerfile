FROM node:18-alpine AS builder

# Install pnpm 8.15.4
RUN npm install -g pnpm@8.15.4

WORKDIR /app

# Copy workspace configuration (root level)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy server package.json
COPY apps/server/package.json ./apps/server/

# Copy shared packages
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/prettier-config/package.json ./packages/prettier-config/

# Install dependencies without frozen lockfile
RUN pnpm install

# Copy all source files
COPY apps/server ./apps/server
COPY packages ./packages

# Build the server app
WORKDIR /app/apps/server
RUN pnpm build
WORKDIR /app

# Production stage
FROM node:18-alpine AS runner

# Install pnpm 8.15.4
RUN npm install -g pnpm@8.15.4

WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy server package.json
COPY apps/server/package.json ./apps/server/

# Copy shared packages package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/prettier-config/package.json ./packages/prettier-config/

# Install only production dependencies
RUN pnpm install --prod

# Copy built application from builder stage
COPY --from=builder /app/apps/server/dist /app/apps/server/dist

# Set environment variables
ENV NODE_ENV production
ENV PORT 3000

# Expose the port
EXPOSE 3000

# Start the server
CMD ["node", "/app/apps/server/dist/main.js"]