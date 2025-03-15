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

# Debug: Check tsconfig files
WORKDIR /app/apps/server
RUN echo "=== tsconfig.json content ===" && cat tsconfig.json
RUN echo "=== tsconfig.build.json content ===" && cat tsconfig.build.json

# Try building with verbose output
RUN echo "=== Building with verbose output ===" && \
    pnpm exec nest build --debug

# Check for build output in different potential locations
RUN echo "=== Server directory structure after build ===" && \
    ls -la && \
    echo "=== Looking for dist directories in the project ===" && \
    find /app -name dist -type d | grep -v "node_modules" || echo "No dist directories found outside node_modules"

# Try a more direct build approach using tsc
RUN echo "=== Attempting direct TypeScript build ===" && \
    pnpm exec tsc -p tsconfig.build.json && \
    ls -la && \
    ls -la dist || echo "dist directory still not found"

# Check where turbo might be storing build outputs
RUN echo "=== Checking turbo cache directories ===" && \
    find /app -path "*/.turbo*" -type d

# Production stage - only use if build succeeds
FROM node:18-alpine AS runner

# Install pnpm 8.15.4
RUN npm install -g pnpm@8.15.4

WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy server package.json and necessary files
COPY apps/server/package.json ./apps/server/

# Copy shared packages package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/prettier-config/package.json ./packages/prettier-config/

# Install only production dependencies
RUN pnpm install --prod

# We'll skip copying the build output until we know where it is

# Set environment variables
ENV NODE_ENV production
ENV PORT 3000

# Expose the port
EXPOSE 3000

# This is just a placeholder - we'll need to update this once we find the build output
CMD ["echo", "Build output location not yet determined"]