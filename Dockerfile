# from node.js 18 and pnpm
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY . .

# Install pnpm
RUN npm install -g pnpm@8.11.0

# Install app dependencies

RUN pnpm install --frozen-lockfile

# Build app
RUN pnpm run build

EXPOSE 3000
EXPOSE 50051

# Run app
CMD [ "pnpm", "start" ]
