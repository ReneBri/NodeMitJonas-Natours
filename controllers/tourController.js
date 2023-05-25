const Tour = require('./../models/tourModel');

const APIFeatures = require('../utility/apiFeatures');

// tour route functions/controllers

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = 'price,-ratingAverage';
    req.query.fields = 'name,price,ratingAverage,difficulty';
    next();
};

exports.getAllTours = async (req, res) => {
    try {
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .pagination();
        const tours = await features.query;
        // this is the JSend standard of sending a response.
        // the results part however, is not part of that standard.
        res.status(200).json({
            status: 'success',
            results: tours.length,
            tours
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.createTour = async (req, res) => {
    // const { body } = req;
    try {
        const savedTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                tour: savedTour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: `Failed to save - ${err.message}`
        });
    }
};

exports.getTour = async (req, res) => {
    const { id } = req.params;
    try {
        const foundTour = await Tour.findById(id);
        if (foundTour) {
            res.status(200).json({
                status: 'success',
                data: {
                    tour: foundTour
                }
            });
        } else {
            throw new Error('No data found');
        }
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err.message
        });
    }
};

exports.updateTour = async (req, res) => {
    const { id } = req.params;
    const query = { _id: id };
    const update = req.body;
    try {
        const updatedTour = await Tour.findOneAndUpdate(query, update, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'success',
            data: {
                tour: updatedTour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.deleteTour = async (req, res) => {
    const { id } = req.params;
    try {
        await Tour.findByIdAndDelete(id);
        // 204 is the normal delete status code
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingAverage: { $gte: 4 } }
            },
            {
                $group: {
                    _id: '$difficulty',
                    numOfTours: { $sum: 1 },
                    numOfRatings: { $sum: '$ratingQuantity' },
                    averageRating: { $avg: '$ratingAverage' },
                    averagePrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            {
                $sort: {
                    averagePrice: -1
                }
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.getMonthlyPlan = async (req, res) => {
    const year = +req.params.year;
    try {
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDate'
            },
            {
                $match: {
                    startDate: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDate' },
                    totalAmountOfTours: { $sum: 1 },
                    tours: { $push: '$name' }
                }
            },
            {
                $addFields: {
                    month: '$_id'
                }
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: {
                    totalAmountOfTours: -1
                }
            },
            {
                $limit: 12
            }
        ]);
        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
};
