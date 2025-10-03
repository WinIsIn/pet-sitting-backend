import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const result = await login(values.email, values.password);
      if (result.success) {
        message.success(t('auth.login.loginSuccess'));
        navigate('/dashboard');
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error(t('auth.login.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '60vh' 
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ marginBottom: '8px' }}>
            {t('auth.login.title')}
          </Title>
          <Text type="secondary">{t('auth.login.subtitle')}</Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="email"
            label={t('auth.login.email')}
            rules={[
              { required: true, message: t('auth.login.emailRequired') },
              { type: 'email', message: t('auth.login.emailInvalid') }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder={t('auth.login.email')}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={t('auth.login.password')}
            rules={[
              { required: true, message: t('auth.login.passwordRequired') },
              { min: 6, message: t('auth.login.passwordMinLength') }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t('auth.login.password')}
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              size="large"
              style={{ width: '100%' }}
            >
              {t('auth.login.loginButton')}
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Space>
              <Text type="secondary">{t('auth.login.noAccount')}</Text>
              <Link to="/register">
                <Text type="primary" style={{ fontWeight: 'bold' }}>
                  {t('auth.login.registerNow')}
                </Text>
              </Link>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
