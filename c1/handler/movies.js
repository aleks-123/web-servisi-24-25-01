const Movie = require('../pkg/movies/moveSchema');

exports.update = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        movie,
      },
    });
  } catch (err) {
    console.log;
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    //.select("")
    let movies = await Movie.find().populate('author', '-password').select('-slika');
    res.status(200).json({
      status: 'success',
      data: {
        movies,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getOne = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        movie,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.create = async (req, res) => {
  try {
    console.log('test');
    const newMovie = await Movie.create(req.body);
    console.log(newMovie);
    res.status(201).json({
      status: 'success',
      data: {
        movie: newMovie,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};
exports.delete = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};

exports.createByUser = async (req, res) => {
  try {
    const newMovie = await Movie.create({
      title: req.body.title,
      year: req.body.year,
      imdbRating: req.body.imdbRating,
      author: req.auth.id,
    });

    res.status(201).json(newMovie);
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err.message });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const mineMovies = await Movie.find({ author: req.auth.id });

    res.status(200).json(mineMovies);
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err.message });
  }
};
