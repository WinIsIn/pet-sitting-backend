const serverless = require('serverless-http');
const path = require('path');

// 確保能找到 server.js
const serverPath = path.join(__dirname, '..', 'server.js');
const app = require(serverPath);

module.exports = (req, res) => {
  return serverless(app)(req, res);
};


