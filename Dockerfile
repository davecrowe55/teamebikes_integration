#syntax = <frontend image>, e.g. # syntax = docker/dockerfile:1.0-experimental
FROM node:14
WORKDIR /app
COPY . /app
RUN ["npm", "install"]
EXPOSE 8080
ENTRYPOINT ["npm", "run", "start:dev"]
CMD ["node", "src/index.js"]