// app.js

const path = require('path');
const express = require('express');
const authRoutes = require('./app/routes/authRoutes');
const oauth1Routes = require('./app/routes/oauth1Routes');
const oauth2GrantCodeRoutes = require('./app/routes/oauth2_grantRoutes');
const oauth2PasswordGrantRoutes = require('./app/routes/oauth2_passwordGrantRoute');
const oauth2ClientCredentialsGrantRoutes = require('./app/routes/oauth2_clientCredentialsGrantRoutes');


const app = express();



// Middleware to parse the request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Register your authentication routes
app.use('/auth', authRoutes);

app.use('/oauth1',oauth1Routes);

app.use('/oauth2/grantcode',oauth2GrantCodeRoutes);

app.use('/oauth2/password_grant',oauth2PasswordGrantRoutes);

app.use('/oauth2/client_credentials_grant',oauth2ClientCredentialsGrantRoutes);








// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
