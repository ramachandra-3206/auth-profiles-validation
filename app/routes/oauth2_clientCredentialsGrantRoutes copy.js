const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { access } = require('fs');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

let client_id = "Test_OAuth2_Client_Credentials_Grant_Client_ID";
let client_secret = "Test_OAuth2_Client_Credentials_Grant_Client_Secret";

let accessTokenMap = new Map();



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




// Endpoint to simulate the token endpoint for client credentials grant
router.post('/token', (req, res) => {

  if (req.body.grant_type !== 'client_credentials') {
    return res.status(400).json({ error: 'Invalid grant type' });
  }
  if(req.body.client_id!==client_id || req.body.client_secret!==client_secret){
    return res.status(400).json({ error: 'Invalid client id or client secret' });
  }


  const access_token = generateToken();
  const expires_in = 300;
  const token_type = 'bearer';
  accessTokenMap.set(access_token, new Date());


  res.json({ access_token: access_token, token_type: token_type, expires_in: expires_in });
});

// Endpoint to test authentication using the access token
router.get('/validation', (req, res) => {
    const authorizationHeader = req.headers.authorization;
    // return res.status(401).json({ error: 'Invalid access token' });
  
    // Check if the access token is provided in the Authorization header
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    const accessToken = authorizationHeader.substring('Bearer '.length);

  
    // Validate the access token (e.g., check expiration, verify signature, etc.)
    // In this mock, we'll assume any non-empty access token is valid
    if (!accessToken || !isTokenValid(accessToken)) {
      return res.status(401).json({ error: 'Invalid access token' });
    }
  
    // Access token is valid, return a success response
    res.json({ message: 'oauth2 client credentials grant successful' });
  });


  module.exports = router;