FROM node:18-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@9.0.0

WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy package.json files for all workspaces (for better layer caching)
COPY apps/server/package.json ./apps/server/
COPY apps/web/package.json ./apps/web/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/prettier-config/package.json ./packages/prettier-config/

# Install all dependencies (including dev dependencies for building)
RUN pnpm install --frozen-lockfile

# Copy all source files
COPY . .

# Build the server app
RUN pnpm --filter bookmarket-server build

# Production stage
FROM node:18-alpine AS runner

# Install pnpm
RUN npm install -g pnpm@9.0.0

WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy package.json files for all workspaces
COPY apps/server/package.json ./apps/server/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/prettier-config/package.json ./packages/prettier-config/

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built application from builder stage
COPY --from=builder /app/apps/server/dist ./apps/server/dist

# Expose the port your NestJS app runs on (adjust if needed)
EXPOSE 3000

# Set the working directory to the server app
WORKDIR /app/apps/server

# Start the server
CMD ["node", "dist/main.js"]