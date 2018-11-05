from node:8.11.3-onbuild

MAINTAINER Nischal Gautam 
RUN npm install 
RUN npm run build-server
CMD npm run start