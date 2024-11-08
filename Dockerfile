# Dockerfile
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy tsconfig.json and other config files
COPY tsconfig.json ./
COPY .env ./

# Copy the rest of the application source code
COPY src src

# Expose the port your app runs on
EXPOSE 3000

# Use nodemon to watch for changes in the src folder and restart automatically
CMD ["yarn", "run", "dev"]