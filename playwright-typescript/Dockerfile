FROM mcr.microsoft.com/playwright:v1.59.1-noble

ENV CI=true \
    TEST_ENV=testing

WORKDIR /workspace/playwright-typescript

COPY playwright-typescript/package.json playwright-typescript/package-lock.json ./
RUN npm ci

COPY playwright-typescript ./
COPY demo-services/test-api/contracts ../demo-services/test-api/contracts

CMD ["npx", "playwright", "test"]
