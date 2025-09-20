# SPIRAL Dockerfile - Optimized for size
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install --production --only=production && npm cache clean --force

# Copy app source (working JavaScript server)
COPY server/index.js ./
COPY server/lib ./lib
COPY dist/public ./public

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose port 5000 for Code Engine
EXPOSE 5000

# Start command
CMD ["node", "index.js"]
