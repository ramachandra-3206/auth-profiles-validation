const express = require('express');
const router = express.Router();
const crypto = require('crypto');

router.use(express.json());

let oauthTokensMap = new Map();
let oauth_callback = "";

// Helper function to parse the authorization header
function parseAuthorizationHeader(header) {
  const regex = /(\w+)="([^"]*)"/g;
  let match;
  const data = {};
  while ((match = regex.exec(header))) {
    const key = match[1];
    const value = match[2];
    data[key] = decodeURIComponent(value);
  }
  return data;
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}
    

function isTokenValid(userAuthToken){
  if(!userAuthToken){
    return false;
  }
// Convert the timestamp strings to Date objects
  
  const userTokenTime = oauthTokensMap.get(userAuthToken);
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
    oauthTokensMap.delete(userAuthToken);
    return false;
  }
}

router.post('/initiate', (req, res) => {
  const authorizationHeader = req.headers.authorization;
  const authorizationData = parseAuthorizationHeader(authorizationHeader);
  oauth_callback = authorizationData.oauth_callback;

  if (
    authorizationData.oauth_signature_method === "HMAC-SHA1" &&
    authorizationData.oauth_consumer_key === "Test_OAuth1_Consumer_Key"
  ) {
    // Return the response
    res.setHeader('Content-Type', 'application/x-www-form-urlencoded');
    let randomOAuthToken = generateToken();
    oauthTokensMap.set(randomOAuthToken, new Date());

    res.status(200).send('oauth_token='+randomOAuthToken+'&oauth_token_secret=hdhd0244k9j7ao03&oauth_callback_confirmed=true');
  } else {
    // Invalid headers
    res.sendStatus(401);
  }
});



router.post('/token', (req, res) => {
  const authorizationHeader = req.headers.authorization;
  const authorizationData = parseAuthorizationHeader(authorizationHeader);
  if(!oauthTokensMap.has(authorizationData.oauth_token)){
    console.log("/oauth1/token===>validation failed")
    return res.sendStatus(401);
  }
  if(
    authorizationData.oauth_consumer_key==="Test_OAuth1_Consumer_Key" &&
    authorizationData.oauth_verifier==='hfdp7dh39dks9884'
    ){
      oauthTokensMap.delete(authorizationData.oauth_token);
      let oauth_token = generateToken();
      oauthTokensMap.set(oauth_token, new Date());
      res.setHeader('Content-Type', 'application/x-www-form-urlencoded');
      return res.status(200).send('oauth_token='+oauth_token+'&oauth_token_secret=pfkkdhi9sl3r4s00');
    }else{
      console.log("/oauth1/token===>validation failed")
      res.sendStatus(401);
    }
})



router.get('/authorize', (req, res) => {
  if(oauthTokensMap.get(req.query.oauth_token)){
    oauthTokensMap.delete(req.query.oauth_token);
    let newOauthToken = generateToken();
    oauthTokensMap.set(newOauthToken,new Date());
    return res.redirect(oauth_callback+"?oauth_token="+newOauthToken+"&oauth_verifier=hfdp7dh39dks9884");
  }else{
    return res.sendStatus(401);
  }
  
})


router.get('/validation', (req, res) => {
  const authorizationHeader = req.headers.authorization;
  const authorizationData = parseAuthorizationHeader(authorizationHeader);
  let currentUserToken = authorizationData.oauth_token;
  if(!currentUserToken || !isTokenValid(currentUserToken)){
    return res.sendStatus(401);
  }
  if(oauthTokensMap.get(authorizationData.oauth_token)){
    return res.status(200).send({message:"oauth1 successful"});
  }else{
    return res.sendStatus(401);
  }
})

module.exports = router;