FROM mhart/alpine-node:10
WORKDIR /app/
COPY . .
RUN npm install

CMD npm run start