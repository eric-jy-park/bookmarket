# Build stage
FROM node:20-slim AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy dependency manifests first (changes rarely → cached layer)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/eslint-config/package.json packages/eslint-config/
COPY packages/prettier-config/package.json packages/prettier-config/
COPY packages/typescript-config/package.json packages/typescript-config/
COPY apps/server/package.json apps/server/

# Install dependencies with pnpm store cache
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy source code (changes often → layer after install)
COPY packages packages
COPY apps/server apps/server

# Build
WORKDIR /app/apps/server
RUN pnpm run build

# Production stage
FROM node:20-slim AS runner

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=production
RUN corepack enable

WORKDIR /app

# Copy dependency manifests
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/packages/eslint-config/package.json packages/eslint-config/
COPY --from=builder /app/packages/prettier-config/package.json packages/prettier-config/
COPY --from=builder /app/packages/typescript-config/package.json packages/typescript-config/
COPY --from=builder /app/apps/server/package.json apps/server/

# Install prod dependencies with pnpm store cache
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --prod

# Copy built output
COPY --from=builder /app/apps/server/dist apps/server/dist

WORKDIR /app/apps/server

EXPOSE 8000

CMD ["node", "dist/main"]
