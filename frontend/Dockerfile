FROM node:20-alpine

RUN adduser -D user
WORKDIR /home/user/frontend

COPY package.json package-lock.json ./
RUN npm install
COPY . .
ENV PATH /home/user/frontend/node_modules/.bin:$PATH
RUN npm run build
RUN npm install -g serve
EXPOSE 3000
USER user
CMD ["serve", "-s", "build"]
