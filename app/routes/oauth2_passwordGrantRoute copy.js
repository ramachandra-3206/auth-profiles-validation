const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const crypto = require('crypto');

// In-memory data store to simulate user authentication
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' },
];

// Middleware to parse incoming request bodies
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


let accessTokenMap = new Map();
let refreshTokenSet = new Set();



function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}


function isTokenValid(userAuthToken){
  // Convert the timestamp strings to Date objects

  if(!userAuthToken){
    return false;
  }
    
    const userTokenTime = accessTokenMap.get(userAuthToken);
    const currentTime = new Date();
    if(!userTokenTime){
      return false;
    }
  
    // Calculate the time difference in milliseconds
    const timeDifference = Math.abs(currentTime - userTokenTime);
  
    // Convert the time difference to minutes
    const timeDifferenceInMinutes = Math.floor(timeDifference / (1000 * 60));
  
    // Check if the time difference is less than 5 minutes
    if (timeDifferenceInMinutes < 5) {
      return true;
    } else {
      accessTokenMap.delete(userAuthToken);
      return false;
    }
  }

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
  const accessToken = generateToken();
  const refreshToken = generateToken();
  accessTokenMap.set(accessToken, new Date());
  refreshTokenSet.add(refreshToken)


  // Send the access token as the response
  res.json({ access_token: accessToken, token_type: 'Bearer' , expires_in: 300, refresh_token:refreshToken});
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
    if (!isTokenValid(accessToken)) {
      return res.status(401).json({ error: 'unauthorized' });
    }
  
    // Respond with a success message
    res.json({ message: 'oauth2 password grant successful' });
  });

  router.post('/refresh_token', (req, res) => {

    // Check if the required request parameters are present
    if (!req.body.grant_type || req.body.grant_type !== 'refresh_token' || !req.body.refresh_token) {
      return res.status(400).json({ error: 'Invalid request parameters' });
    }
    if(!refreshTokenSet.has(req.body.refresh_token)){
      return res.sendStatus(401);
    }
    refreshTokenSet.delete(req.body.refresh_token);
  
    let accessToken = generateToken();
    accessTokenMap.set(accessToken,new Date());
    const tokenType = 'bearer';
    const expiresIn = 300;
    const refreshToken = generateToken();
    refreshTokenSet.add(refreshToken);
    
    return res.json({ access_token: accessToken, token_type: tokenType, expires_in: expiresIn, refresh_token: refreshToken });
  
  });

  module.exports = router;