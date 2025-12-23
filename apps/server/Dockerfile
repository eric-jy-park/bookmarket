FROM node:20

# Set up PNPM
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Set the working directory
WORKDIR /app

# Copy root configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy shared packages source code
# Assuming shared packages are in 'packages/' relative to the root
COPY packages packages

# Copy the server app source code
COPY apps/server apps/server

# Install only the server dependencies and its workspace dependencies
RUN pnpm install 

# Build the server app
RUN pnpm run build

# Change working directory to the server app's directory
WORKDIR /app/apps/server

# Expose the port and define the entry point
EXPOSE 8000

ENTRYPOINT ["pnpm", "run", "start"]
