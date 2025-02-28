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
      movies,
    });
  } catch (err) {
    res.status(500).send('Error');
  }
};
