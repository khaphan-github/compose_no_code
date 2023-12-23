# Use a smaller Node.js base image
FROM node:18.16.0-alpine

# Set the working directory
WORKDIR /usr/src/api

# Copy only package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./
COPY . .

# Install app dependencies
RUN npm install -g nx@latest
RUN npm install --force

# Copy the rest of the application code

# Run production build
RUN npx nx run org.core.api-generator:build:production

# Expose port 3000 (assuming your application listens on this port)
EXPOSE 3000

# Define the command to run your app
CMD ["node", "main.js"]

# Volumes
VOLUME /usr/src/api/node_modules
