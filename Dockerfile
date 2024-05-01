# Use the official Node.js base image
FROM node:10

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Build the Angular app
RUN npm run build --prod

# Expose the default Angular port
EXPOSE 4200

# Start the Angular app when the container starts
CMD ["npm", "start"]