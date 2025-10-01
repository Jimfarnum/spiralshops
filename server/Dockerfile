# SPIRAL Backend Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production --only=production && npm cache clean --force

# Copy server files
COPY index.js ./
COPY lib ./lib

# Copy production build assets
COPY ../dist/public ./public

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "index.js"]