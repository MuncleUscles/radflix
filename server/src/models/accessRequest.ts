import mongoose from 'mongoose'

const accessRequest = new mongoose.Schema({
    id: String,
    consumed: Boolean,
});

const AccessRequest = mongoose.model('AccessRequest', accessRequest);

export default AccessRequest;