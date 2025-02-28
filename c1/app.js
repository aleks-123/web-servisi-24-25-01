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
  jwt
    .expressjwt({
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
    .unless({
      path: ['/api/v1/signup', '/api/v1/login', '/movies', '/movies/:id', { url: '/movies', methods: ['GET', 'POST'] }],
    })
);
app.get('/movies/:id', movies.getOne);
app.post('/movies', auth.protect, movies.create);
app.patch('/movies/:id', movies.update);
app.delete('/movies/:id', movies.delete);
app.post('/movieByMe', auth.protect, movies.createByUser);
app.get('/movieByMe', auth.protect, movies.getByUser);

app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.log('Could not start service');
  }
  console.log(`Service started successfully on port ${process.env.PORT}`);
});

//! Zadaca za chas
//! Kreiranje na forum ---
//? get /posts za moze da gi zemame site posta
//? get /post:id ovde da se populirani plus specificen post
//? post /posts da moze kako korisnici da kreirame post
//? i da imame /myprofile kade sto kje gi prikazuvame samo nashite postovi
