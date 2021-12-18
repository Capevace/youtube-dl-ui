FROM node:16

# Create app directory
WORKDIR /app

RUN apt-get update && apt-get install -y \
    youtube-dl

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "node", "src/index.js" ]