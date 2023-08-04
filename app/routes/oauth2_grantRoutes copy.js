const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));


let client_id = "Test_OAuth2_Grant_Code_Client_ID";
let client_secret = "Test_OAuth2_Grant_Code_Client_Secret";
let redirect_uri = "";
let state = "";
let authorizationCodeSet = new Set();
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




// Endpoint for the authorization code grant flow
router.get('/authorize', (req, res) => {

  // Check if the required query parameters are present
  if (!req.query.response_type || req.query.response_type !="code" || !req.query.client_id || req.query.client_id != client_id|| !req.query.redirect_uri ) {
    return res.status(400).send('Invalid request parameters');
  }
    redirect_uri = req.query.redirect_uri;
    state = req.query.state;


  // Generate a mock authorization code
  const authorizationCode = generateToken();
  authorizationCodeSet.add(authorizationCode);

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
  if(!authorizationCodeSet.has(code)){
    res.sendStatus(401);
  }

  authorizationCodeSet.delete(code);

  // Generate a mock access token and other response data
  let accessToken = generateToken();
  accessTokenMap.set(accessToken,new Date());
  const tokenType = 'bearer';
  const expiresIn = 300;
  const refreshToken = generateToken();
  refreshTokenSet.add(refreshToken);

  // Return the access token and other response data
  return res.json({ access_token: accessToken, token_type: tokenType, expires_in: expiresIn, refresh_token: refreshToken });
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



router.get('/validation', (req, res) => {
    let bearerToken = req.headers['authorization'];
    let token = bearerToken.split(" ")[1];
    if(accessTokenMap.has(token) && isTokenValid(token)){
      res.status(200).send({message:"oauth2 successful"});
    }else{
      if(token && accessTokenMap.has(token) ){
        accessTokenMap.delete(token);
      }
      res.sendStatus(401);
    }

    // res.sendStatus(401);

  });

  module.exports = router;
