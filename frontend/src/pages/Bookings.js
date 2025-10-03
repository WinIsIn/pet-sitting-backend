import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tag, Space, Modal, Form, DatePicker, Select, message, Typography } from 'antd';
import { PlusOutlined, EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import { useTranslation } from '../hooks/useTranslation';

const { Title } = Typography;
const { Option } = Select;

const Bookings = () => {
  const { t } = useTranslation();
  const { isChinese } = useLanguage();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [bookings, setBookings] = useState([]);
  const [pets, setPets] = useState([]);
  const [sitters, setSitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [form] = Form.useForm();
  
  // 從 URL 參數獲取預選的保姆 ID
  const preselectedSitterId = searchParams.get('sitter');

  useEffect(() => {
    fetchData();
  }, []);

  // 當有預選的保姆 ID 且數據加載完成時，自動打開預約模態框
  useEffect(() => {
    if (preselectedSitterId && sitters.length > 0 && !loading) {
      setModalVisible(true);
      // 預設選擇指定的保姆
      form.setFieldsValue({
        sitter: preselectedSitterId
      });
    }
  }, [preselectedSitterId, sitters, loading, form]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 根據用戶角色獲取不同的預約數據
      const endpoint = user.role === 'sitter' ? '/api/bookings/received' : '/api/bookings/my';
      const bookingsResponse = await axios.get(endpoint);
      setBookings(bookingsResponse.data);

      // 如果是寵物主人，獲取寵物和保姆列表
      if (user.role === 'user') {
        const petsResponse = await axios.get('/api/pets/my');
        // 確保 pets 是一個數組
        const petsData = Array.isArray(petsResponse.data) 
          ? petsResponse.data 
          : [];
        setPets(petsData);

        const sittersResponse = await axios.get('/api/sitters');
        // 確保 sitters 是一個數組
        const sittersData = Array.isArray(sittersResponse.data) 
          ? sittersResponse.data 
          : sittersResponse.data.sitters || [];
        setSitters(sittersData);
      }
    } catch (error) {
      console.error('獲取數據失敗:', error);
      message.error(t('bookings.messages.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async (values) => {
    try {
      const bookingData = {
        ...values,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
      };

      await axios.post('/api/bookings', bookingData);
      message.success(t('bookings.messages.createSuccess'));
      setModalVisible(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      message.error(t('bookings.messages.createFailed'));
    }
  };

  const handleAcceptBooking = async (bookingId) => {
    try {
      await axios.patch(`/api/bookings/${bookingId}/accept`);
      message.success(t('bookings.messages.acceptSuccess'));
      fetchData();
    } catch (error) {
      message.error(t('bookings.messages.operationFailed'));
    }
  };

  const handleRejectBooking = async (bookingId) => {
    try {
      await axios.patch(`/api/bookings/${bookingId}/reject`);
      message.success(t('bookings.messages.rejectSuccess'));
      fetchData();
    } catch (error) {
      message.error(t('bookings.messages.operationFailed'));
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

  const getStatusText = (status) => {
    return t(`bookings.statuses.${status}`);
  };

  const columns = [
    {
      title: t('bookings.bookingId'),
      dataIndex: '_id',
      key: '_id',
      render: (id) => id.slice(-6),
    },
    {
      title: t('bookings.pet'),
      dataIndex: 'pet',
      key: 'pet',
      render: (pet) => pet?.name || t('common.unknown'),
    },
    {
      title: user.role === 'sitter' ? t('bookings.petOwner') : t('bookings.sitter'),
      dataIndex: user.role === 'sitter' ? 'owner' : 'sitter',
      key: user.role === 'sitter' ? 'owner' : 'sitter',
      render: (person) => person?.name || t('common.unknown'),
    },
    {
      title: t('bookings.startTime'),
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: t('bookings.endTime'),
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: t('bookings.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: t('bookings.actions'),
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => setSelectedBooking(record)}
          >
            {t('bookings.view')}
          </Button>
          {user.role === 'sitter' && record.status === 'pending' && (
            <>
              <Button 
                type="link" 
                icon={<CheckOutlined />}
                onClick={() => handleAcceptBooking(record._id)}
                style={{ color: '#52c41a' }}
              >
                {t('bookings.accept')}
              </Button>
              <Button 
                type="link" 
                icon={<CloseOutlined />}
                onClick={() => handleRejectBooking(record._id)}
                style={{ color: '#ff4d4f' }}
              >
                {t('bookings.reject')}
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2}>
          {t('bookings.title')}
        </Title>
        {user.role === 'user' && (
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            {t('bookings.addBooking')}
          </Button>
        )}
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={bookings}
          loading={loading}
          rowKey="_id"
          locale={{
            emptyText: t('common.noData') || 'No data'
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              isChinese 
                ? `第 ${range[0]}-${range[1]} 條，共 ${total} 條`
                : `${range[0]}-${range[1]} of ${total} items`,
            pageSizeOptions: ['10', '20', '50', '100'],
            showSizeChanger: true,
            size: 'default',
            locale: {
              items_per_page: isChinese ? '條/頁' : 'items/page',
              jump_to: isChinese ? '跳至' : 'Go to',
              jump_to_confirm: isChinese ? '確定' : 'Confirm',
              page: isChinese ? '頁' : 'Page',
              prev_page: isChinese ? '上一頁' : 'Previous Page',
              next_page: isChinese ? '下一頁' : 'Next Page',
              prev_5: isChinese ? '向前 5 頁' : 'Previous 5 Pages',
              next_5: isChinese ? '向後 5 頁' : 'Next 5 Pages',
              prev_3: isChinese ? '向前 3 頁' : 'Previous 3 Pages',
              next_3: isChinese ? '向後 3 頁' : 'Next 3 Pages',
            }
          }}
        />
      </Card>

      {/* 新增預約模態框 */}
      <Modal
        title={t('bookings.addBooking')}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateBooking}
        >
          <Form.Item
            name="pet"
            label={t('bookings.form.selectPet')}
            rules={[{ required: true, message: t('bookings.form.petRequired') }]}
          >
            <Select placeholder={t('bookings.form.selectPet')}>
              {Array.isArray(pets) && pets.map(pet => (
                <Option key={pet._id} value={pet._id}>
                  {pet.name} ({pet.type})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="sitter"
            label={t('bookings.form.selectSitter')}
            rules={[{ required: true, message: t('bookings.form.sitterRequired') }]}
          >
            <Select placeholder={t('bookings.form.selectSitter')}>
              {Array.isArray(sitters) && sitters.map(sitter => (
                <Option key={sitter._id} value={sitter._id}>
                  {sitter.user?.name || sitter.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="startDate"
            label={t('bookings.form.startDate')}
            rules={[{ required: true, message: t('bookings.form.startDateRequired') }]}
          >
            <DatePicker 
              showTime 
              format="YYYY-MM-DD HH:mm"
              placeholder={t('bookings.form.selectStartDate')}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="endDate"
            label={t('bookings.form.endDate')}
            rules={[{ required: true, message: t('bookings.form.endDateRequired') }]}
          >
            <DatePicker 
              showTime 
              format="YYYY-MM-DD HH:mm"
              placeholder={t('bookings.form.selectEndDate')}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {t('bookings.createBooking')}
              </Button>
              <Button onClick={() => {
                setModalVisible(false);
                form.resetFields();
              }}>
                {t('common.cancel')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 預約詳情模態框 */}
      <Modal
        title={t('bookings.bookingDetails')}
        open={!!selectedBooking}
        onCancel={() => setSelectedBooking(null)}
        footer={null}
        width={600}
      >
        {selectedBooking && (
          <div>
            <p><strong>{t('bookings.bookingId')}：</strong>{selectedBooking._id.slice(-6)}</p>
            <p><strong>{t('bookings.pet')}：</strong>{selectedBooking.pet?.name}</p>
            <p><strong>{t('pets.type')}：</strong>{selectedBooking.pet?.type}</p>
            <p><strong>{t('bookings.startTime')}：</strong>{dayjs(selectedBooking.startDate).format('YYYY-MM-DD HH:mm')}</p>
            <p><strong>{t('bookings.endTime')}：</strong>{dayjs(selectedBooking.endDate).format('YYYY-MM-DD HH:mm')}</p>
            <p><strong>{t('bookings.status')}：</strong>
              <Tag color={getStatusColor(selectedBooking.status)}>
                {getStatusText(selectedBooking.status)}
              </Tag>
            </p>
            {selectedBooking.notes && (
              <p><strong>{t('bookings.notes')}：</strong>{selectedBooking.notes}</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Bookings;
