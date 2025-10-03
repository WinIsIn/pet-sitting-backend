import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Avatar, 
  Typography, 
  Button, 
  Rate, 
  Tag, 
  Space, 
  Row, 
  Col, 
  Divider, 
  message,
  Spin,
  Image
} from 'antd';
import { 
  ArrowLeftOutlined, 
  PhoneOutlined, 
  StarOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  DollarOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { useTranslation } from '../hooks/useTranslation';

const { Title, Text, Paragraph } = Typography;

const SitterProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [sitter, setSitter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSitterProfile();
  }, [id]);

  const fetchSitterProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/sitters/${id}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      console.log('保姆資料:', response.data);
      setSitter(response.data);
    } catch (error) {
      console.error('獲取保姆資料失敗:', error);
      message.error(t('sitterProfile.fetchFailed'));
      navigate('/sitters');
    } finally {
      setLoading(false);
    }
  };

  const getPetTypeIcon = (type) => {
    const icons = {
      dog: '🐕',
      cat: '🐱',
      bird: '🐦',
      fish: '🐠',
      rabbit: '🐰',
      hamster: '🐹',
      other: '🐾'
    };
    return icons[type] || '🐾';
  };

  const getPetTypeText = (type) => {
    return t(`sitters.types.${type}`);
  };

  const handleBookService = () => {
    // 跳轉到預約頁面，並傳遞保姆 ID 作為查詢參數
    navigate(`/bookings?sitter=${id}`);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>{t('sitterProfile.loading')}</div>
      </div>
    );
  }

  if (!sitter) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={3}>{t('sitterProfile.notFound')}</Title>
        <Button type="primary" onClick={() => navigate('/sitters')}>
          {t('sitterProfile.backToList')}
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* 返回按鈕 */}
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/sitters')}
        style={{ marginBottom: '20px' }}
      >
        {t('sitterProfile.backToList')}
      </Button>

      <Row gutter={[24, 24]}>
        {/* 左側：基本資料 */}
        <Col xs={24} lg={16}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '24px' }}>
              <Avatar 
                size={80} 
                src={sitter.user?.avatar ? (sitter.user.avatar.startsWith('http') ? sitter.user.avatar : `${process.env.REACT_APP_API_URL || ''}/uploads/${sitter.user.avatar}`) : null}
                icon={<StarOutlined />}
                style={{ backgroundColor: '#1890ff', marginRight: '20px' }}
              />
              <div style={{ flex: 1 }}>
                <Title level={2} style={{ margin: 0, marginBottom: '8px' }}>
                  {sitter.user?.name || t('sitterProfile.unknownUser')}
                </Title>
                <div style={{ marginBottom: '8px' }}>
                  <Rate 
                    disabled 
                    defaultValue={sitter.rating || 0} 
                    style={{ fontSize: '16px' }}
                  />
                  <Text type="secondary" style={{ marginLeft: '8px' }}>
                    ({sitter.rating || 0} {t('sitterProfile.rating')})
                  </Text>
                </div>
                {sitter.bio && (
                  <Paragraph style={{ fontSize: '16px', marginBottom: 0 }}>
                    {sitter.bio}
                  </Paragraph>
                )}
              </div>
            </div>

            <Divider />

            {/* 服務專長 */}
            {sitter.services && sitter.services.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <Title level={4}>{t('sitterProfile.serviceSpecialties')}</Title>
                <Space wrap>
                  {sitter.services.map(service => (
                    <Tag 
                      key={service} 
                      color="blue" 
                      style={{ fontSize: '14px', padding: '4px 12px' }}
                    >
                      {getPetTypeIcon(service)} {getPetTypeText(service)}
                    </Tag>
                  ))}
                </Space>
              </div>
            )}

            {/* 服務詳情 */}
            <div style={{ marginBottom: '24px' }}>
              <Title level={4}>{t('sitterProfile.serviceDetails')}</Title>
              <Row gutter={[16, 16]}>
                {sitter.ratePerDay && (
                  <Col xs={24} sm={12}>
                    <Card size="small" style={{ textAlign: 'center' }}>
                      <DollarOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: '8px' }} />
                      <div>
                        <Text strong style={{ fontSize: '18px' }}>NZD$ {sitter.ratePerDay}</Text>
                        <div><Text type="secondary">{t('sitterProfile.dailyRate')}</Text></div>
                      </div>
                    </Card>
                  </Col>
                )}
                {sitter.location && (
                  <Col xs={24} sm={12}>
                    <Card size="small" style={{ textAlign: 'center' }}>
                      <EnvironmentOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
                      <div>
                        <Text strong style={{ fontSize: '16px' }}>{sitter.location}</Text>
                        <div><Text type="secondary">{t('sitterProfile.serviceArea')}</Text></div>
                      </div>
                    </Card>
                  </Col>
                )}
              </Row>
            </div>

            {/* 可用時間 */}
            {sitter.availableDates && sitter.availableDates.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <Title level={4}>{t('sitterProfile.availableDates')}</Title>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {sitter.availableDates.map((date, index) => (
                    <Tag key={index} color="green">
                      <CalendarOutlined /> {new Date(date).toLocaleDateString()}
                    </Tag>
                  ))}
                </div>
              </div>
            )}

            {/* 圖片展示 */}
            {sitter.imageUrl && (
              <div style={{ marginBottom: '24px' }}>
                <Title level={4}>{t('sitterProfile.photoDisplay')}</Title>
                <Image
                  src={sitter.imageUrl}
                  alt="保姆照片"
                  style={{ width: '100%', maxWidth: '400px', borderRadius: '8px' }}
                />
              </div>
            )}
          </Card>
        </Col>

        {/* 右側：聯絡和預約 */}
        <Col xs={24} lg={8}>
          <Card title={t('sitterProfile.contactInfo')} style={{ marginBottom: '16px' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Button 
                type="primary" 
                size="large" 
                block 
                icon={<PhoneOutlined />}
                onClick={handleBookService}
              >
                {t('sitterProfile.bookNow')}
              </Button>
            </Space>
          </Card>

          {/* 評價區域 */}
          <Card title={t('sitterProfile.userReviews')}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Text type="secondary">{t('sitterProfile.noReviews')}</Text>
              <div style={{ marginTop: '8px' }}>
                <Rate disabled defaultValue={0} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SitterProfile;




