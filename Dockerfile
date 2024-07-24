FROM node:latest

WORKDIR usr/src/app
COPY . .

RUN npm install

CMD npm run start
EXPOSE 3010
