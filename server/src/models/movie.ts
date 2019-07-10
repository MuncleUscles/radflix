import mongoose from 'mongoose'

export type MovieModel = mongoose.Document & {
    tokenUri: string,
    name: string,
    description: string,
    posterUrl: string,
    price: number,
    contentUrl: string,
};

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

const Movie = mongoose.model<MovieModel>('Movie', movieSchema);

export default Movie;