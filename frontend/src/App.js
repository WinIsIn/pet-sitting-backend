import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, theme, Space } from 'antd';
import { HomeOutlined, UserOutlined, HeartOutlined, CalendarOutlined, LogoutOutlined, GlobalOutlined } from '@ant-design/icons';
import { useAuth, AuthProvider } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { useTranslation } from './hooks/useTranslation';
import LanguageSwitch from './components/LanguageSwitch';

// 頁面組件
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Pets from './pages/Pets';
import Sitters from './pages/Sitters';
import SitterProfile from './pages/SitterProfile';
import SitterEdit from './pages/SitterEdit';
import Posts from './pages/Posts';

const { Header, Content, Footer } = Layout;

function AppContent() {
  const { user, logout } = useAuth();
  const { toggleLanguage, isChinese } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = user ? [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: t('navigation.home'),
    },
    {
      key: '/dashboard',
      icon: <UserOutlined />,
      label: t('navigation.dashboard'),
    },
    {
      key: '/bookings',
      icon: <CalendarOutlined />,
      label: t('navigation.bookings'),
    },
    {
      key: '/posts',
      icon: <HeartOutlined />,
      label: t('navigation.posts'),
    },
    ...(user.role === 'user' ? [
      {
        key: '/pets',
        icon: <HeartOutlined />,
        label: t('navigation.pets'),
      },
      {
        key: '/sitters',
        icon: <UserOutlined />,
        label: t('navigation.sitters'),
      },
    ] : []),
    ...(user.role === 'sitter' ? [
      {
        key: '/sitter/edit',
        icon: <UserOutlined />,
        label: t('navigation.sitterProfile'),
      },
    ] : []),
  ] : [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: t('navigation.home'),
    },
    {
      key: '/login',
      icon: <UserOutlined />,
      label: t('navigation.login'),
    },
    {
      key: '/register',
      icon: <UserOutlined />,
      label: t('navigation.register'),
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <Layout>
        <Header style={{ display: 'flex', alignItems: 'center', background: colorBgContainer }}>
          <div style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: '#1890ff', 
            marginRight: '48px' 
          }}>
            🐾 {isChinese ? '寵物保姆平台' : 'Pet Sitting Platform'}
          </div>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ flex: 1, minWidth: 0 }}
          />
          <Space>
            <LanguageSwitch />
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{t('navigation.welcome')}，{user.name}</span>
                <Button 
                  type="text" 
                  icon={<LogoutOutlined />} 
                  onClick={logout}
                >
                  {t('navigation.logout')}
                </Button>
              </div>
            )}
          </Space>
        </Header>

        <Content style={{ padding: '0 50px', marginTop: 16 }}>
          <div
            style={{
              background: colorBgContainer,
              minHeight: 280,
              padding: 24,
              borderRadius: borderRadiusLG,
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
              <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/bookings" element={user ? <Bookings /> : <Navigate to="/login" />} />
              <Route path="/posts" element={user ? <Posts /> : <Navigate to="/login" />} />
              <Route path="/pets" element={user ? <Pets /> : <Navigate to="/login" />} />
              <Route path="/sitters" element={user ? <Sitters /> : <Navigate to="/login" />} />
              <Route path="/sitters/:id" element={user ? <SitterProfile /> : <Navigate to="/login" />} />
              <Route path="/sitter/edit" element={user && user.role === 'sitter' ? <SitterEdit /> : <Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </Content>

        <Footer style={{ textAlign: 'center' }}>
          {isChinese ? '寵物保姆平台 ©2024 Created with ❤️' : 'Pet Sitting Platform ©2024 Created with ❤️'}
        </Footer>
      </Layout>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
