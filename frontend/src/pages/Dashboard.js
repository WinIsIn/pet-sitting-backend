import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Avatar, Button, Statistic, List, Tag, Space, Upload, Modal, message } from 'antd';
import { UserOutlined, CalendarOutlined, HeartOutlined, StarOutlined, CameraOutlined, EditOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from '../hooks/useTranslation';

// 配置 axios 基礎 URL - 強制更新確保使用正確域名
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://web-production-3ab4f.up.railway.app';
axios.defaults.baseURL = API_BASE_URL;

const { Title, Text } = Typography;

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // 獲取用戶的預約
      const bookingsResponse = await axios.get('/api/bookings/my');
      setBookings(bookingsResponse.data);

      // 獲取用戶的寵物
      const petsResponse = await axios.get('/api/pets/my');
      setPets(petsResponse.data);
    } catch (error) {
      console.error('獲取用戶數據失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'accepted': return 'green';
      case 'rejected': return 'red';
      case 'completed': return 'blue';
      default: return 'default';
    }
  };

  const handleAvatarUpload = async (info) => {
    let newFileList = [...info.fileList];
    
    try {
      setAvatarLoading(true);
      
      if (info.file.status === 'done') {
        console.log('上傳響應:', info.file.response);
        const avatarUrl = info.file.response.imageUrl || info.file.response.url;
        console.log('圖片上傳成功，URL:', avatarUrl);
        
        // 更新用戶頭像
        try {
          console.log('準備更新用戶頭像，URL:', avatarUrl);
          console.log('認證 token:', localStorage.getItem('token'));
          
          const response = await axios.put('/api/auth/profile', { avatar: avatarUrl }, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          });
          
          console.log('用戶頭像更新成功，響應:', response.data);
          // 同步更新本地 user
          const updated = { ...(JSON.parse(localStorage.getItem('user') || '{}')), avatar: avatarUrl };
          localStorage.setItem('user', JSON.stringify(updated));
          updateUser(updated);
        } catch (updateError) {
          console.error('更新用戶頭像失敗:', updateError);
          console.error('錯誤詳情:', updateError.response?.data);
          console.error('錯誤狀態:', updateError.response?.status);
          message.error('更新用戶頭像失敗: ' + (updateError.response?.data?.message || updateError.message));
          return;
        }
        
        message.success(t('dashboard.avatar.uploadSuccess'));
        setAvatarModalVisible(false);
        setFileList([]);
        
        // 更新用戶上下文中的頭像
        updateUser({ ...user, avatar: avatarUrl });
        
        // 不需要刷新頁面，直接更新即可
      } else if (info.file.status === 'error') {
        console.error('圖片上傳失敗:', info.file.error);
        console.error('錯誤響應:', info.file.response);
        message.error(t('dashboard.avatar.uploadFailed'));
      } else if (info.file.status === 'uploading') {
        console.log('圖片上傳中...');
      }
      
      // 更新文件列表狀態
      setFileList(newFileList);
    } catch (error) {
      console.error('頭像上傳失敗:', error);
      message.error(t('dashboard.avatar.uploadFailed'));
    } finally {
      setAvatarLoading(false);
    }
  };

  const openAvatarModal = () => {
    setAvatarModalVisible(true);
    setFileList([]);
  };

  const closeAvatarModal = () => {
    setAvatarModalVisible(false);
    setFileList([]);
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return t('dashboard.status.pending');
      case 'accepted': return t('dashboard.status.accepted');
      case 'rejected': return t('dashboard.status.rejected');
      case 'completed': return t('dashboard.status.completed');
      default: return status;
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: '32px' }}>
        {t('dashboard.title')}
      </Title>

      {/* 用戶資訊卡片 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={24} align="middle">
          <Col>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <Avatar 
                size={64} 
                src={user?.avatar ? (user.avatar.startsWith('http') ? user.avatar : `${API_BASE_URL}/uploads/${user.avatar}`) : null}
                icon={<UserOutlined />} 
              />
              <Button
                type="primary"
                shape="circle"
                icon={<CameraOutlined />}
                size="small"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  zIndex: 1
                }}
                onClick={openAvatarModal}
              />
            </div>
          </Col>
          <Col flex="1">
            <Title level={3} style={{ margin: 0 }}>
              {user?.name}
            </Title>
            <Text type="secondary">{user?.email}</Text>
            <div style={{ marginTop: '8px' }}>
              <Tag color={user?.role === 'sitter' ? 'blue' : 'green'}>
                {user?.role === 'sitter' ? t('dashboard.userInfo.petSitter') : t('dashboard.userInfo.petOwner')}
              </Tag>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 統計數據 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={t('dashboard.stats.totalBookings')}
              value={bookings.length}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={t('dashboard.stats.petCount')}
              value={pets.length}
              prefix={<HeartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={t('dashboard.stats.completedBookings')}
              value={bookings.filter(b => b.status === 'completed').length}
              prefix={<StarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 最近預約 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card 
            title={t('dashboard.recentBookings.title')} 
            extra={<Button type="link" onClick={() => navigate('/bookings')}>{t('dashboard.recentBookings.viewAll')}</Button>}
          >
            <List
              loading={loading}
              dataSource={bookings.slice(0, 5)}
              renderItem={(booking) => (
                <List.Item>
                  <List.Item.Meta
                    title={`${t('dashboard.recentBookings.booking')} ${booking._id.slice(-6)}`}
                    description={
                      <Space direction="vertical" size="small">
                        <Text>
                          {t('dashboard.recentBookings.pet')}: {booking.pet?.name || t('common.unknown')}
                        </Text>
                        <Text type="secondary">
                          {t('dashboard.recentBookings.time')}: {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                        </Text>
                      </Space>
                    }
                  />
                  <Tag color={getStatusColor(booking.status)}>
                    {getStatusText(booking.status)}
                  </Tag>
                </List.Item>
              )}
              locale={{ emptyText: t('dashboard.recentBookings.noBookings') }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card 
            title={t('dashboard.myPets.title')} 
            extra={<Button type="link" onClick={() => navigate('/pets')}>{t('dashboard.myPets.manage')}</Button>}
          >
            <List
              loading={loading}
              dataSource={pets.slice(0, 5)}
              renderItem={(pet) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<HeartOutlined />} />}
                    title={pet.name}
                    description={
                      <Space direction="vertical" size="small">
                        <Text>{t('dashboard.myPets.type')}: {pet.type}</Text>
                        <Text type="secondary">{t('dashboard.myPets.age')}: {pet.age} {t('dashboard.myPets.years')}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
              locale={{ emptyText: t('dashboard.myPets.noPets') }}
            />
          </Card>
        </Col>
      </Row>

      {/* 快速操作 */}
      <Card title={t('dashboard.quickActions.title')} style={{ marginTop: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Button 
              type="primary" 
              size="large" 
              block 
              onClick={() => navigate('/sitters')}
              icon={<UserOutlined />}
            >
              {t('dashboard.quickActions.findSitter')}
            </Button>
          </Col>
          <Col xs={24} sm={8}>
            <Button 
              size="large" 
              block 
              onClick={() => navigate('/bookings')}
              icon={<CalendarOutlined />}
            >
              {t('dashboard.quickActions.viewBookings')}
            </Button>
          </Col>
          <Col xs={24} sm={8}>
            <Button 
              size="large" 
              block 
              onClick={() => navigate('/pets')}
              icon={<HeartOutlined />}
            >
              {t('dashboard.quickActions.managePets')}
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 頭像上傳模態框 */}
      <Modal
        title={t('dashboard.avatar.title')}
        open={avatarModalVisible}
        onCancel={closeAvatarModal}
        footer={null}
        width={400}
      >
        <div style={{ textAlign: 'center' }}>
          <Upload
            name="image"
            action={`${process.env.REACT_APP_API_URL || 'https://web-production-3ab4f.up.railway.app'}/api/upload`}
            listType="picture-card"
            fileList={fileList}
            onChange={handleAvatarUpload}
            beforeUpload={(file) => {
              const isImage = file.type.startsWith('image/');
              if (!isImage) {
                message.error(t('dashboard.avatar.imageOnly'));
                return false;
              }
              const isLt3M = file.size / 1024 / 1024 < 3;
              if (!isLt3M) {
                message.error(t('dashboard.avatar.imageSize'));
                return false;
              }
              return true;
            }}
            maxCount={1}
            headers={{
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }}
          >
            {fileList.length >= 1 ? null : (
              <div>
                <CameraOutlined />
                <div style={{ marginTop: 8 }}>{t('dashboard.avatar.upload')}</div>
              </div>
            )}
          </Upload>
          <div style={{ marginTop: '16px', color: '#666' }}>
            <Text type="secondary">{t('dashboard.avatar.tips')}</Text>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
