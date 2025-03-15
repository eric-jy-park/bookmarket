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

# Move to server directory
WORKDIR /app/apps/server

# Run build
RUN pnpm build

# Debug: List all files and directories to find the build output
RUN echo "=== Contents of /app/apps/server directory ===" && \
    ls -la && \
    echo "=== Searching for any 'dist' directory in the entire container ===" && \
    find / -name "dist" -type d 2>/dev/null || echo "No dist directories found"

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

# We'll modify this path once we know where the build output is
# For now, try to copy from where it should be based on standard NestJS configurations
COPY --from=builder /app/apps/server/dist/. /app/apps/server/dist/

# Set environment variables
ENV NODE_ENV production
ENV PORT 3000

# Expose the port
EXPOSE 3000

# Start the server (we'll update this path if needed)
CMD ["node", "/app/apps/server/dist/main.js"]