// app/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const basicAuthMock = require('../../mocks/basicAuthMock');
const apiKeyAuthMock = require('../../mocks/apiKeyAuthMock');



// Route that requires Basic authentication
router.get('/protected-basic', basicAuthMock, (req, res) => {
  console.log('/protected-basic===>called');
  console.log('Basic Auth successful');
  res.status(200).json({ message: 'Basic authentication successful' });
  // res.json({ message: 'Basic authentication successful' });
});

// Route that requires API key-based authentication
router.get('/protected-apikey', apiKeyAuthMock, (req, res) => {
  console.log('/protected-apikey===>called');
  console.log('APIKey Auth successful');
  res.status(200).json({ message: 'API key-based authentication successful' });
  // res.json({ message: 'API key-based authentication successful' });
});



module.exports = router;
