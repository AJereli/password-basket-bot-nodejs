FROM node:12.14.1-stretch

WORKDIR /usr/scr/backend

COPY . .
RUN npm install

CMD [ "npm", "install", "ts-node", "-g" ]
CMD [ "npm", "run", "createOrmconfig" ]
CMD [ "npm", "run", "migrations:up" ]
CMD [ "nest", "build", "" ]
CMD [ "npm", "run", "start:prod" ]
