FROM node:20-alpine

WORKDIR /home/node/app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies (including devDependencies)
RUN npm install