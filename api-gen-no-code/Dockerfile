# Use an official Node.js runtime as a parent image
FROM node:18.16.0

# Set the working directory
WORKDIR /usr/src/api

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./


# Install app dependencies
RUN npm install --force

# Copy the rest of the application code
COPY . .

# Expose port 3000 (assuming your application listens on this port)
EXPOSE 3000

# Define the command to run your app
CMD ["sh", "-c", "npx nx run interated:build:production"]

# Environment variables
ENV DATABASE_HOST_NAME=postgres
ENV DATABASE_PORT=5432
ENV DATABASE_USERNAME=admin@111
ENV DATABASE_PASSWORD=admin@111
ENV DATABASE_SCHEMA=maindb
ENV DATABASE_TYPE=maindb
ENV SERVER_SECRET_KEY=khaphan@123FFSecretKey

# Volumes
VOLUME /usr/src/api/node_modules
