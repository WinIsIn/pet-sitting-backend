import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, InputNumber, message, Typography, Space, Avatar, ConfigProvider } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, HeartOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';

const { Title } = Typography;
const { Option } = Select;

const Pets = () => {
  const { t } = useTranslation();
  const { isChinese } = useLanguage();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/pets/my');
      setPets(response.data);
    } catch (error) {
      console.error('獲取寵物數據失敗:', error);
      message.error(t('pets.messages.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePet = async (values) => {
    try {
      await axios.post('/api/pets', values);
      message.success(t('pets.messages.addSuccess'));
      setModalVisible(false);
      form.resetFields();
      fetchPets();
    } catch (error) {
      message.error(t('pets.messages.addFailed'));
    }
  };

  const handleUpdatePet = async (values) => {
    try {
      await axios.put(`/api/pets/${editingPet._id}`, values);
      message.success(t('pets.messages.updateSuccess'));
      setModalVisible(false);
      setEditingPet(null);
      form.resetFields();
      fetchPets();
    } catch (error) {
      message.error(t('pets.messages.updateFailed'));
    }
  };

  const handleDeletePet = async (petId) => {
    try {
      await axios.delete(`/api/pets/${petId}`);
      message.success(t('pets.messages.deleteSuccess'));
      fetchPets();
    } catch (error) {
      message.error(t('pets.messages.deleteFailed'));
    }
  };

  const openEditModal = (pet) => {
    setEditingPet(pet);
    form.setFieldsValue(pet);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingPet(null);
    form.resetFields();
  };

  const columns = [
    {
      title: t('pets.petName'),
      key: 'pet',
      render: (_, record) => (
        <Space>
          <Avatar icon={<HeartOutlined />} />
          <span>{record.name}</span>
        </Space>
      ),
    },
    {
      title: t('pets.type'),
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: t('pets.age'),
      dataIndex: 'age',
      key: 'age',
      render: (age) => `${age} ${t('pets.form.age')}`,
    },
    {
      title: t('pets.breed'),
      dataIndex: 'breed',
      key: 'breed',
    },
    {
      title: t('pets.weight'),
      dataIndex: 'weight',
      key: 'weight',
      render: (weight) => weight ? `${weight} ${t('pets.form.weightUnit')}` : '-',
    },
    {
      title: t('bookings.actions'),
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            {t('common.edit')}
          </Button>
          <Button 
            type="link" 
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: t('pets.confirmDelete'),
                content: t('pets.deleteConfirmText', { name: record.name }),
                onOk: () => handleDeletePet(record._id),
              });
            }}
          >
            {t('common.delete')}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2}>
          {t('pets.title')}
        </Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          + {t('pets.addPet')}
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={pets}
          loading={loading}
          rowKey="_id"
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

      {/* 添加/編輯寵物模態框 */}
      <Modal
        title={editingPet ? t('pets.editPet') : t('pets.addPet')}
        open={modalVisible}
        onCancel={closeModal}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingPet ? handleUpdatePet : handleCreatePet}
        >
          <Form.Item
            name="name"
            label={t('pets.petName')}
            rules={[
              { required: true, message: t('pets.form.nameRequired') },
              { min: 1, max: 20, message: t('pets.form.nameLength') }
            ]}
          >
            <Input placeholder={t('pets.petName')} />
          </Form.Item>

          <Form.Item
            name="type"
            label={t('pets.type')}
            rules={[{ required: true, message: t('pets.form.typeRequired') }]}
          >
            <Select placeholder={t('pets.type')}>
              <Option value="dog">{t('pets.types.dog')}</Option>
              <Option value="cat">{t('pets.types.cat')}</Option>
              <Option value="bird">{t('pets.types.bird')}</Option>
              <Option value="fish">{t('pets.types.fish')}</Option>
              <Option value="rabbit">{t('pets.types.rabbit')}</Option>
              <Option value="hamster">{t('pets.types.hamster')}</Option>
              <Option value="other">{t('pets.types.other')}</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="age"
            label={t('pets.age')}
            rules={[{ required: true, message: t('pets.form.ageRequired') }]}
          >
            <InputNumber 
              min={0} 
              max={30} 
              placeholder={t('pets.age')}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="breed"
            label={t('pets.breed')}
            rules={[{ required: true, message: t('pets.form.breedRequired') }]}
          >
            <Input placeholder={t('pets.breed')} />
          </Form.Item>

          <Form.Item
            name="weight"
            label={`${t('pets.weight')} (${t('pets.form.weightUnit')})`}
          >
            <InputNumber 
              min={0} 
              max={100} 
              step={0.1}
              placeholder={t('pets.weight')}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={t('pets.description')}
          >
            <Input.TextArea 
              rows={4}
              placeholder={t('pets.form.descriptionPlaceholder')}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingPet ? t('common.save') : t('common.add')}
              </Button>
              <Button onClick={closeModal}>
                {t('common.cancel')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Pets;
