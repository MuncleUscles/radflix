import mongoose from 'mongoose'

const movieSchema = new mongoose.Schema({
    tokenUri: {
        type: String,
        unique: true,
    },
    name: String,
    description: String,
    posterUrl: String,
    price: Number,
    contentUrl: String,
});

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;