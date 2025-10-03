const Joi = require('joi');

// 驗證中間件工廠函數
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({ 
        message: '資料驗證失敗', 
        errors 
      });
    }
    next();
  };
};

// 用戶註冊驗證
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': '姓名至少需要 2 個字符',
    'string.max': '姓名不能超過 50 個字符',
    'any.required': '姓名為必填欄位'
  }),
  email: Joi.string().email().required().messages({
    'string.email': '請輸入有效的電子郵件格式',
    'any.required': '電子郵件為必填欄位'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': '密碼至少需要 6 個字符',
    'any.required': '密碼為必填欄位'
  }),
  role: Joi.string().valid('user', 'sitter').default('user')
});

// 用戶登入驗證
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': '請輸入有效的電子郵件格式',
    'any.required': '電子郵件為必填欄位'
  }),
  password: Joi.string().required().messages({
    'any.required': '密碼為必填欄位'
  })
});

// 寵物資料驗證
const petSchema = Joi.object({
  name: Joi.string().min(1).max(50).required().messages({
    'string.min': '寵物名稱不能為空',
    'string.max': '寵物名稱不能超過 50 個字符',
    'any.required': '寵物名稱為必填欄位'
  }),
  type: Joi.string().valid('dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'other').required().messages({
    'any.only': '請選擇有效的寵物類型',
    'any.required': '寵物類型為必填欄位'
  }),
  breed: Joi.string().max(50).allow(''),
  age: Joi.number().min(0).max(30).messages({
    'number.min': '年齡不能小於 0',
    'number.max': '年齡不能超過 30'
  }),
  weight: Joi.number().min(0).max(100).messages({
    'number.min': '體重不能小於 0',
    'number.max': '體重不能超過 100 公斤'
  }),
  description: Joi.string().max(500).allow(''),
  imageUrl: Joi.string().uri().allow('')
});

// 預約資料驗證
const bookingSchema = Joi.object({
  pet: Joi.string().required().messages({
    'any.required': '寵物為必填欄位'
  }),
  sitter: Joi.string().required().messages({
    'any.required': '保姆為必填欄位'
  }),
  startDate: Joi.date().min('now').required().messages({
    'date.min': '開始日期不能早於今天',
    'any.required': '開始日期為必填欄位'
  }),
  endDate: Joi.date().min(Joi.ref('startDate')).required().messages({
    'date.min': '結束日期不能早於開始日期',
    'any.required': '結束日期為必填欄位'
  }),
  message: Joi.string().max(500).allow('')
});

// 保姆資料驗證
const sitterProfileSchema = Joi.object({
  bio: Joi.string().max(1000).allow(''),
  services: Joi.array().items(Joi.string().valid('dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'other')).messages({
    'array.items': '請選擇有效的服務類型'
  }),
  ratePerDay: Joi.number().min(0).max(10000).messages({
    'number.min': '每日費用不能小於 0',
    'number.max': '每日費用不能超過 10000'
  }),
  location: Joi.string().max(100).allow(''),
  imageUrl: Joi.string().uri().allow('')
});

// 商品資料驗證
const productSchema = Joi.object({
  name: Joi.string().min(1).max(100).required().messages({
    'string.min': '商品名稱不能為空',
    'string.max': '商品名稱不能超過 100 個字符',
    'any.required': '商品名稱為必填欄位'
  }),
  description: Joi.string().max(1000).allow(''),
  price: Joi.number().min(0).required().messages({
    'number.min': '價格不能小於 0',
    'any.required': '價格為必填欄位'
  }),
  imageUrl: Joi.string().uri().allow(''),
  category: Joi.string().max(50).allow(''),
  stock: Joi.number().min(0).default(0)
});

// 貼文資料驗證
const postSchema = Joi.object({
  content: Joi.string().min(1).max(2000).required().messages({
    'string.min': '貼文內容不能為空',
    'string.max': '貼文內容不能超過 2000 個字符',
    'any.required': '貼文內容為必填欄位'
  }),
  petType: Joi.string().valid('dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'other').allow(''),
  location: Joi.string().max(100).allow(''),
  tags: Joi.string().max(200).allow(''),
  isPublic: Joi.boolean().default(true)
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  petSchema,
  bookingSchema,
  sitterProfileSchema,
  productSchema,
  postSchema
};
