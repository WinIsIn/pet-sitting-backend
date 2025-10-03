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

  // 更新預覽數據
  const updatePreviewData = (field, value) => {
    setPreviewData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const fetchSitterProfile = async () => {
    try {
      setLoading(true);
      
      // 檢查用戶是否已登入
      if (!user) {
        message.error(t('sitterEdit.loginRequired'));
        navigate('/login');
        return;
      }
      
      // 檢查用戶是否為保姆
      if (user.role !== 'sitter') {
        message.error(t('sitterEdit.sitterOnly'));
        navigate('/dashboard');
        return;
      }
      
      // 先嘗試使用 /api/sitters/my 端點
      try {
        const response = await axios.get('/api/sitters/my');
        console.log('保姆資料:', response.data);
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
        return;
      } catch (myError) {
        console.log('使用 /api/sitters/my 失敗，嘗試其他方法:', myError);
        
        // 如果 /api/sitters/my 失敗，使用 /api/sitters 端點並過濾
        const response = await axios.get('/api/sitters');
        console.log('所有保姆資料:', response.data);
        
        // 從所有保姆中找到當前用戶的資料
        const sitters = response.data.sitters || response.data;
        const currentSitter = sitters.find(sitter => sitter.user._id === user._id);
        
        if (currentSitter) {
          console.log('找到當前保姆資料:', currentSitter);
          setSitterProfile(currentSitter);
          const formData = {
            bio: currentSitter.bio || '',
            services: currentSitter.services || ['dog', 'cat'],
            ratePerDay: currentSitter.ratePerDay || 50,
            location: currentSitter.location || 'Hamilton',
            imageUrl: currentSitter.imageUrl || ''
          };
          
          form.setFieldsValue(formData);
          setPreviewData(formData);
          
          // 如果有圖片，設置 fileList
          if (currentSitter.imageUrl) {
            setFileList([{
              uid: '-1',
              name: 'image.jpg',
              status: 'done',
              url: currentSitter.imageUrl
            }]);
          }
        } else {
          // 如果找不到保姆資料，創建一個預設的
          console.log('找不到保姆資料，使用預設值');
          const defaultSitter = {
            bio: t('sitterEdit.defaultBio'),
            services: ['dog', 'cat'],
            ratePerDay: 50, // 改為紐幣
            location: 'Hamilton' // 改為 Hamilton
          };
          setSitterProfile(defaultSitter);
          form.setFieldsValue(defaultSitter);
        }
      }
    } catch (error) {
      console.error('獲取保姆資料失敗:', error);
      message.error(t('sitterEdit.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      // 檢查用戶是否已登入
      if (!user) {
        message.error(t('sitterEdit.loginRequired'));
        navigate('/login');
        return;
      }
      
      console.log('提交的資料:', values);
      console.log('表單中的 imageUrl:', form.getFieldValue('imageUrl'));
      console.log('用戶信息:', user);
      
      // 確保所有必要字段都有值
      const submitData = {
        bio: values.bio || '',
        services: values.services || [],
        ratePerDay: values.ratePerDay || 50,
        location: values.location || '',
        imageUrl: values.imageUrl || form.getFieldValue('imageUrl') || ''
      };
      
      console.log('準備提交的數據:', submitData);
      
      // 先嘗試更新現有的保姆資料
      try {
        console.log('嘗試更新保姆資料...');
        console.log('當前用戶:', user);
        console.log('Token:', localStorage.getItem('token'));
        
        const response = await axios.put('/api/sitters/my', submitData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log('更新成功:', response.data);
        message.success(t('sitterEdit.updateSuccess'));
        // 不立即跳轉，讓用戶看到成功消息
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
        return;
      } catch (updateError) {
        console.log('更新失敗，嘗試創建新的保姆資料:', updateError);
        console.error('更新錯誤詳情:', updateError.response?.data);
        console.error('更新錯誤狀態:', updateError.response?.status);
        
        // 如果更新失敗，嘗試創建新的保姆資料
        try {
          console.log('嘗試創建新的保姆資料...');
          const response = await axios.post('/api/sitters', submitData, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          console.log('創建成功:', response.data);
          message.success(t('sitterEdit.createSuccess'));
          // 不立即跳轉，讓用戶看到成功消息
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        } catch (createError) {
          console.error('創建失敗:', createError);
          console.error('創建錯誤詳情:', createError.response?.data);
          console.error('創建錯誤狀態:', createError.response?.status);
          const errorMessage = createError.response?.data?.message || createError.message || t('sitterEdit.saveFailed');
          message.error(t('sitterEdit.saveFailed') + ': ' + errorMessage);
        }
      }
    } catch (error) {
      console.error('保存失敗:', error);
      console.error('錯誤詳情:', error.response?.data);
      message.error(t('sitterEdit.saveFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (info) => {
    let newFileList = [...info.fileList];
    
    if (info.file.status === 'done') {
      message.success(t('sitterEdit.uploadSuccess'));
      const resp = info.file?.response || {};
      const imageUrl = resp.url || resp.secure_url || resp.path || resp.location || resp.data?.url;
      if (!imageUrl) {
        message.error(t('sitterEdit.uploadFailed'));
        return;
      }
      console.log('圖片上傳成功，URL:', imageUrl);
      
      // 更新表單值
      form.setFieldsValue({
        imageUrl: imageUrl
      });
      
      // 更新預覽數據
      updatePreviewData('imageUrl', imageUrl);
      
      // 更新預覽區域
      setSitterProfile(prev => ({
        ...prev,
        imageUrl: imageUrl
      }));
      
      // 更新文件列表
      newFileList = newFileList.map(file => {
        if (file.uid === info.file.uid) {
          return {
            ...file,
            url: imageUrl,
            status: 'done'
          };
        }
        return file;
      });
    } else if (info.file.status === 'error') {
      console.error('圖片上傳失敗:', info.file.error);
      message.error(t('sitterEdit.uploadFailed') + ': ' + (info.file.error?.message || t('sitterEdit.uploadError')));
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
      {/* 返回按鈕 */}
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/dashboard')}
        style={{ marginBottom: '20px' }}
      >
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
          onFinishFailed={(errorInfo) => {
            console.log('表單驗證失敗:', errorInfo);
          }}
          onValuesChange={(changedValues, allValues) => {
            // 實時更新預覽數據
            Object.keys(changedValues).forEach(key => {
              updatePreviewData(key, changedValues[key]);
            });
          }}
        >
          <Row gutter={[24, 0]}>
            <Col xs={24} lg={16}>
              {/* 基本資料 */}
              <Card title={t('sitterEdit.basicInfo')} style={{ marginBottom: '24px' }}>
                <Form.Item
                  name="bio"
                  label={t('sitterEdit.personalBio')}
                  rules={[{ required: true, message: t('sitterEdit.bioRequired') }]}
                >
                  <TextArea
                    rows={4}
                    placeholder={t('sitterEdit.bioPlaceholder')}
                    maxLength={500}
                    showCount
                  />
                </Form.Item>

                <Form.Item
                  name="services"
                  label={t('sitterEdit.serviceSpecialties')}
                  rules={[{ required: true, message: t('sitterEdit.specialtiesRequired') }]}
                >
                  <Select
                    mode="multiple"
                    placeholder={t('sitterEdit.specialtiesPlaceholder')}
                    options={getPetTypeOptions()}
                    style={{ width: '100%' }}
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="ratePerDay"
                      label={t('sitterEdit.dailyRate')} // 使用翻譯，會顯示 "每日收費 (NZD$)"
                      rules={[{ required: true, message: t('sitterEdit.rateRequired') }]}
                    >
                      <InputNumber
                        min={10} // 降低最小值
                        max={500} // 降低最大值
                        step={10} // 調整步長
                        style={{ width: '100%' }}
                        formatter={value => `NZD$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} // 改為紐幣
                        parser={value => value.replace(/NZD\$\s?|(,*)/g, '')} // 改為紐幣
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="location"
                      label={t('sitterEdit.location')}
                      rules={[{ required: true, message: t('sitterEdit.locationRequired') }]}
                    >
                      <Input placeholder={t('sitterEdit.locationPlaceholder')} />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* 照片上傳 */}
              <Card title={t('sitterEdit.photoDisplay')} style={{ marginBottom: '24px' }}>
                <Form.Item name="imageUrl" label={t('sitterEdit.personalPhoto')}>
                  <Upload
                    name="image"
                    listType="picture-card"
                    showUploadList={true}
                    fileList={fileList}
                    action={`https://pet-sitting-backend-production.up.railway.app/api/upload`}
                    headers={{
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }}
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
              {/* 預覽區域 */}
              <Card title={t('sitterEdit.preview')} style={{ position: 'sticky', top: '20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  {previewData.imageUrl ? (
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
                    />
                  ) : (
                    <div style={{ 
                      width: '80px', 
                      height: '80px', 
                      borderRadius: '50%', 
                      backgroundColor: '#1890ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px',
                      color: 'white',
                      fontSize: '24px'
                    }}>
                      <UserOutlined />
                    </div>
                  )}
                  <Text strong style={{ fontSize: '16px' }}>{user?.name}</Text>
                </div>
                
                <Divider />
                
                <div style={{ marginBottom: '12px' }}>
                  <Text type="secondary">{t('sitterEdit.personalBio')}</Text>
                  <div style={{ marginTop: '4px' }}>
                    {previewData.bio || t('sitterEdit.defaultBio')}
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <Text type="secondary">{t('sitterEdit.serviceSpecialties')}</Text>
                  <div style={{ marginTop: '4px' }}>
                    {previewData.services?.map(service => {
                      const option = getPetTypeOptions().find(opt => opt.value === service);
                      return option ? option.label : service;
                    }).join(', ') || t('sitterEdit.defaultSpecialties')}
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <Text type="secondary">{t('sitterEdit.dailyRate')}</Text>
                  <div style={{ marginTop: '4px', color: '#52c41a', fontWeight: 'bold' }}>
                    NZD$ {previewData.ratePerDay || 0} {/* 改為紐幣 */}
                  </div>
                </div>

                <div>
                  <Text type="secondary">{t('sitterEdit.location')}</Text>
                  <div style={{ marginTop: '4px' }}>
                    📍 {previewData.location || t('sitterEdit.defaultLocation')}
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* 提交按鈕 */}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Space size="large">
              <Button 
                size="large" 
                onClick={() => navigate('/dashboard')}
              >
                {t('sitterEdit.cancel')}
              </Button>
              <Button 
                type="primary" 
                size="large" 
                loading={loading}
                icon={<SaveOutlined />}
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  console.log('按鈕被點擊');
                  console.log('當前表單值:', form.getFieldsValue());
                  console.log('表單是否有效:', form.isFieldsTouched());
                  
                  try {
                    // 手動觸發表單驗證
                    const values = await form.validateFields();
                    console.log('表單驗證通過，開始提交:', values);
                    await handleSubmit(values);
                  } catch (errorInfo) {
                    console.log('表單驗證失敗:', errorInfo);
                    message.error('請檢查表單輸入');
                  }
                }}
              >
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
