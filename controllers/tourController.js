const Tour = require('./../models/tourModel');

// tour route functions/controllers

let tours = [];

Tour.find({}).then(results => {
    tours = results;
});

exports.checkBody = (req, res, next) => {
    const { body } = req;
    if (!body.name || body.name.length < 1) {
        return res.status(400).json({
            status: 'fail',
            message: 'Please provide a details for the name field.'
        });
    }

    if (!body.price || body.price.length < 1) {
        return res.status(400).json({
            status: 'fail',
            message: 'Please provide a details for the price field.'
        });
    }
    next();
};

exports.getAllTours = (req, res) => {
    // this is the JSend standard of sending a response.
    // the results part however, is not part of that standard.
    res.status(200).json({
        status: 'success',
        results: tours.length,
        tours
    });
};

exports.createTour = (req, res) => {
    res.status(201).json({
        status: 'success'
        // data: {
        //     tour: newTour
        // }
    });
};

exports.getTour = (req, res) => {
    const id = +req.params.id;
    const tour = tours.find(tour => tour.id === id);
    if (tour) {
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } else {
        res.status(404).json({
            status: 'failed',
            message: 'Sorry, this doesnt exist.'
        });
    }
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
