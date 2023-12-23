# Use an official Node.js runtime as a parent image
FROM node:18.16.0

# Set the working directory
WORKDIR /usr/src/api

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install --force

RUN npx nx run-many --target=e2e --all=true --verbose=true

# Copy the rest of the application code
COPY './dist/apps/interated' ./

# Expose port 3000 (assuming your application listens on this port)
EXPOSE  3000

# Define the command to run your app
CMD ["sh", "-c", "node main.js"]

# Volumes
VOLUME /usr/src/api/node_modules
