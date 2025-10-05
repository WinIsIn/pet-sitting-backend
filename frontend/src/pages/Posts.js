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
  Popconfirm
} from 'antd';
import { 
  PlusOutlined, 
  HeartOutlined, 
  HeartFilled, 
  MessageOutlined, 
  ShareAltOutlined,
  UserOutlined,
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';
import api from '../api'; // ✅ 使用 api.js
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

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
      const response = await api.get(`/api/posts?page=${currentPage}&limit=10`);
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('獲取貼文失敗:', error);
      message.error(t('posts.messages.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  // ✅ 建立或更新貼文
  const handleCreateOrUpdatePost = async (values) => {
    try {
      setLoading(true); // 開始載入
      const formData = new FormData();
      formData.append('content', values.content);
      if (values.petType) formData.append('petType', values.petType);
      if (values.location) formData.append('location', values.location);
      if (values.tags) formData.append('tags', values.tags);

      // 添加圖片
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('images', file.originFileObj);
        } else if (file.url) {
          // 保留原圖
          formData.append('existingImages', file.url);
        }
      });

      let response;
      if (editingPost) {
        // 更新貼文
        response = await api.put(`/api/posts/${editingPost._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        message.success(t('posts.messages.updateSuccess'));
      } else {
        // 新增貼文
        response = await api.post('/api/posts', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        message.success(t('posts.messages.createSuccess'));
      }

      setModalVisible(false);
      form.resetFields();
      setFileList([]);
      fetchPosts();
    } catch (error) {
      console.error('貼文操作失敗:', error);
      message.error(
        t('posts.messages.createFailed') +
          ': ' +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false); // 結束載入
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await api.post(`/api/posts/${postId}/like`);
      setPosts(posts.map((post) => (post._id === postId ? response.data : post)));
    } catch {
      message.error(t('posts.messages.likeFailed'));
    }
  };

  const handleComment = async (postId, content) => {
    try {
      const response = await api.post(`/api/posts/${postId}/comments`, { content });
      setPosts(posts.map((post) => (post._id === postId ? response.data : post)));
    } catch {
      message.error(t('posts.messages.commentFailed'));
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const response = await api.delete(`/api/posts/${postId}/comments/${commentId}`);
      setPosts(posts.map((post) => (post._id === postId ? response.data : post)));
      message.success(t('posts.messages.deleteCommentSuccess'));
    } catch (error) {
      console.error('刪除留言失敗:', error);
      message.error(t('posts.messages.deleteCommentFailed'));
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await api.delete(`/api/posts/${postId}`);
      message.success(t('posts.messages.deleteSuccess'));
      fetchPosts();
    } catch {
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
      tags: post.tags.join(','),
    });
    setFileList(
      post.images.map((url, index) => ({
        uid: index,
        name: `image-${index}`,
        status: 'done',
        url: url,
      }))
    );
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
      return false;
    },
    onChange: (info) => setFileList(info.fileList),
    multiple: true,
    listType: 'picture-card',
    maxCount: 9,
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <Title level={2}>{t('posts.title')}</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
          {t('posts.createPost')}
        </Button>
      </div>

      {posts.map((post) => (
        <Card key={post._id} style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                src={
                  post.author?.avatar
                    ? post.author.avatar
                    : null
                }
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
                <Button type="text" icon={<EditOutlined />} onClick={() => openEditModal(post)} />
                <Popconfirm
                  title={t('posts.confirmDelete')}
                  onConfirm={() => handleDeletePost(post._id)}
                  okText={t('common.yes')}
                  cancelText={t('common.no')}
                >
                  <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            )}
          </div>

          <div style={{ marginTop: '12px' }}>
            <Text>{post.content}</Text>
          </div>

          {post.tags?.map((tag) => (
            <Tag key={tag} color="blue">
              #{tag}
            </Tag>
          ))}
          {post.location && <Tag color="green">{post.location}</Tag>}
          {post.petType && <Tag color="purple">{post.petType}</Tag>}

          {post.images?.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <Image.PreviewGroup>
                <Row gutter={[8, 8]}>
                  {post.images.map((image, index) => (
                    <Col key={index} span={post.images.length === 1 ? 24 : 12}>
                      <Image
                        src={image}
                        alt={`post-image-${index}`}
                        style={{ width: '100%', borderRadius: '8px' }}
                      />
                    </Col>
                  ))}
                </Row>
              </Image.PreviewGroup>
            </div>
          )}

          {/* 互動操作：按讚、留言數 */}
          <div style={{ marginTop: 12, display: 'flex', gap: 16 }}>
            <Button
              type="text"
              icon={
                post.likes?.some((u) => (u?._id || u) === user?.id) ? (
                  <HeartFilled style={{ color: '#eb2f96' }} />
                ) : (
                  <HeartOutlined />
                )
              }
              onClick={() => handleLike(post._id)}
            >
              {post.likes?.length || 0}
            </Button>
            <Button type="text" icon={<MessageOutlined />}> {post.comments?.length || 0}</Button>
          </div>

          {/* 留言列表 */}
          <Divider style={{ margin: '16px 0' }} />
          <List
            dataSource={post.comments || []}
            locale={{ emptyText: null }}
            renderItem={(comment) => (
              <List.Item
                actions={
                  comment.user?._id === user?.id
                    ? [
                        <Button
                          type="link"
                          danger
                          size="small"
                          onClick={() => handleDeleteComment(post._id, comment._id)}
                        >
                          {t('common.delete')}
                        </Button>,
                      ]
                    : []
                }
              >
                <List.Item.Meta
                  avatar={<Avatar src={comment.user?.avatar} icon={<UserOutlined />} />}
                  title={
                    <span>
                      {comment.user?.name}{' '}
                      <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                        {new Date(comment.createdAt).toLocaleString()}
                      </Text>
                    </span>
                  }
                  description={comment.content}
                />
              </List.Item>
            )}
          />

          {/* 新增留言 */}
          {user && (
            <Form
              layout="vertical"
              onFinish={(values) => {
                if (!values.comment || !values.comment.trim()) return;
                handleComment(post._id, values.comment.trim());
              }}
              style={{ marginTop: 8 }}
            >
              <Form.Item name="comment">
                <TextArea rows={2} placeholder={t('posts.addComment')} />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button type="primary" htmlType="submit" icon={<MessageOutlined />}>
                  {t('common.submit')}
                </Button>
              </Form.Item>
            </Form>
          )}
        </Card>
      ))}

      {/* 貼文建立/編輯 Modal */}
      <Modal
        title={editingPost ? t('posts.editPost') : t('posts.createPost')}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateOrUpdatePost}>
          <Form.Item
            name="content"
            label={t('posts.content')}
            rules={[{ required: true, message: t('posts.form.contentRequired') }]}
          >
            <TextArea rows={4} placeholder={t('posts.form.contentPlaceholder')} />
          </Form.Item>

          <Form.Item name="images" label={t('posts.images')}>
            <Upload {...uploadProps} fileList={fileList}>
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
              <Form.Item name="petType" label={t('posts.petType')}>
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
              <Form.Item name="location" label={t('posts.location')}>
                <Input placeholder={t('posts.form.locationPlaceholder')} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="tags" label={t('posts.tags')}>
            <Input placeholder={t('posts.form.tagsPlaceholder')} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingPost ? t('common.save') : t('posts.publish')}
              </Button>
              <Button onClick={() => setModalVisible(false)}>{t('common.cancel')}</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Posts;
