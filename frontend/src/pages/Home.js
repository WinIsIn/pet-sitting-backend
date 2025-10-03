import React from 'react';
import { Card, Row, Col, Button, Typography, Space, Divider } from 'antd';
import { HeartOutlined, SafetyOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';

const { Title, Paragraph } = Typography;

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  const features = [
    {
      icon: <HeartOutlined style={{ fontSize: '48px', color: '#1890ff' }} />,
      title: t('home.features.professional.title'),
      description: t('home.features.professional.description')
    },
    {
      icon: <SafetyOutlined style={{ fontSize: '48px', color: '#52c41a' }} />,
      title: t('home.features.safe.title'),
      description: t('home.features.safe.description')
    },
    {
      icon: <ClockCircleOutlined style={{ fontSize: '48px', color: '#faad14' }} />,
      title: t('home.features.service.title'),
      description: t('home.features.service.description')
    },
    {
      icon: <UserOutlined style={{ fontSize: '48px', color: '#722ed1' }} />,
      title: t('home.features.personalized.title'),
      description: t('home.features.personalized.description')
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* 主標題區域 */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <Title level={1} style={{ marginBottom: '16px' }}>
          {t('home.title')}
        </Title>
        <Paragraph style={{ fontSize: '18px', marginBottom: '32px' }}>
          {t('home.subtitle')}
        </Paragraph>
        {!user && (
          <Space size="large">
            <Button type="primary" size="large" onClick={() => navigate('/register')}>
              {t('home.registerNow')}
            </Button>
            <Button size="large" onClick={() => navigate('/login')}>
              {t('home.loginAccount')}
            </Button>
          </Space>
        )}
        {user && (
          <Space size="large">
            <Button type="primary" size="large" onClick={() => navigate('/sitters')}>
              {t('home.findSitter')}
            </Button>
            <Button size="large" onClick={() => navigate('/bookings')}>
              {t('home.viewBookings')}
            </Button>
          </Space>
        )}
      </div>

      <Divider />

      {/* 功能特色 */}
      <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>
        {t('home.whyChooseUs')}
      </Title>
      
      <Row gutter={[24, 24]} style={{ marginBottom: '48px' }}>
        {features.map((feature, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card 
              hoverable 
              style={{ textAlign: 'center', height: '100%' }}
              bodyStyle={{ padding: '24px 16px' }}
            >
              <div style={{ marginBottom: '16px' }}>
                {feature.icon}
              </div>
              <Title level={4} style={{ marginBottom: '8px' }}>
                {feature.title}
              </Title>
              <Paragraph style={{ color: '#666' }}>
                {feature.description}
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      <Divider />

      {/* 服務流程 */}
      <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>
        {t('home.howToUse')}
      </Title>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card title={t('home.steps.step1.title')} style={{ textAlign: 'center' }}>
            <Paragraph>
              {t('home.steps.step1.description')}
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title={t('home.steps.step2.title')} style={{ textAlign: 'center' }}>
            <Paragraph>
              {t('home.steps.step2.description')}
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title={t('home.steps.step3.title')} style={{ textAlign: 'center' }}>
            <Paragraph>
              {t('home.steps.step3.description')}
            </Paragraph>
          </Card>
        </Col>
      </Row>

      
    </div>
  );
};

export default Home;
