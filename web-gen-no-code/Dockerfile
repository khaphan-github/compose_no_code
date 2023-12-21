# Use Node.js 18.10 as the base image
FROM node:18.10

# Set the working directory
WORKDIR /app

# Install Angular CLI globally
RUN npm install -g @angular/cli@10

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application files to the working directory
COPY . .

# Build the Angular app
RUN ng build

# Expose port 4200
EXPOSE 4200

# Command to run your application
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]
