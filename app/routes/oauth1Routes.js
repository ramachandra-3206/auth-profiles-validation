const express = require('express');
const querystring = require('querystring');
const router = express.Router();


let oauth_callback = "";
let oauth_consumer_key = "";
let oauth_signature_method = "";
let oauth_signature = "";
let oauth_token = "hh5s93j4hdidpola";
let oauth_verifier = "hfdp7dh39dks9884"



function extractOAuthValues(input) {
  // Remove 'OAuth ' from the input string
  const strippedInput = input.replace('OAuth ', '');
  
  // Parse the input string into an object
  const parsedInput = querystring.parse(strippedInput, ',', '=');
  
  // Extract the values of the specified keys
  const oauth_consumer_key = removeQuotes(parsedInput.oauth_consumer_key);
  const oauth_signature_method = removeQuotes(parsedInput.oauth_signature_method);
  const oauth_token = removeQuotes(parsedInput.oauth_token);
  const oauth_callback = removeQuotes(parsedInput.oauth_callback);
  const oauth_verifier = removeQuotes(parsedInput.oauth_verifier);
  const oauth_signature = removeQuotes(parsedInput.oauth_signature);
  
  // Return an object with the extracted values
  return {
    oauth_signature_method,
    oauth_callback,
    oauth_consumer_key,
    oauth_token,
    oauth_verifier,
    oauth_signature
  };
  
}
function removeQuotes(str) {
  if(str){
    return str.replace(/"/g, '');
  }
  return str;
}

router.post('/initiate', (req, res) => {
  let headerDetails = extractOAuthValues(req.headers['authorization']);
  oauth_signature_method = headerDetails['oauth_signature_method'];
  oauth_callback = headerDetails['oauth_callback'];
  oauth_consumer_key = headerDetails['oauth_consumer_key'];
  oauth_signature = headerDetails['oauth_signature'];
  oauth_token = "hh5s93j4hdidpola";

 // Validate the headers

  if (
    oauth_signature_method === "HMAC-SHA1" &&
    oauth_consumer_key === "test"
  ) {
    // Return the response
    res.setHeader('Content-Type', 'application/x-www-form-urlencoded');
    res.status(200).send('oauth_token=hh5s93j4hdidpola&oauth_token_secret=hdhd0244k9j7ao03&oauth_callback_confirmed=true');
  } else {
    // Invalid headers
    res.sendStatus(401);
  }
});


router.get('/authorize', (req, res) => {
  if(req.query.oauth_token === oauth_token){
    res.redirect(oauth_callback+"?oauth_token=hh5s93j4hdidpola&oauth_verifier=hfdp7dh39dks9884");
  }else{
    res.sendStatus(401);
  }
  
})

router.post('/token', (req, res) => {


  let headerDetails = extractOAuthValues(req.headers['authorization']);

  if(
    headerDetails['oauth_token']===oauth_token &&
    headerDetails['oauth_consumer_key']===oauth_consumer_key &&
    headerDetails['oauth_verifier']===oauth_verifier
    ){
      oauth_signature_method = headerDetails['oauth_signature_method'];
      oauth_consumer_key = headerDetails['oauth_consumer_key'];
      oauth_signature = headerDetails['oauth_signature'];
      oauth_token = 'nnch734d00sl2jdk';
      res.setHeader('Content-Type', 'application/x-www-form-urlencoded');
      res.status(200).send('oauth_token=nnch734d00sl2jdk&oauth_token_secret=pfkkdhi9sl3r4s00');
    }else{
      console.log("/oauth1/token===>validation failed")
      res.sendStatus(401);
    }
})

router.get('/validation', (req, res) => {
  let headerDetails = extractOAuthValues(req.headers['authorization']);
  if(oauth_token === headerDetails['oauth_token']){
    res.status(200).send({message:"oauth1 successful"});
  }else{
    res.sendStatus(401);
  }
})


module.exports = router;

