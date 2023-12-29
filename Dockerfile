# from node.js 18 and pnpm
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm@8.11.0

# Install app dependencies

RUN pnpm install --frozen-lockfile

# Bundle app source
COPY . .

EXPOSE 3000
EXPOSE 5000

# Run app
CMD [ "pnpm", "start" ]
