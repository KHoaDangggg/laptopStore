import express from 'express';
import { protect } from '../controllers/authiencationControllers.mjs';
import {
    deleteProduct,
    getAllProducts,
    getProduct,
    topSellerProduct,
    updateProduct,
} from '../controllers/productControllers.mjs';

const Router = express.Router();

Router.route('/').get(getAllProducts);
Router.route('/top-seller-product').get(topSellerProduct, getAllProducts);
Router.route('/:id').get(getProduct).patch(updateProduct).delete(deleteProduct);

export default Router;
