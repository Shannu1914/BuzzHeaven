# Use Node.js LTS
FROM node:20

# Set working directory
WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy backend code
COPY backend/ ./

# Expose backend port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
