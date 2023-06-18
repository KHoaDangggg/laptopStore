import Product from '../models/productModel.mjs';
import catchAsync from '../ultils/catchAsync.mjs';
import appError from '../ultils/appError.mjs';
import Store from '../models/storeModel.mjs';
import apiFeatures from '../ultils/APIFeatures.mjs';
const getOverview = catchAsync(async (req, res) => {
    //EXECUTE QUERY
    if (!req.query.limit) req.query.limit = 16;
    const features = new apiFeatures(Product.find(), req.query)
        .filter()
        .sort()
        .limit()
        .paginate();
    const laptops = await features.query;
    const stores = await Store.find({});
    const pageCurrent = req.query.page || 1;
    res.status(200).render('overview', {
        title: 'Laptop An Phát 2023 Ưu đãi ngập tràn',
        laptops,
        pageCurrent,
        req,
        stores,
    });
});
const getProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) next(new appError('There is no product with that name', 404));

    res.status(200).render('product', {
        title: product.name,
        product,
    });
});
const getLoginForm = (req, res) => {
    res.status(200).render('login', {
        title: 'Login to your acount',
    });
};
const getSignupForm = (req, res) => {
    res.status(200).render('signup', {
        title: 'Create your acount',
    });
};
const changePassword = (req, res) => {
    res.status(200).render('changePassword', {
        title: 'My acount',
    });
};
const getMyCart = catchAsync(async (req, res) => {
    let products;
    if (req.user) {
        const itemIds = req.user.items;
        const itemPromises = itemIds.map((id) => Product.findById(id));
        products = await Promise.all(itemPromises);
    } else {
        products = null;
    }
    res.status(200).render('cart', {
        title: 'My cart',
        products,
    });
});
export {
    getOverview,
    getProduct,
    getLoginForm,
    changePassword,
    getSignupForm,
    getMyCart,
};
