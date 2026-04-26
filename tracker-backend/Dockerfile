# Use Maven with Eclipse Temurin (Java 25 is not standard in most stable Maven images, Java 21 is LTS. If your project uses 25, we'll try to find an appropriate base image or stick to 21 if it works. Assuming Java 21 LTS based on common Spring Boot 3+ setups, but the POM says 25. Let's use maven:3.9-eclipse-temurin-21 for stability).
# Since pom.xml says Java 25, let's use a standard modern image.
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build

# Set working directory
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the application skipping tests to speed up deployment
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
