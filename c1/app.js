//!! npm install dotenv
//* So dotenv ja konfigurirame okolinata
//!npm install ejs
const jwt = require('express-jwt');
const cookieParser = require('cookie-parser');
const express = require('express');
const movies = require('./handler/movies');
const auth = require('./handler/authHandler');
const viewHandler = require('./handler/viewHandler');
const db = require('./pkg/db/index');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//!
app.set('view engine', 'ejs');
app.use(express.static('public'));
//!

db.init();

app.post('/api/v1/signup', auth.signup);
app.post('/api/v1/login', auth.login);

app.post('/forgotPassword', auth.forgotPassword);
// app.patch("/resetPassword/:token")

app.use(
  jwt
    .expressjwt({
      algorithms: ['HS256'],
      secret: process.env.JWT_SECRET,
      getToken: (req) => {
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
      path: ['/api/v1/signup', '/api/v1/login', '/movies/:id', '/login'],
    })
);

app.get('/api/v1/movies', movies.getAll);
app.get('/api/v1/movies/:id', movies.getOne);
app.post('/api/v1/movies', auth.protect, movies.create);
app.patch('/api/v1/movies/:id', movies.uploadFilmsPhotos, movies.update);
app.delete('/api/v1/movies/:id', movies.delete);
app.get('/api/v1/getMilki/:yearEnd/:startYear');

app.post('/api/v1/movieByMe', auth.protect, movies.createByUser);
app.get('/api/v1/movieByMe', auth.protect, movies.getByUser);

app.get('/login', viewHandler.getLoginForm);
app.get('/viewmovies', viewHandler.movieView);
app.post('/createmovie', viewHandler.createMovie);
app.get('/deletemovie/:id', viewHandler.deleteMovie);

// app.get()

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

//?
//! za forumot, sekoj korisnik da ima default slika - covece
//! na patch metoda da moze korisnikot da ja promeni profilnata slika
