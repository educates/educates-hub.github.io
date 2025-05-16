# Stage 1: Build the site
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the project files
COPY . .

# Build the Astro site
RUN npm run build

# Stage 2: Serve the built site with a static server
FROM node:20-alpine AS runner

WORKDIR /app

# Install a simple static file server
RUN npm install -g serve

# Copy the built site from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the port Astro's preview server uses (default: 4321)
EXPOSE 4321

# Serve the static site
CMD ["serve", "dist", "-l", "4321"] 