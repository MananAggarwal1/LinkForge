# Multi-stage Dockerfile optimized for Render Free Tier (512MB RAM)
# Stage 1: Build the Spring Boot JAR
FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build production JAR skipping test execution
RUN mvn clean package -DskipTests

# Stage 2: Minimal Java Runtime Environment
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the built JAR from Stage 1
COPY --from=build /app/target/linkforge-backend-1.0.0.jar app.jar

ENV PORT=8080
EXPOSE 8080

# Use shell execution so ${PORT} expands dynamically to Render's assigned port
ENTRYPOINT ["sh", "-c", "exec java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT:-8080} -jar app.jar"]
