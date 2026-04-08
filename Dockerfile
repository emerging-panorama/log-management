# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
# Build arguments for environment variables
ARG GEMINI_API_KEY
ARG APP_URL

ENV GEMINI_API_KEY=$GEMINI_API_KEY
ENV APP_URL=$APP_URL

RUN npm run build

# Stage 2: Serve
FROM nginx:stable-alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
