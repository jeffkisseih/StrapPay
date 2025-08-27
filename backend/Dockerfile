FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json first for caching
COPY package*.json ./

# Install deps
RUN npm install --production

# Copy rest of the code
COPY . .

# Expose backend port
EXPOSE 5000

# Start backend
CMD ["node", "index.js"]



