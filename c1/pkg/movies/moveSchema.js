const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'It must have a title'],
    trim: true,
    minlength: 1,
    maxlength: [255, 'Title is too long.'],
    unique: [true, 'it must have unique title every movie'],
  },
  year: {
    type: Number,
    min: 1900,
    max: new Date().getFullYear(),
  },
  genre: {
    type: String,
    enum: ['Action', 'Comedy', 'Drama', 'Science Fiction', 'Fantasy'],
  },
  imdbRating: {
    type: Number,
    min: 0,
    max: 10,
  },
  slika: {
    type: String,
    default: 'default.jpg',
  },
  sliki: {
    type: [String],
  },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
