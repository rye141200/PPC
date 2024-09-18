# Use the official Node.js image as a base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

# Install development dependencies (for building assets like JS and CSS)
RUN npm install --only=dev

# Copy the rest of the application code
COPY . .

# Build Tailwind CSS and JS bundles for production
RUN npm run build_tw
RUN npm run build:js

# Expose the port your app runs on (optional, depending on your server)
EXPOSE 3000

# Set the environment to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "run", "start:prod"]
