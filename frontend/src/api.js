import axios from 'axios';

// 強制更新：確保使用正確的 Railway 域名
const API_URL = process.env.REACT_APP_API_URL || 'https://web-production-3ab4f.up.railway.app';

// 建立 axios 實例
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 秒超時
  headers: { 
    'Content-Type': 'application/json' 
  }
});

// 請求攔截器：自動添加 Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 回應攔截器：處理錯誤
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token 過期，清除本地存儲
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
