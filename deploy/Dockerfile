FROM node:20-alpine

# Install build dependencies for potential native modules
RUN apk add --no-cache python3 make g++ cairo-dev jpeg-dev pango-dev giflib-dev

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./

# Install only essential runtime dependencies, skip problematic ones
RUN npm install --production --ignore-scripts && npm cache clean --force

# Copy the pre-built application files
COPY index.js ./
COPY public ./public

# Set environment variables  
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Health check (simplified)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# Start the application
CMD ["node", "index.js"]
