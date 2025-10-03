import React from 'react';
import { Button, Space } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitch = () => {
  const { toggleLanguage, isChinese } = useLanguage();

  return (
    <Button 
      type="text" 
      icon={<GlobalOutlined />} 
      onClick={toggleLanguage}
      style={{ marginRight: '8px' }}
    >
      {isChinese ? 'EN' : '中文'}
    </Button>
  );
};

export default LanguageSwitch;

