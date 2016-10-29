const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const router = require('./routes.js');



app.use(session({
  secret: 'my team is the suicide squad',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}));

router(app);

var port = process.env.PORT || 3000;

app.listen(port);
console.log("Server is doing big things on port "+ port);

module.exports = app;
