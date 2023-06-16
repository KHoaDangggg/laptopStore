import Product from '../models/productModel.mjs';
import catchAsync from '../ultils/catchAsync.mjs';
import appError from '../ultils/appError.mjs';
import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
} from './handleFactory.mjs';

const getProduct = getOne(Product);
const getAllProducts = getAll(Product);
const createProduct = createOne(Product);
const updateProduct = updateOne(Product);
const deleteProduct = deleteOne(Product);

const topSellerProduct = catchAsync(async (req, res, next) => {
    req.query.page = '1';
    req.query.limit = '5';
    req.query.sort = '-ratingAvg, price';
    next();
});

export {
    getProduct,
    getAllProducts,
    createProduct,
    deleteProduct,
    updateProduct,
    topSellerProduct,
};
