# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Install dependencies and build the production-ready React app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
# Use a lightweight NGINX image to serve the static files
FROM nginx:alpine

# Copy the built React app from the build stage into NGINX's serving directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose NGINX's default port
EXPOSE 80

# Command to start NGINX
CMD ["nginx", "-g", "daemon off;"]
