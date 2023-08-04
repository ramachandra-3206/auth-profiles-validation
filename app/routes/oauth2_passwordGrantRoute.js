const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

// In-memory data store to simulate user authentication
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' },
];

// Middleware to parse incoming request bodies
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// Mock OAuth 2.0 token endpoint
router.post('/token', (req, res) => {
  const { grant_type, username, password } = req.body;

  // Check if grant_type is 'password'
  if (grant_type !== 'password') {
    return res.status(400).json({ error: 'unsupported_grant_type' });
  }

  // Find the user based on the provided username
  const user = users.find((u) => u.username === username);

  // Check if the user exists and the password matches
  if (!user || user.password !== password) {
    return res.status(400).json({ error: 'invalid_grant' });
  }

  // Generate a mock access token
  const accessToken = 'mock_access_token';

  // Send the access token as the response
  res.json({ access_token: accessToken, token_type: 'Bearer' , expires_in: 3600, refresh_token:'tGzv3JOkF0XG5Qx2TlKWIA'});
});

// Protected endpoint to test with access token
router.get('/validation', (req, res) => {
    const authorizationHeader = req.headers.authorization;
  
    // Check if the authorization header is present and formatted correctly
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'unauthorized' });
    }
  
    // Extract the access token from the authorization header
    const accessToken = authorizationHeader.substring('Bearer '.length);
  
    // Check if the access token is valid
    if (accessToken !== 'mock_access_token') {
      return res.status(401).json({ error: 'unauthorized' });
    }
  
    // Respond with a success message
    res.json({ message: 'oauth2 password grant successful' });
  });

  module.exports = router;