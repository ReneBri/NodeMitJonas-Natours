const fs = require('fs');

// tour route functions/controllers

// we do this outside of the main get request for some reason
// JSON.parse converts a json file into an array of JS objects.
let tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.checkId = (req, res, next, value) => {
    if(+value > tours.length){
        return res.status(404).json({
            status: 'fail',
            message: 'could not find resource'
        });
    };
    next();
};

exports.checkBody = (req, res, next) => {
    const { body } = req;
    if (!body.name || body.name.length < 1){
        return res.status(400).json({
            status: 'fail',
            message: 'Please provide a details for the name field.'
        });
    } else if (!body.price || body.price.length < 1){
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
    const newId = tours[tours.length - 1].id + 1;
    const newTour = {
        id: newId,
        ...req.body
    }
    tours.push(newTour);
    // we use status code 201 because we created something new on the server.
    fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        if(err) return console.log(err.message);
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    });
};

exports.getTour = (req, res) => {
    const id = +req.params.id;
    const tour = tours.find(tour => tour.id === id);
    if(tour){
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    }else{
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