import catchAsync from '../ultils/catchAsync.mjs';
import appError from '../ultils/appError.mjs';
import apiFeatures from '../ultils/APIFeatures.mjs';
const deleteOne = (model) =>
    catchAsync(async (req, res, next) => {
        const doc = await model.findByIdAndDelete(req.params.id);
        if (!doc) {
            return next(
                new appError('Can not find document with this ID', 404)
            );
        }
        res.status(200).end();
    });
const updateOne = (model) =>
    catchAsync(async (req, res, next) => {
        const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!doc) {
            return next(
                new appError('Can not find document with this ID', 404)
            );
        }
        res.status(201).json({
            status: 'success',
            data: {
                doc,
            },
        });
    });
const createOne = (model) =>
    catchAsync(async (req, res, next) => {
        const doc = await model.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                doc,
            },
        });
    });
const getOne = (model, populateOptions) =>
    catchAsync(async (req, res, next) => {
        let query = model.findById(req.params.id);
        if (populateOptions) query = query.populate(populateOptions);
        const doc = await query;
        if (!doc) {
            return next(
                new appError('Can not find document with this ID', 404)
            );
        }
        res.status(200).json({
            status: 'success',
            data: doc,
        });
    });
const getAll = (model) =>
    catchAsync(async (req, res, next) => {
        //Filter for nested get reviews from tour
        let filter = {};
        //EXECUTE QUERY
        const features = new apiFeatures(model.find(filter), req.query)
            .filter()
            .sort()
            .limit()
            .paginate();
        const doc = await features.query;
        //SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: {
                doc,
            },
        });
    });
export { deleteOne, updateOne, createOne, getOne, getAll };
