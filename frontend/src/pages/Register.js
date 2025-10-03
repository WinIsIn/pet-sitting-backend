import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Space, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;
const { Option } = Select;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const result = await register(values.name, values.email, values.password, values.role);
      if (result.success) {
        message.success('註冊成功！請登入您的帳號');
        navigate('/login');
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('註冊失敗，請稍後再試');
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
      <Card style={{ width: 450, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ marginBottom: '8px' }}>
            🐾 加入我們
          </Title>
          <Text type="secondary">創建您的帳號開始使用</Text>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[
              { required: true, message: '請輸入姓名！' },
              { min: 2, message: '姓名至少需要 2 個字符！' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="請輸入您的姓名"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="電子郵件"
            rules={[
              { required: true, message: '請輸入電子郵件！' },
              { type: 'email', message: '請輸入有效的電子郵件格式！' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="請輸入您的電子郵件"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密碼"
            rules={[
              { required: true, message: '請輸入密碼！' },
              { min: 6, message: '密碼至少需要 6 個字符！' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="請輸入您的密碼"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="確認密碼"
            dependencies={['password']}
            rules={[
              { required: true, message: '請確認密碼！' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('兩次輸入的密碼不一致！'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="請再次輸入密碼"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '請選擇角色！' }]}
          >
            <Select placeholder="請選擇您的角色" size="large">
              <Option value="user">寵物主人</Option>
              <Option value="sitter">寵物保姆</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              size="large"
              style={{ width: '100%' }}
            >
              註冊
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Space>
              <Text type="secondary">已有帳號？</Text>
              <Link to="/login">
                <Text type="primary" style={{ fontWeight: 'bold' }}>
                  立即登入
                </Text>
              </Link>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
