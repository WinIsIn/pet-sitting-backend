export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ message: 'Auth endpoint' });
  } else if (req.method === 'POST') {
    res.status(200).json({ message: 'Auth POST endpoint' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
