const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));


let client_id = "";
let redirect_uri = "";
let state = "";
let accessToken = "";



// Endpoint for the authorization code grant flow
router.get('/authorize', (req, res) => {

  // Check if the required query parameters are present
  if (!req.query.response_type || req.query.response_type !="code" || !req.query.client_id || !req.query.redirect_uri ) {
    return res.status(400).send('Invalid request parameters');
  }
    client_id = req.query.client_id;
    redirect_uri = req.query.redirect_uri;
    state = req.query.state;


  // Generate a mock authorization code
  const authorizationCode = 'mock-authorization-code';

  // Redirect back to the provided redirect URI with the authorization code
  const redirectUrl = `${redirect_uri}?code=${authorizationCode}`;
  return res.redirect(redirectUrl);
});

// Endpoint for exchanging the authorization code for an access token
router.post('/token', (req, res) => {
  const { grant_type, code, redirect_uri } = req.body;

  // Check if the required request parameters are present
  if (!grant_type || grant_type !== 'authorization_code' || !code || !redirect_uri) {
    return res.status(400).json({ error: 'Invalid request parameters' });
  }

  // Generate a mock access token and other response data
  accessToken = 'mock-access-token';
  const tokenType = 'bearer';
  const expiresIn = 3600;

  // Return the access token and other response data
  return res.json({ access_token: accessToken, token_type: tokenType, expires_in: expiresIn });
});

router.get('/validation', (req, res) => {
    let bearerToken = req.headers['authorization'];
    let token = bearerToken.split(" ")[1];
    if(accessToken === token){
      res.status(200).send({message:"oauth2 successful"});
    }else{
      res.sendStatus(401);
    }

  })

  module.exports = router;
