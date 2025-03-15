FROM node:18-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@9.0.0

WORKDIR /app

# Copy workspace configuration (root level)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy server package.json
COPY apps/server/package.json ./apps/server/

# Copy shared packages
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/prettier-config/package.json ./packages/prettier-config/

# Install dependencies for server (and shared packages)
RUN pnpm install --frozen-lockfile

# Copy only the files needed for the server build
COPY apps/server ./apps/server
COPY packages ./packages

# Build the server app
RUN pnpm --filter bookmarket-server build

# Production stage
FROM node:18-alpine AS runner

# Install pnpm
RUN npm install -g pnpm@9.0.0

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
RUN pnpm install --frozen-lockfile --prod

# Copy built application from builder stage
COPY --from=builder /app/apps/server/dist ./apps/server/dist

# Set environment variables
ENV NODE_ENV production

# Expose the port your NestJS app runs on (adjust if needed)
EXPOSE 3000

# Start the server
CMD ["node", "apps/server/dist/main.js"]