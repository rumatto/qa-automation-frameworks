FROM mcr.microsoft.com/playwright:v1.59.1-noble

ENV CI=true \
    TEST_ENV=testing

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

CMD ["npx", "playwright", "test"]
