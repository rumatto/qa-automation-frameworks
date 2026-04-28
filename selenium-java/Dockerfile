FROM debian:bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive \
    CHROME_BIN=/usr/bin/chromium

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
      ca-certificates \
      chromium \
      openjdk-17-jdk \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace/selenium-java

COPY selenium-java/gradlew selenium-java/build.gradle selenium-java/settings.gradle ./
COPY selenium-java/gradle ./gradle
RUN ./gradlew --version --no-daemon

COPY selenium-java/src ./src
COPY demo-services/test-api/contracts ../demo-services/test-api/contracts

CMD ["./gradlew", "test", "allureReport", "--no-daemon"]
