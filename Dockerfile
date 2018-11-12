FROM node:8.11.3
WORKDIR /app
COPY package.json /app
COPY . /app
RUN npm install
RUN npm run build-server
CMD npm run start
