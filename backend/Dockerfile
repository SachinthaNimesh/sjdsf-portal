# Use a minimal Go base image
FROM golang:1.24-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code
COPY . .

# Build the Go application
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Use a minimal image for the final stage
FROM alpine:latest

# Install ca-certificates for HTTPS requests
RUN apk --no-cache add ca-certificates

# Create a non-root user with a specific UID (e.g., 10014)
RUN addgroup -g 10014 -S appgroup && adduser -u 10014 -S appuser -G appgroup

# Create app directory and set proper ownership
RUN mkdir -p /app && chown appuser:appgroup /app

# Also create config directory and set ownership
RUN mkdir -p /app/config && chown appuser:appgroup /app/config

# Set the working directory
WORKDIR /app

# Copy the built executable from the builder stage
COPY --from=builder /app/main .

# Copy the CA certificate into the image
COPY config/ca.pem /app/config/ca.pem

# Change ownership of the executable and ca.pem
RUN chown appuser:appgroup /app/main /app/config/ca.pem

# Expose the port your application listens on (if applicable)
EXPOSE 8080

# Switch to the non-root user
USER 10014

# Run the executable
CMD ["./main"]