import mongoose from 'mongoose'

const purchaseSchema = new mongoose.Schema({
    aid: String,
});

const Purchase = mongoose.model('purchase', purchaseSchema);

export default Purchase;