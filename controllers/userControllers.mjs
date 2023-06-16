import User from '../models/userModel.mjs';
import { updateOne, getAll, getOne } from './handleFactory.mjs';
const getAllUsers = getAll(User);
const getOneUser = getOne(User);
const updateUser = updateOne(User);
const getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};
export { getAllUsers, getMe, updateUser, getOneUser };
