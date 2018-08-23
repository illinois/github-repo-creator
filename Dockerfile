FROM mhart/alpine-node:10
WORKDIR /app/
COPY . .
RUN npm ci

CMD npm run start:docker
