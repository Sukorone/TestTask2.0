FROM node:18-alpine

WORKDIR /app

# Копирование файлов package.json
COPY package.json ./

# Установка зависимостей
RUN yarn install

# Копирование остальных файлов проекта
COPY . .

# Сборка приложения
RUN yarn build

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"] 