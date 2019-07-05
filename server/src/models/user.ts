import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
    },
    isAuthorized: {
        type: Boolean,
    }
});

const User = mongoose.model('User', userSchema);

export default User;