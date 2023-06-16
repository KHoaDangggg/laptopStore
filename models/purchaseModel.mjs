import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'Purchase order must have a product'],
    },
    quantity: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Purchase order must belong to an user'],
    },
    price: {
        type: Number,
        required: [true, 'Purchase order must have a price'],
    },
    createAt: {
        type: Date,
        default: Date.now(),
    },
    paid: {
        type: Boolean,
        default: true,
    },
});

purchaseSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'product',
        select: 'name_model img price discount_percentage cpu gpu ram ssd',
    });
    next();
});
const purchase = mongoose.model('booking', purchaseSchema);
export default purchase;
