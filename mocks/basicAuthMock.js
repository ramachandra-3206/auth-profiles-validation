// mocks/basicAuthMock.js

// Hardcoded username and password for demonstration purposes
const username = 'admin';
const password = 'password';

// Middleware function to handle Basic authentication
const basicAuthMock = (req, res, next) => {
  // Extract the Authorization header from the request
  const authHeader = req.headers['authorization'];

  // Check if the Authorization header exists and starts with "Basic "
  if (authHeader && authHeader.startsWith('Basic ')) {
    // Decode the base64-encoded username and password
    const encodedCredentials = authHeader.split(' ')[1];
    const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');

    // Extract the username and password from the decoded credentials
    const [enteredUsername, enteredPassword] = decodedCredentials.split(':');

    // Compare the entered username and password with the hardcoded values
    if (enteredUsername === username && enteredPassword === password) {
      // Authentication successful
      next();
    } else {
      // Authentication failed
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } else {
    // Authorization header missing or not using Basic authentication
    res.status(401).json({ error: 'Authorization required' });
  }
};

module.exports = basicAuthMock;
