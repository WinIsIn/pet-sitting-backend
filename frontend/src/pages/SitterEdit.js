import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Select, 
  InputNumber, 
  message, 
  Row, 
  Col, 
  Typography,
  Space,
  Divider
} from 'antd';
import { 
  ArrowLeftOutlined, 
  SaveOutlined,
  UserOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const SitterEdit = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [sitterProfile, setSitterProfile] = useState(null);
  const [previewData, setPreviewData] = useState({
    bio: '',
    services: [],
    ratePerDay: 50,
    location: 'Hamilton'
  });

  useEffect(() => {
    if (user) {
      fetchSitterProfile();
    }
  }, [user]);

  const updatePreviewData = (field, value) => {
    setPreviewData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const fetchSitterProfile = async () => {
    try {
      setLoading(true);

      if (!user) {
        message.error(t('sitterEdit.loginRequired'));
        navigate('/login');
        return;
      }

      if (user.role !== 'sitter') {
        message.error(t('sitterEdit.sitterOnly'));
        navigate('/dashboard');
        return;
      }

      try {
        const response = await axios.get('/api/sitters/my');
        setSitterProfile(response.data);
        const formData = {
          bio: response.data.bio || '',
          services: response.data.services || ['dog', 'cat'],
          ratePerDay: response.data.ratePerDay || 50,
          location: response.data.location || 'Hamilton'
        };

        form.setFieldsValue(formData);
        setPreviewData(formData);
      } catch (err) {
        console.error('保姆資料獲取失敗:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      if (!user) {
        message.error(t('sitterEdit.loginRequired'));
        navigate('/login');
        return;
      }

      const submitData = {
        bio: values.bio || '',
        services: values.services || [],
        ratePerDay: values.ratePerDay || 50,
        location: values.location || ''
      };

      try {
        const response = await axios.put('/api/sitters/my', submitData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        message.success(t('sitterEdit.updateSuccess'));
        setTimeout(() => navigate('/dashboard'), 1500);
      } catch (updateError) {
        console.warn('更新失敗，嘗試建立新資料:', updateError);
        await axios.post('/api/sitters', submitData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        message.success(t('sitterEdit.createSuccess'));
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (error) {
      console.error('保存失敗:', error);
      message.error(t('sitterEdit.saveFailed'));
    } finally {
      setLoading(false);
    }
  };

  const getPetTypeOptions = () => [
    { value: 'dog', label: t('sitterEdit.petTypes.dog') },
    { value: 'cat', label: t('sitterEdit.petTypes.cat') },
    { value: 'bird', label: t('sitterEdit.petTypes.bird') },
    { value: 'fish', label: t('sitterEdit.petTypes.fish') },
    { value: 'rabbit', label: t('sitterEdit.petTypes.rabbit') },
    { value: 'hamster', label: t('sitterEdit.petTypes.hamster') },
    { value: 'other', label: t('sitterEdit.petTypes.other') }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px' }}>
        {t('sitterEdit.backToDashboard')}
      </Button>

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <UserOutlined style={{ fontSize: '24px', marginRight: '12px', color: '#1890ff' }} />
          <Title level={2} style={{ margin: 0 }}>
            {t('sitterEdit.editProfile')}
          </Title>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={(changedValues, allValues) => {
            setPreviewData(prev => ({ ...prev, ...allValues }));
          }}
        >
          <Row gutter={[24, 0]}>
            <Col xs={24} lg={16}>
              <Card title={t('sitterEdit.basicInfo')} style={{ marginBottom: '24px' }}>
                <Form.Item name="bio" label={t('sitterEdit.personalBio')} rules={[{ required: true }]}>
                  <TextArea rows={4} maxLength={500} showCount />
                </Form.Item>

                <Form.Item name="services" label={t('sitterEdit.serviceSpecialties')} rules={[{ required: true }]}>
                  <Select mode="multiple" options={getPetTypeOptions()} style={{ width: '100%' }} />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item name="ratePerDay" label={t('sitterEdit.dailyRate')} rules={[{ required: true }]}>
                      <InputNumber
                        min={10}
                        max={500}
                        step={10}
                        style={{ width: '100%' }}
                        formatter={v => `NZD$ ${v}`}
                        parser={v => v.replace(/NZD\$|\s|,/g, '')}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name="location" label={t('sitterEdit.location')} rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* 照片展示功能已移除 */}
            </Col>

            <Col xs={24} lg={8}>
              <Card title={t('sitterEdit.preview')}>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      backgroundColor: '#1890ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}
                  >
                    <UserOutlined />
                  </div>
                  <Text strong>{user?.name}</Text>
                </div>

                <Divider />

                <div style={{ marginBottom: '12px' }}>
                  <Text type="secondary">{t('sitterEdit.personalBio')}</Text>
                  <div>{previewData.bio || t('sitterEdit.defaultBio')}</div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <Text type="secondary">{t('sitterEdit.serviceSpecialties')}</Text>
                  <div>
                    {previewData.services?.length
                      ? previewData.services.map(s => getPetTypeOptions().find(o => o.value === s)?.label || s).join(', ')
                      : t('sitterEdit.defaultSpecialties')}
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <Text type="secondary">{t('sitterEdit.dailyRate')}</Text>
                  <div style={{ color: '#52c41a', fontWeight: 'bold' }}>NZD$ {previewData.ratePerDay || 0}</div>
                </div>

                <div>
                  <Text type="secondary">{t('sitterEdit.location')}</Text>
                  <div>📍 {previewData.location || 'Hamilton'}</div>
                </div>
              </Card>
            </Col>
          </Row>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Space size="large">
              <Button size="large" onClick={() => navigate('/dashboard')}>
                {t('sitterEdit.cancel')}
              </Button>
              <Button type="primary" size="large" loading={loading} icon={<SaveOutlined />} htmlType="submit">
                {t('sitterEdit.saveChanges')}
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default SitterEdit;
