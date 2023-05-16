const Tour = require('./../models/tourModel');

// tour route functions/controllers

// let tours = [];

// Tour.find({}).then(results => {
//     tours = results;
// });

exports.getAllTours = async (req, res) => {
    try {
        const tours = await Tour.find({});
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
                data: foundTour
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

    // const tour = tours.find(tour => tour.id === id);
    // if (tour) {
    //     r
    // } else {
    //     res.status(404).json({
    //         status: 'failed',
    //         message: 'Sorry, this doesnt exist.'
    //     });
    // }
};

exports.updateTour = (req, res) => {
    const id = +req.params.id;
    res.status(200).json({
        message: 'success',
        data: {
            tour: 'this is the updated tour'
        }
    });
};

exports.deleteTour = (req, res) => {
    const id = +req.params.id;
    // 204 is the normal delete status code
    res.status(204).json({
        message: 'success',
        data: null
    });
};
