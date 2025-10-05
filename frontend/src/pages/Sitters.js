import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Avatar, Typography, Button, Rate, Tag, Space, Input, Select, message } from 'antd';
import { SearchOutlined, UserOutlined, StarOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from '../hooks/useTranslation';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const Sitters = () => {
  const { t } = useTranslation();
  const [sitters, setSitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSitters();
  }, []);

  const fetchSitters = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/sitters', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      console.log('保姆數據:', response.data);
      console.log('保姆數據詳情:', response.data.sitters || response.data);
      setSitters(response.data.sitters || response.data);
    } catch (error) {
      console.error('獲取保姆數據失敗:', error);
      message.error(t('sitters.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleFilterChange = (value) => {
    setFilterType(value);
  };

  const filteredSitters = sitters.filter(sitter => {
    const userName = sitter.user?.name || '';
    const bio = sitter.bio || '';
    const matchesSearch = userName.toLowerCase().includes(searchText.toLowerCase()) ||
                         bio.toLowerCase().includes(searchText.toLowerCase());
    const matchesFilter = filterType === 'all' || sitter.services?.includes(filterType);
    return matchesSearch && matchesFilter;
  });

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

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: '32px' }}>
        {t('sitters.title')}
      </Title>

      {/* 搜索和篩選 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12}>
            <Search
              placeholder={t('sitters.searchPlaceholder')}
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Select
              placeholder={t('sitters.filterByType')}
              style={{ width: '100%' }}
              size="large"
              value={filterType}
              onChange={handleFilterChange}
            >
              <Option value="all">{t('sitters.allTypes')}</Option>
              <Option value="dog">{t('sitters.types.dog')}</Option>
              <Option value="cat">{t('sitters.types.cat')}</Option>
              <Option value="bird">{t('sitters.types.bird')}</Option>
              <Option value="fish">{t('sitters.types.fish')}</Option>
              <Option value="rabbit">{t('sitters.types.rabbit')}</Option>
              <Option value="hamster">{t('sitters.types.hamster')}</Option>
              <Option value="other">{t('sitters.types.other')}</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* 保姆卡片列表 */}
      <Row gutter={[16, 16]}>
        {filteredSitters.map(sitter => (
          <Col xs={24} sm={12} lg={8} key={sitter._id}>
            <Card 
              hoverable 
              style={{ height: '100%', cursor: 'pointer' }}
              onClick={() => navigate(`/sitters/${sitter._id}`)}
              actions={[
                <Button 
                  type="primary" 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/bookings');
                  }}
                  icon={<PhoneOutlined />}
                >
                  {t('sitters.bookService')}
                </Button>
              ]}
            >
              <Card.Meta
                avatar={
                  <Avatar 
                    size={64} 
                    src={sitter.user?.avatar || null}
                    icon={<UserOutlined />}
                    style={{ backgroundColor: '#1890ff' }}
                    onError={() => {
                      console.log('頭像加載失敗:', sitter.user?.avatar);
                      console.log('sitter 對象:', sitter);
                    }}
                  />
                }
                title={
                  <Space>
                    <span>{sitter.user?.name || '未知用戶'}</span>
                    <Rate 
                      disabled 
                      defaultValue={sitter.rating || 0} 
                      style={{ fontSize: '14px' }}
                    />
                  </Space>
                }
                description={
                  <div>
                    <Paragraph style={{ marginBottom: '8px' }}>
                      {sitter.bio || t('sitters.defaultDescription')}
                    </Paragraph>
                    
                    {sitter.services && sitter.services.length > 0 && (
                      <div style={{ marginBottom: '8px' }}>
                        <Text strong>{t('sitters.specialties')}：</Text>
                        <Space wrap>
                          {sitter.services.map(service => (
                            <Tag key={service} color="blue">
                              {getPetTypeIcon(service)} {getPetTypeText(service)}
                            </Tag>
                          ))}
                        </Space>
                      </div>
                    )}

                    {sitter.experience && (
                      <div style={{ marginBottom: '8px' }}>
                        <Text strong>{t('sitters.experience')}：</Text>
                        <Text>{sitter.experience} {t('sitters.years')}</Text>
                      </div>
                    )}

                    {sitter.ratePerDay && (
                      <div>
                        <Text strong>{t('sitters.hourlyRate')}：</Text>
                        <Text type="success" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                          NZD$ {sitter.ratePerDay}/天
                        </Text>
                      </div>
                    )}

                    {sitter.location && (
                      <div style={{ marginTop: '8px' }}>
                        <Text type="secondary">📍 {sitter.location}</Text>
                      </div>
                    )}
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {filteredSitters.length === 0 && !loading && (
        <Card style={{ textAlign: 'center', padding: '48px' }}>
          <Title level={4} type="secondary">
            {t('sitters.noResults')}
          </Title>
          <Text type="secondary">
            {t('sitters.noResultsSubtitle')}
          </Text>
        </Card>
      )}
    </div>
  );
};

export default Sitters;
