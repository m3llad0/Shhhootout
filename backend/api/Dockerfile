FROM node:18.1.0-alpine3.14

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node package*.json ./


RUN npm install -g typescript
RUN npm i

USER node

COPY --chown=node:node . .

EXPOSE 8080

CMD [ "npm", "run", "dev" ]