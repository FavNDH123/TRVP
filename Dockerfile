FROM node:alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY backend ./backend
COPY frontend ./frontend

CMD npm run dev-back