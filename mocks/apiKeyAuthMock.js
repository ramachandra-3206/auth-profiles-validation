// mocks/apiKeyAuthMock.js

// List of valid API keys
const validApiKeys = ['YOUR_API_KEY_1', 'YOUR_API_KEY_2'];

// Middleware function to handle API key-based authentication
const apiKeyAuthMock = (req, res, next) => {
  // Extract the API key from the request headers
  const apiKey = req.headers['x-api-key'];

  // Check if the API key is provided and valid
  if (apiKey && validApiKeys.includes(apiKey)) {
    // Authentication successful
    next();
  } else {
    // Authentication failed
    res.status(401).json({ error: 'Invalid API key' });
  }
};

module.exports = apiKeyAuthMock;
