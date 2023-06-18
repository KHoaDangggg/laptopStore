import User from '../models/userModel.mjs';
import Product from '../models/productModel.mjs';
import catchAsync from '../ultils/catchAsync.mjs';
import { updateOne, getAll, getOne } from './handleFactory.mjs';
import Stripe from 'stripe';

const purchaseItem = catchAsync(async (req, res, next) => {
    const { userId, itemId } = req.body;
    const user = await User.findById(userId).select('+items');
    if (!user.items.includes(itemId)) {
        user.items.push(itemId);
        await user.save({ validateBeforeSave: false });
    }
    res.status(200).json({
        status: 'success',
    });
});
const deletePurchase = catchAsync(async (req, res, next) => {
    const { userId, itemId } = req.body;
    const user = await User.findById(userId).select('+items');
    if (user.items.includes(itemId)) {
        const indexToRemove = user.items.indexOf(itemId);
        if (indexToRemove !== -1) {
            user.items.splice(indexToRemove, 1);
        }
        await user.save({ validateBeforeSave: false });
    }
    res.status(200).json({
        status: 'success',
    });
});
const stripe = new Stripe(
    'sk_test_51MpCA0DfcEM9cIAm0SlXbB7WjZpXe7HEwSwCAjde0FZoLndTIYUnHJsp5F5HEcyEUpCy9zJiU2OIIFRf2t5KNnXx00PnlNRkfx'
);
const checkOutSession = catchAsync(async (req, res) => {
    const price = req.params.total;
    //2. Create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/`,
        cancel_url: `${req.protocol}://${req.get('host')}/mycart`,
        line_items: [
            {
                price_data: {
                    currency: 'vnd',
                    unit_amount: price,
                    product_data: {
                        name: `Thanh toán giỏ hàng`,

                        images: [
                            `${req.protocol}://${req.get('host')}/purchase.jpg`,
                        ],
                    },
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
    });
    //3. Create session as response
    res.status(201).json({
        status: 'success',
        session,
    });
});

export { checkOutSession, purchaseItem, deletePurchase };
