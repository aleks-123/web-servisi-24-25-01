const Movie = require('../pkg/movies/moveSchema');
//! npm install multer
//! npm install uuid

const multer = require('multer');
const uuid = require('uuid');

//* GENERATOR ZA ID
const imageId = uuid.v4();

//! multerStorage - definirame na koja lokacija i kakvo ime bi imale slikite
// mimetype = image/jp
const multerStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'public/img/movies');
  },
  filename: (req, file, callback) => {
    //? - movie-uuid-timestamp.jpg - vakov format
    const ext = file.mimetype.split('/')[1];
    callback(null, `movie-${imageId}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(new Error('File type is not supported'), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

//! poedinecna slika
exports.uploadFilmPhotos = upload.single('slika');
//! povekje sliki
// exports.uploadFilmsSliki = upload.array('sliki', 3);
//!kombinacija
// exports.uploadFilmsPhotos = upload.fields([
//   { name: 'slika', maxCount: 1 },
//   { name: 'sliki', maxCount: 3 },
// ]);

exports.update = async (req, res) => {
  try {
    console.log(req.file);
    console.log(req.body);

    if (req.file) {
      const fileName = req.file.filename;
      req.body.slika = fileName;
    }

    // if (req.files && req.files.sliki) {
    //   const filenames = req.files.sliki.map((file) => file.fileName);
    //   req.body.sliki = filenames;
    // }

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
