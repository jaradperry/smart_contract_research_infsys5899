# Use the official Node.js image as a base
FROM node:18

# Set the working directory in the Docker image
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./


# Copy the rest of your application code
COPY . .

# Expose the port for the chaincode if needed
EXPOSE 3000

# Command to run the chaincode
CMD ["node", "node_modules/fabric-chaincode-node/libraries/fabric-shim/index.js", "start"]

