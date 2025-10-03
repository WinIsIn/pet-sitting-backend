export default function handler(req, res) {
  if (req.method === 'POST') {
    res.status(200).json({ 
      message: 'Upload successful',
      url: 'https://via.placeholder.com/400x300/cccccc/666666?text=Uploaded+Image'
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
