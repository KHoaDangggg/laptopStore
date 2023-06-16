import mongoose, { Schema } from 'mongoose';
import slugify from 'slugify';
const laptopSchema = new Schema({
    name_model: {
        type: String,
        required: true,
    },
    image: [
        {
            type: String,
            required: true,
        },
    ],
    new_price: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discount_percentage: {
        type: Number,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    display: {
        size: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        brightness: {
            type: Number,
            required: true,
        },
    },
    cpu: {
        type: String,
        required: true,
    },
    cpu_type: {
        type: String,
        required: true,
    },
    gpu: {
        name: {
            type: String,
            required: true,
        },
        onboard: {
            type: Boolean,
            required: true,
        },
    },
    ram: {
        type: Number,
        required: true,
    },
    ssd: {
        type: Number,
        required: true,
    },
    hdd: {
        type: String,
        required: false,
    },
    operating_system: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    battery: {
        type: String,
        required: true,
    },
    camera: {
        type: String,
        required: true,
    },
    ports: [
        {
            name: {
                type: String,
                required: true,
            },
            type: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    rating: {
        average: {
            type: Number,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
    },
    available: {
        type: Boolean,
        required: true,
    },
    sold: {
        type: Number,
        required: true,
    },
    manufacturer: {
        type: String,
        required: true,
    },
    manufacturer_year: {
        type: Number,
        required: true,
    },
    material: {
        type: String,
        required: true,
    },
    stores: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Store',
        },
    ],
    slug: {
        type: String,
    },
});

laptopSchema.pre('save', function (next) {
    this.slug = slugify(this.name_model, { lower: true });
    next();
});

const Laptop = mongoose.model('Laptop', laptopSchema);
export default Laptop;
