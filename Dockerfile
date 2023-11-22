FROM node

WORKDIR /gympal

COPY package*.json ./

COPY . /gympal

RUN npm install prettier -g

RUN npm install

RUN npm install cors -g

EXPOSE 3001

CMD [ "node", "app.js" ]

