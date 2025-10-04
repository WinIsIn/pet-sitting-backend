# 使用 Node.js 20 官方映像
FROM node:20-alpine

# 設置工作目錄
WORKDIR /app

# 複製 package 文件
COPY package*.json ./

# 安裝依賴（使用緩存掛載）
RUN --mount=type=cache,id=npm-cache,target=/root/.npm \
    npm ci --omit=dev

# 複製應用程式代碼
COPY . .

# 暴露端口
EXPOSE 5000

# 啟動應用程式
CMD ["npm", "start"]
