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
    // 模擬圖片上傳成功
    const imageUrl = `https://via.placeholder.com/400x300/cccccc/666666?text=Uploaded+Image+${Date.now()}`;
    
    res.status(200).json({ 
      message: 'Upload successful',
      url: imageUrl,
      public_id: `img-${Date.now()}-${Math.round(Math.random() * 1e9)}`
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
