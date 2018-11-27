FROM node:8.12.0-alpine
WORKDIR /app
COPY package.json /app
COPY . /app
RUN npm install
RUN npm run build-server
CMD npm run start
