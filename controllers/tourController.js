const Tour = require('./../models/tourModel');

// tour route functions/controllers

exports.getAllTours = async (req, res) => {
    try {
        // FILTERING
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        // We use the object[el] here instead of object.el here because
        // because object.el with look for a field called 'el'
        // object[el] will first evaluate the variable el and then use
        // whatever the value of that variable is.
        excludedFields.forEach(el => delete queryObj[el]);

        // ADVANCED FILTERING
        let queryStr = JSON.stringify(queryObj);

        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            match => `$${match}`
        );

        const newQueryObj = JSON.parse(queryStr);

        // We do not await here, becuase that will mess with our sorting etc.
        // because if we use 'await' then the function is automatically executed
        // but here we are just assigning it the value, rather than executing it.
        let query = Tour.find(newQueryObj);

        // SORTING
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('difficulty');
        }

        // PROJECTING
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v -_id');
        }

        // PAGINATION
        // this || here is apparently a way of setting a default value?
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const numOfTours = await Tour.countDocuments(newQueryObj);
            console.log(numOfTours);
            if (skip >= numOfTours) {
                throw new Error('Page does not exist');
            }
        }

        // Instead we await here
        const tours = await query;
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
