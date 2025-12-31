# Build stage
FROM node:20-slim AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy root configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages packages
COPY apps/web apps/web

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the web app directly (bypass turbo caching issues)
WORKDIR /app/apps/web
ENV SKIP_ENV_VALIDATION=true
RUN pnpm run build

# Production stage
FROM node:20-slim AS runner

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=production
RUN corepack enable

WORKDIR /app

# Copy package files for pnpm install
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/packages packages
COPY --from=builder /app/apps/web/package.json apps/web/

# Copy built application
COPY --from=builder /app/apps/web/.next apps/web/.next
COPY --from=builder /app/apps/web/public apps/web/public
COPY --from=builder /app/apps/web/next.config.mjs apps/web/
COPY --from=builder /app/apps/web/src/env.mjs apps/web/src/

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

WORKDIR /app/apps/web

EXPOSE 3000

CMD ["pnpm", "run", "start"]
