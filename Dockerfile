FROM node:16

# Create app directory
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "node", "src/index.js" ]