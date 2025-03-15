FROM node:18-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@8.15.4

WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy package.json files for server and shared packages
COPY apps/server/package.json ./apps/server/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/prettier-config/package.json ./packages/prettier-config/

# Install dependencies
RUN pnpm install

# Copy source files
COPY apps/server ./apps/server
COPY packages ./packages

# Build the app using direct TypeScript compilation
WORKDIR /app/apps/server
RUN pnpm exec tsc -p tsconfig.build.json

# Production stage
FROM node:18-alpine AS runner

# Install pnpm
RUN npm install -g pnpm@8.15.4

WORKDIR /app

# Copy configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/prettier-config/package.json ./packages/prettier-config/

# Install production dependencies
RUN pnpm install --prod

# Copy built application
COPY --from=builder /app/apps/server/dist /app/apps/server/dist

# Set environment variables
ENV NODE_ENV production
ENV PORT 3000

# Expose port and start the app
EXPOSE 3000
CMD ["node", "/app/apps/server/dist/main"]