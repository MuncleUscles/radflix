import mongoose from 'mongoose'

const movieSchema = new mongoose.Schema({
    tokenUri: {
        type: String,
        unique: true,
    },
    data: String,
});

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;