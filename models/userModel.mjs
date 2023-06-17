import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Please tell us your name'],
    },
    email: {
        type: String,
        required: [true, 'Provide your email'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Please provide a password'],
        minlength: 4,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            //ONLY WORKS ON CREATE AND SAVE
            validator: function (ele) {
                return ele === this.password;
            },
            message: 'Password and confirm password are not the same',
        },
    },
    passwordChangedAt: {
        type: Date,
        default: Date.now(),
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetExpires: {
        type: Date,
    },
    items: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Laptop',
        },
    ],
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    this.passwordChangedAt = Date.now() - 1000;
    next();
});
userSchema.methods.correctPassword = async function (candidatePass, userPass) {
    return await bcrypt.compare(candidatePass, userPass);
};
userSchema.methods.changedPassAfter = function (JWTTimeStamp) {
    const passChangedAt = parseInt(this.passwordChangedAt.getTime() / 1000);
    if (passChangedAt) {
        return passChangedAt > JWTTimeStamp;
    }
    return false;
};
userSchema.methods.createResetPassToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60000;

    return resetToken;
};
const User = mongoose.model('User', userSchema);

export default User;
