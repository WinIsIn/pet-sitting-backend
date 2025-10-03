import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Upload, 
  message, 
  Typography, 
  Space, 
  Avatar, 
  Tag, 
  Select, 
  Row, 
  Col,
  Image,
  List,
  Divider,
  Tooltip,
  Popconfirm
} from 'antd';
import { 
  PlusOutlined, 
  HeartOutlined, 
  HeartFilled, 
  MessageOutlined, 
  ShareAltOutlined, 
  CameraOutlined,
  UserOutlined,
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

// 配置 axios 基礎 URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_BASE_URL;

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Posts = () => {
  const { t } = useTranslation();
  const { isChinese } = useLanguage();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/posts?page=${currentPage}&limit=10`);
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('獲取貼文失敗:', error);
      message.error(t('posts.messages.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (values) => {
    try {
      console.log('開始創建貼文，表單數據:', values);
      console.log('文件列表:', fileList);
      
      const formData = new FormData();
      formData.append('content', values.content);
      if (values.petType) formData.append('petType', values.petType);
      if (values.location) formData.append('location', values.location);
      if (values.tags) formData.append('tags', values.tags);
      
      // 添加圖片
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('images', file.originFileObj);
        }
      });

      console.log('發送請求到 /api/posts');
      const response = await axios.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('貼文創建成功:', response.data);
      
      message.success(t('posts.messages.createSuccess'));
      setModalVisible(false);
      form.resetFields();
      setFileList([]);
      fetchPosts();
    } catch (error) {
      console.error('創建貼文錯誤:', error);
      console.error('錯誤詳情:', error.response?.data);
      message.error(t('posts.messages.createFailed') + ': ' + (error.response?.data?.message || error.message));
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.post(`/api/posts/${postId}/like`);
      setPosts(posts.map(post => 
        post._id === postId ? response.data : post
      ));
    } catch (error) {
      message.error(t('posts.messages.likeFailed'));
    }
  };

  const handleComment = async (postId, content) => {
    try {
      const response = await axios.post(`/api/posts/${postId}/comments`, { content });
      setPosts(posts.map(post => 
        post._id === postId ? response.data : post
      ));
    } catch (error) {
      message.error(t('posts.messages.commentFailed'));
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      console.log('準備刪除留言:', { postId, commentId });
      console.log('認證 token:', localStorage.getItem('token'));
      console.log('當前用戶:', user);
      console.log('API 基礎 URL:', axios.defaults.baseURL);
      
      const deleteUrl = `/api/posts/${postId}/comments/${commentId}`;
      console.log('刪除 URL:', deleteUrl);
      
      // 先測試 API 連接
      try {
        const testResponse = await axios.get('/api/posts');
        console.log('API 連接測試成功:', testResponse.status);
      } catch (testError) {
        console.error('API 連接測試失敗:', testError);
      }
      
      const response = await axios.delete(deleteUrl, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('刪除留言成功:', response.data);
      setPosts(posts.map(post => 
        post._id === postId ? response.data : post
      ));
      message.success('留言刪除成功');
    } catch (error) {
      console.error('刪除留言失敗:', error);
      console.error('錯誤詳情:', error.response?.data);
      console.error('錯誤狀態:', error.response?.status);
      console.error('錯誤配置:', error.config);
      console.error('完整錯誤:', error);
      message.error(t('posts.messages.deleteCommentFailed') + ': ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`/api/posts/${postId}`);
      message.success(t('posts.messages.deleteSuccess'));
      fetchPosts();
    } catch (error) {
      message.error(t('posts.messages.deleteFailed'));
    }
  };

  const openCreateModal = () => {
    setEditingPost(null);
    setModalVisible(true);
    form.resetFields();
    setFileList([]);
  };

  const openEditModal = (post) => {
    setEditingPost(post);
    setModalVisible(true);
    form.setFieldsValue({
      content: post.content,
      petType: post.petType,
      location: post.location,
      tags: post.tags.join(',')
    });
    setFileList(post.images.map((url, index) => ({
      uid: index,
      name: `image-${index}`,
      status: 'done',
      url: url
    })));
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingPost(null);
    form.resetFields();
    setFileList([]);
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error(t('posts.form.imageOnly'));
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error(t('posts.form.imageSize'));
        return false;
      }
      return false; // 阻止自動上傳
    },
    onChange: (info) => {
      setFileList(info.fileList);
    },
    multiple: true,
    listType: 'picture-card',
    maxCount: 9
  };

  const renderPost = (post) => (
    <Card key={post._id} style={{ marginBottom: '16px' }}>
      {/* 貼文頭部 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            src={post.author?.avatar ? (post.author.avatar.startsWith('http') ? post.author.avatar : `${process.env.REACT_APP_API_URL || ''}/uploads/${post.author.avatar}`) : null}
            icon={<UserOutlined />} 
            style={{ marginRight: '8px' }}
          />
          <div>
            <Text strong>{post.author?.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {new Date(post.createdAt).toLocaleString()}
            </Text>
          </div>
        </div>
        {post.author?._id === user?.id && (
          <Space>
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => openEditModal(post)}
            />
            <Popconfirm
              title={t('posts.confirmDelete')}
              onConfirm={() => handleDeletePost(post._id)}
              okText={t('common.yes')}
              cancelText={t('common.no')}
            >
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Space>
        )}
      </div>

      {/* 貼文內容 */}
      <div style={{ marginBottom: '12px' }}>
        <Text>{post.content}</Text>
      </div>

      {/* 標籤和地點 */}
      <div style={{ marginBottom: '12px' }}>
        {post.tags?.map(tag => (
          <Tag key={tag} color="blue">#{tag}</Tag>
        ))}
        {post.location && (
          <Tag color="green">📍 {post.location}</Tag>
        )}
        {post.petType && (
          <Tag color="purple">🐾 {post.petType}</Tag>
        )}
      </div>

      {/* 圖片 */}
      {post.images && post.images.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <Image.PreviewGroup>
            <Row gutter={[8, 8]}>
              {post.images.map((image, index) => {
                console.log('渲染圖片:', image);
                return (
                  <Col key={index} span={post.images.length === 1 ? 24 : 12}>
                    <Image
                      src={image}
                      alt={`post-image-${index}`}
                      style={{ width: '100%', borderRadius: '8px' }}
                      onError={(e) => {
                        console.error('圖片加載失敗:', image, e);
                      }}
                    />
                  </Col>
                );
              })}
            </Row>
          </Image.PreviewGroup>
        </div>
      )}

      {/* 互動按鈕 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Button
            type="text"
            icon={post.likes?.some(like => like._id === user?.id) ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
            onClick={() => handleLike(post._id)}
          >
            {post.likes?.length || 0}
          </Button>
          <Button type="text" icon={<MessageOutlined />}>
            {post.comments?.length || 0}
          </Button>
          <Button type="text" icon={<ShareAltOutlined />}>
            {t('posts.share')}
          </Button>
        </Space>
      </div>

      {/* 留言區 */}
      <Divider />
      <List
        dataSource={post.comments}
        locale={{ emptyText: t('common.noData') }}
        renderItem={(comment) => {
          console.log('留言用戶數據:', comment.user);
          console.log('留言用戶頭像:', comment.user?.avatar);
          return (
            <List.Item style={{ padding: '8px 0' }}>
              <List.Item.Meta
                avatar={
                  <Avatar 
                    size="small" 
                    src={comment.user?.avatar ? (comment.user.avatar.startsWith('http') ? comment.user.avatar : `${process.env.REACT_APP_API_URL || ''}/uploads/${comment.user.avatar}`) : null}
                    icon={<UserOutlined />}
                  />
                }
                title={
                  <Space>
                    <Text strong style={{ fontSize: '14px' }}>{comment.user?.name}</Text>
                    <Text style={{ fontSize: '12px' }}>
                      {new Date(comment.createdAt).toLocaleString()}
                    </Text>
                  </Space>
                }
                description={comment.content}
              />
              {(comment.user?._id === user?.id || post.author?._id === user?.id) && (
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteComment(post._id, comment._id)}
                />
              )}
            </List.Item>
          );
        }}
      />

      {/* 添加留言 */}
      <div style={{ marginTop: '12px' }}>
        <Input
          placeholder={t('posts.addComment')}
          onPressEnter={(e) => {
            if (e.target.value.trim()) {
              handleComment(post._id, e.target.value);
              e.target.value = '';
            }
          }}
        />
      </div>
    </Card>
  );

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2}>
          {t('posts.title')}
        </Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={openCreateModal}
        >
          {t('posts.createPost')}
        </Button>
      </div>

      {/* 貼文列表 */}
      <div>
        {posts.map(renderPost)}
      </div>

      {/* 創建/編輯貼文模態框 */}
      <Modal
        title={editingPost ? t('posts.editPost') : t('posts.createPost')}
        open={modalVisible}
        onCancel={closeModal}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreatePost}
        >
          <Form.Item
            name="content"
            label={t('posts.content')}
            rules={[{ required: true, message: t('posts.form.contentRequired') }]}
          >
            <TextArea 
              rows={4} 
              placeholder={t('posts.form.contentPlaceholder')}
            />
          </Form.Item>

          <Form.Item
            name="images"
            label={t('posts.images')}
          >
            <Upload {...uploadProps}>
              {fileList.length >= 9 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>{t('posts.upload')}</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="petType"
                label={t('posts.petType')}
              >
                <Select placeholder={t('posts.selectPetType')}>
                  <Option value="dog">{t('posts.types.dog')}</Option>
                  <Option value="cat">{t('posts.types.cat')}</Option>
                  <Option value="bird">{t('posts.types.bird')}</Option>
                  <Option value="fish">{t('posts.types.fish')}</Option>
                  <Option value="rabbit">{t('posts.types.rabbit')}</Option>
                  <Option value="hamster">{t('posts.types.hamster')}</Option>
                  <Option value="other">{t('posts.types.other')}</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="location"
                label={t('posts.location')}
              >
                <Input placeholder={t('posts.form.locationPlaceholder')} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="tags"
            label={t('posts.tags')}
          >
            <Input placeholder={t('posts.form.tagsPlaceholder')} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingPost ? t('common.save') : t('posts.publish')}
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

export default Posts;
