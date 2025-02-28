const Movie = require('../pkg/movies/moveSchema');

exports.getLoginForm = async (req, res) => {
  try {
    res.status(200).render('login', {
      title: 'Login',
      podnaslov: 'Login to see our movies',
    });
  } catch (err) {
    res.status(500).send('Error');
  }
};

exports.movieView = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).render('viewFilms', {
      naslov: 'Our movie',
      kategorija: 'Comedy',
      test: 'HELLOOO',
      movies,
    });
  } catch (err) {
    res.status(500).send('Error');
  }
};

exports.createMovie = async (req, res) => {
  try {
    console.log(req.body);
    await Movie.create(req.body);
    res.redirect('/viewmovies');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const movieId = req.params.id;
    await Movie.findByIdAndDelete(movieId);
    res.redirect('/viewmovies');
  } catch (err) {
    res.status(500).send(err.message);
  }
};
