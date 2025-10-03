import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ConfigProvider } from 'antd';
import zhTW from 'antd/locale/zh_TW';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ConfigProvider locale={zhTW}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
