# syntax=docker/dockerfile:1.4

# =========================
# Stage 0: Build
# =========================
FROM node:20 AS build

# 可讓 Cloud Build 傳入 cache key 前綴
ARG CACHE_KEY

WORKDIR /app

# 只複製 package 檔案以便使用快取
COPY package*.json ./

# 使用 npm 原生快取路徑，並掛載 cache
RUN --mount=type=cache,id=${CACHE_KEY}-npm-cache,target=/root/.npm \
    npm ci --omit=dev

# 再複製專案其他檔案
COPY . .

# =========================
# Stage 1: Runtime
# =========================
FROM node:20-slim AS runtime

WORKDIR /app

# 複製 build 階段的結果
COPY --from=build /app ./

# 開放 port（可依專案設定）
EXPOSE 5000

# 啟動應用程式
CMD ["npm", "start"]
