# Multi-stage Dockerfile optimized for Render Free Tier (512MB RAM)
# Stage 1: Build the Spring Boot JAR
FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Cache Maven dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build production JAR
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal Java Runtime Environment
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the built JAR from Stage 1
COPY --from=build /app/target/linkforge-backend-1.0.0.jar app.jar

# Dynamic PORT assigned by cloud host (Render defaults to 8080 or sets $PORT)
ENV PORT=8080
EXPOSE 8080

# Keep JVM memory within Render 512MB container limits
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
