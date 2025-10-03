export default function handler(req, res) {
  // 設定 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { email, password } = req.body;
    
    // 簡單的登入邏輯（實際應用中應該驗證資料庫）
    if (email && password) {
      // 模擬 JWT token
      const token = 'mock-jwt-token-' + Date.now();
      res.status(200).json({ 
        message: 'Login successful',
        token: token,
        user: { email, name: 'Test User' }
      });
    } else {
      res.status(400).json({ message: 'Email and password required' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
