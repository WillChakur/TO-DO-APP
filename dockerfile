FROM node:20 AS builder
WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY . .

FROM node:20 
WORKDIR /app
COPY --from=builder /build /app
CMD ["npm", "start"]