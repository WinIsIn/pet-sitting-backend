import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Select, 
  InputNumber, 
  Upload, 
  message, 
  Row, 
  Col, 
  Typography,
  Space,
  Divider
} from 'antd';
import { 
  ArrowLeftOutlined, 
  UploadOutlined, 
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
  const [fileList, setFileList] = useState([]);
  const [previewData, setPreviewData] = useState({
    bio: '',
    services: [],
    ratePerDay: 50,
    location: 'Hamilton',
    imageUrl: ''
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
          location: response.data.location || 'Hamilton',
          imageUrl: response.data.imageUrl || ''
        };

        form.setFieldsValue(formData);
        setPreviewData(formData);

        if (formData.imageUrl) {
          setFileList([{
            uid: '-1',
            name: 'image.jpg',
            status: 'done',
            url: formData.imageUrl
          }]);
        }
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

      let imageUrl = values.imageUrl || form.getFieldValue('imageUrl') || '';

      if (typeof imageUrl === 'object' && imageUrl !== null) {
        if (imageUrl.file?.response?.imageUrl) {
          imageUrl = imageUrl.file.response.imageUrl;
        } else if (imageUrl.url) {
          imageUrl = imageUrl.url;
        } else {
          imageUrl = '';
        }
      }

      const submitData = {
        bio: values.bio || '',
        services: values.services || [],
        ratePerDay: values.ratePerDay || 50,
        location: values.location || '',
        imageUrl
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

  const handleImageUpload = (info) => {
    let newFileList = [...info.fileList];

    if (info.file.status === 'done') {
      const imageUrl = info.file.response.imageUrl || info.file.response.url;
      message.success(t('sitterEdit.uploadSuccess'));
      form.setFieldsValue({ imageUrl });
      updatePreviewData('imageUrl', imageUrl);
      setSitterProfile(prev => ({ ...prev, imageUrl }));
      newFileList = newFileList.map(file =>
        file.uid === info.file.uid ? { ...file, url: imageUrl, status: 'done' } : file
      );
    } else if (info.file.status === 'error') {
      message.error(t('sitterEdit.uploadFailed'));
    }

    setFileList(newFileList);
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
            // 將 imageUrl 正規化為字串，避免出現 startsWith 不是函式的錯誤
            const normalized = { ...allValues };
            if (Object.prototype.hasOwnProperty.call(changedValues, 'imageUrl')) {
              const v = changedValues.imageUrl;
              let url = '';
              if (typeof v === 'string') {
                url = v;
              } else if (v && typeof v === 'object') {
                url = v.file?.response?.imageUrl || v.file?.response?.url || v.url || '';
              }
              normalized.imageUrl = url;
            }
            setPreviewData(prev => ({ ...prev, ...normalized }));
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

              <Card title={t('sitterEdit.photoDisplay')}>
                <Form.Item
                  name="imageUrl"
                  label={t('sitterEdit.personalPhoto')}
                  // 將 Upload 的事件轉成字串 URL 存入表單
                  getValueFromEvent={(e) => {
                    if (!e) return form.getFieldValue('imageUrl') || '';
                    const url = e.file?.response?.imageUrl || e.file?.response?.url || e.file?.url || '';
                    return url;
                  }}
                >
                  <Upload
                    name="image"
                    listType="picture-card"
                    fileList={fileList}
                    action={`${process.env.REACT_APP_API_URL || 'https://web-production-3ab4f.up.railway.app'}/api/upload`}
                    headers={{ Authorization: `Bearer ${localStorage.getItem('token')}` }}
                    onChange={handleImageUpload}
                    beforeUpload={(file) => {
                      const isImage = file.type.startsWith('image/');
                      if (!isImage) {
                        message.error(t('sitterEdit.onlyImages'));
                        return false;
                      }
                      const isLt5M = file.size / 1024 / 1024 < 5;
                      if (!isLt5M) {
                        message.error(t('sitterEdit.imageSizeLimit'));
                        return false;
                      }
                      return true;
                    }}
                  >
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>{t('sitterEdit.uploadPhoto')}</div>
                    </div>
                  </Upload>
                </Form.Item>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card title={t('sitterEdit.preview')}>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  {previewData.imageUrl && typeof previewData.imageUrl === 'string' ? (
                    <img
                      src={previewData.imageUrl}
                      alt={t('sitterEdit.personalPhoto')}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        margin: '0 auto 12px',
                        display: 'block'
                      }}
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                  ) : (
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
                  )}
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
