const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// Endpoint to simulate the token endpoint for client credentials grant
router.post('/token', (req, res) => {
  const { grant_type, client_id, client_secret } = req.body;


  if (grant_type !== 'client_credentials') {
    return res.status(400).json({ error: 'Invalid grant type' });
  }
  if(client_id!=="test_client_id" || client_secret!=="test_client_secret_key"){
    return res.status(400).json({ error: 'Invalid client id or client secret' });
  }

  // Mocked response with a sample access token
  const access_token = 'mocked-access-token';

  res.json({ access_token });
});

// Endpoint to test authentication using the access token
router.get('/validation', (req, res) => {
    const authorizationHeader = req.headers.authorization;
  
    // Check if the access token is provided in the Authorization header
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    const accessToken = authorizationHeader.substring('Bearer '.length);
  
    // Validate the access token (e.g., check expiration, verify signature, etc.)
    // In this mock, we'll assume any non-empty access token is valid
    if (!accessToken) {
      return res.status(401).json({ error: 'Invalid access token' });
    }
  
    // Access token is valid, return a success response
    res.json({ message: 'oauth2 client credentials grant successful' });
  });


  module.exports = router;