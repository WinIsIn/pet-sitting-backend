# 寵物保姆平台前端

這是一個基於 React 的寵物保姆平台前端應用程式，提供現代化的用戶界面和完整的用戶體驗。

## 功能特色

- 🏠 **首頁展示** - 平台介紹和功能特色
- 👤 **用戶認證** - 註冊、登入、登出功能
- 🐾 **寵物管理** - 添加、編輯、刪除寵物信息
- 👥 **保姆列表** - 瀏覽和搜索保姆
- 📅 **預約管理** - 創建和管理預約
- 🏠 **個人中心** - 用戶信息和統計數據
- 🌐 **多語言支援** - 中英文切換功能

## 技術棧

- **React 18** - 前端框架
- **Ant Design** - UI 組件庫
- **React Router** - 路由管理
- **Axios** - HTTP 客戶端
- **Day.js** - 日期處理
- **Context API** - 狀態管理
- **國際化 (i18n)** - 多語言支援

## 安裝和運行

### 前置要求

- Node.js (版本 14 或更高)
- npm 或 yarn

### 安裝依賴

```bash
cd frontend
npm install
```

### 啟動開發服務器

```bash
npm start
```

應用程式將在 `http://localhost:3000` 啟動。

### 構建生產版本

```bash
npm run build
```

## 項目結構

```
frontend/
├── public/                 # 靜態文件
├── src/
│   ├── contexts/          # React Context
│   │   └── AuthContext.js # 認證上下文
│   ├── pages/             # 頁面組件
│   │   ├── Home.js        # 首頁
│   │   ├── Login.js       # 登入頁面
│   │   ├── Register.js    # 註冊頁面
│   │   ├── Dashboard.js   # 個人中心
│   │   ├── Bookings.js    # 預約管理
│   │   ├── Pets.js        # 寵物管理
│   │   └── Sitters.js     # 保姆列表
│   ├── App.js             # 主應用組件
│   ├── index.js           # 應用入口
│   └── index.css          # 全局樣式
├── package.json           # 項目配置
└── README.md             # 項目說明
```

## 頁面說明

### 首頁 (Home)
- 平台介紹和功能特色
- 服務流程說明
- 統計數據展示

### 登入/註冊 (Login/Register)
- 用戶認證功能
- 表單驗證
- 錯誤處理

### 個人中心 (Dashboard)
- 用戶信息展示
- 統計數據
- 最近預約和寵物
- 快速操作按鈕

### 預約管理 (Bookings)
- 預約列表展示
- 創建新預約
- 預約狀態管理
- 保姆接受/拒絕預約

### 寵物管理 (Pets)
- 寵物列表
- 添加/編輯/刪除寵物
- 寵物信息管理

### 保姆列表 (Sitters)
- 保姆卡片展示
- 搜索和篩選功能
- 保姆詳細信息
- 預約按鈕

### 多語言支援
- 中英文切換按鈕
- 完整的翻譯系統
- 動態語言切換
- 所有頁面內容支援雙語

## API 配置

前端配置為代理到後端 API (`http://localhost:5000`)。確保後端服務器正在運行。

## 環境變量

可以在 `.env` 文件中配置環境變量：

```
REACT_APP_API_URL=http://localhost:5000
```

## 開發說明

### 添加新頁面

1. 在 `src/pages/` 目錄下創建新的頁面組件
2. 在 `src/App.js` 中添加路由
3. 在導航菜單中添加對應的菜單項

### 樣式定制

- 使用 Ant Design 的主題配置
- 在 `src/index.css` 中添加全局樣式
- 使用內聯樣式或 CSS 模塊

### 狀態管理

- 使用 React Context 進行全局狀態管理
- 使用 React Hooks 進行本地狀態管理

## 部署

### 構建生產版本

```bash
npm run build
```

### 部署到靜態服務器

將 `build` 目錄的內容部署到任何靜態文件服務器。

## 故障排除

### 常見問題

1. **API 連接失敗**
   - 確保後端服務器正在運行
   - 檢查 API 端點配置

2. **依賴安裝失敗**
   - 清除 node_modules 並重新安裝
   - 檢查 Node.js 版本

3. **路由問題**
   - 確保所有路由都已正確配置
   - 檢查 React Router 版本

## 貢獻

歡迎提交 Issue 和 Pull Request 來改進這個項目。

## 授權

MIT License
