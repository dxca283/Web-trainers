# ================================
# 1️⃣ BUILD STAGE
# ================================
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY .env.production .env.production
COPY . .
RUN npm run build

# ================================
# 2️⃣ RUN STAGE
# ================================
FROM node:20-alpine AS prod

WORKDIR /app
COPY --from=build /app/dist ./dist
RUN npm install -g serve

EXPOSE 5173
ENV NODE_ENV=production

CMD ["serve", "-s", "dist", "-l", "5173"]
