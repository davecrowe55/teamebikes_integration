#syntax = <frontend image>, e.g. # syntax = docker/dockerfile:1.0-experimental
FROM node:14
WORKDIR /app
COPY . /app
RUN ["npm", "install"]
EXPOSE 5000
ENTRYPOINT ["npm", "run", "start:dev"]