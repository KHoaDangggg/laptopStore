import catchAsync from '../ultils/catchAsync.mjs';
import appError from '../ultils/appError.mjs';
import User from '../models/userModel.mjs';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import crypto from 'crypto';
const createToken = (id) => {
    return jwt.sign({ id }, process.env.PRIVATE_KEY, {
        expiresIn: '7d',
    });
};
const sendToken = (user, req, res) => {
    const token = createToken(user._id);
    res.cookie('jwt', token, {
        //httpOnly: true,
        expires: new Date(
            Date.now() + process.env.COOKIE_JWT_EXPIRE_IN * 24 * 3600 * 1000
        ),
        // secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    });
    res.status(201).json({
        status: 'success',
        user,
        token,
    });
};
const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    const check = await user.correctPassword(password, user.password);
    if (!check || !user)
        return next(new appError('Can not find user with that email', 404));
    sendToken(user, req, res);
});
const signup = catchAsync(async (req, res, next) => {
    const { name, password, email, passwordConfirm } = req.body;
    const newUser = await User.create({
        name,
        email,
        password,
        passwordConfirm,
        passwordChangeAt: new Date(Date.now()),
    });
    sendToken(newUser, req, res);
});
const logout = catchAsync(async (req, res, next) => {
    res.cookie('jwt', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now() + 10 * 1000),
    });
    res.status(200).json({
        status: 'success',
    });
});
const protect = catchAsync(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) return next(new appError('you are not allowed to access', 404));
    const payload = await promisify(jwt.verify)(token, process.env.PRIVATE_KEY);
    const user = await User.findById(payload.id);
    if (!user) {
        return next(
            new appError(
                'The user belonging to this token does no longer exist'
            ),
            401
        );
    }
    const decoded = await promisify(jwt.verify)(token, process.env.PRIVATE_KEY);
    if (user.changedPassAfter(decoded.iat)) {
        return next(
            new appError(
                "User's password has recently changed. Please log in again to get access"
            ),
            401
        );
    }
    req.user = user;
    res.locals.user = user;
    next();
});
const forgotPassword = catchAsync(async (req, res, next) => {
    //1.Check if user exist
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new appError('User does not exist'), 401);
    }
    //2. Generate the random reset token
    const resetToken = user.createResetPassToken();
    await user.save({ validateBeforeSave: false });
    //3. Send token to user's email
    //     try {
    //         const resetURL = `${req.protocol}://${req.get(
    //             'host'
    //         )}/api/users/resetPassword/${resetToken}`;
    //         await new Email(user, resetURL).sendPasswordReset();
    //         res.status(200).json({
    //             status: 'Success',
    //             message: 'Token was sent to email successfully',
    //         });
    //     } catch (err) {
    //         user.passwordResetToken = undefined;
    //         user.passwordResetExpires = undefined;
    //         await user.save({ validateBeforeSave: false });
    //     }
});

const resetPassword = catchAsync(async (req, res, next) => {
    //1. Get user based on token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    //2. If token is not expired and user exists, set new password
    if (!user) {
        return next(new appError('Token is in valid or expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    //3. Update changedPasswordAt

    //4. Log user in with JWT
    createSendToken(user, req, res);
});
const updatePassword = catchAsync(async (req, res, next) => {
    //1. Get user from collection
    const user = await User.findById(req.user._id).select('+password');
    //2. Check if POSTED password is correct
    const correct = await user.correctPassword(
        req.body.passwordCurrent,
        user.password
    );
    if (!correct) {
        return next(new appError('Your current password is wrong', 401));
    }
    //3. If correct, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    //4. Log user in, send JWT
    sendToken(user, req, res);
});
const isLoggedIn = async (req, res, next) => {
    try {
        if (req.cookies.jwt) {
            //2. Verify token
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.PRIVATE_KEY
            );

            //3. Check if user still exist
            const freshUser = await User.findById(decoded.id);
            if (!freshUser) {
                res.locals.user = null;
                return next();
            }
            //4. Check if users changed password after token was created
            if (freshUser.changedPassAfter(decoded.iat)) {
                res.locals.user = null;
                return next();
            }
            //5. User is logged
            res.locals.user = freshUser;
            req.user = freshUser;
            return next();
        }
        res.locals.user = null;
        next();
    } catch (error) {
        console.log(error);
        res.locals.user = null;
        return next();
    }
};
export {
    login,
    logout,
    signup,
    resetPassword,
    forgotPassword,
    protect,
    updatePassword,
    isLoggedIn,
};
