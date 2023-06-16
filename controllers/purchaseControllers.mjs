import User from '../models/userModel.mjs';
import catchAsync from '../ultils/catchAsync.mjs';
import { updateOne, getAll, getOne } from './handleFactory.mjs';

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
export { purchaseItem, deletePurchase };
