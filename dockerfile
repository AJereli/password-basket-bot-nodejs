FROM node:12.14.1-stretch

WORKDIR /usr/scr/backend

COPY . .
RUN npm install

# CMD [ "npm", "install", "ts-node", "-g" ]
# CMD [ "npm", "install", "nest", "-g" ]
RUN npm install ts-node nest -g
RUN npm run createOrmconfig
RUN npm run migrations:up
RUN npm run start

# CMD [ "npm", "run", "createOrmconfig"]
# CMD [ "npm", "run", "migrations:up"]
# CMD [ "nest", "build"]
# CMD [ "npm", "run", "start"]
