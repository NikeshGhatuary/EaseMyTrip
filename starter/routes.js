const express = require('express');
const users = require('../routes/users');
const auth = require('../routes/auth');
const index = require('../routes/index');
const location = require('../routes/location');
const payments = require('../routes/payments');
const login = require('../routes/login');
const register = require('../routes/register');
const thankyou = require('../routes/thankyou');
const loggedin = require('../routes/loggedin');
const developer = require('../routes/developer');



module.exports = function(app) {
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use('/', index);
  app.use('/location', location);
  app.use('/payment', payments);
  app.use('/login', login);
  app.use('/loggedin', loggedin);
  app.use('/register', register);
  app.use('/thankyou', thankyou);
  app.use('/developer', developer);

};
