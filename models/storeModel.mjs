import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    hotline: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        enum: ['Hanoi', 'Ho Chi Minh City', 'Da Nang'],
        required: true,
    },
});

storeSchema.index({ location: '2dsphere' });

const Store = mongoose.model('Store', storeSchema);

export default Store;
