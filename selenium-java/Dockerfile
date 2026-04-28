FROM debian:bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive \
    CHROME_BIN=/usr/bin/chromium

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
      ca-certificates \
      chromium \
      openjdk-17-jdk \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY gradlew build.gradle settings.gradle ./
COPY gradle ./gradle
RUN ./gradlew --version --no-daemon

COPY src ./src

CMD ["./gradlew", "test", "allureReport", "--no-daemon"]
