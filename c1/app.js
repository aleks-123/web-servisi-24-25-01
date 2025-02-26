//!! npm install dotenv
//* So dotenv ja konfigurirame okolinata
const jwt = require('express-jwt');
const cookieParser = require('cookie-parser');
const express = require('express');
const movies = require('./handler/movies');
const auth = require('./handler/authHandler');
const db = require('./pkg/db/index');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

db.init();

app.post('/api/v1/signup', auth.signup);
app.post('/api/v1/login', auth.login);

app.get('/movies', movies.getAll);

app.use(
  jwt.expressjwt({
    algorithms: ['HS256'],
    secret: process.env.JWT_SECRET,
    getToken: (req) => {
      console.log(req.cookies);
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
      }
      if (req.cookies.jwt) {
        return req.cookies.jwt;
      }
      return null;
    },
  })
  // .unless({
  //   path: ['/api/v1/signup', '/api/v1/login', '/movies', '/movies/:id'],
  // })
);
app.get('/movies/:id', movies.getOne);
app.post('/movies', movies.create);
app.patch('/movies/:id', movies.update);
app.delete('/movies/:id', movies.delete);

app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.log('Could not start service');
  }
  console.log(`Service started successfully on port ${process.env.PORT}`);
});
