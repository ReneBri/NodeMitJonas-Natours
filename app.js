// it is convention to keep all the Express files inside an app.js.
const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// FIRST MIDDLEWARES

app.use(morgan('dev'));

// this is middleware. It adds the request body to the request. Apparently, that isnt a normal part of Express
// its basically us running a method on the request that converts it to (or from?) json.
app.use(express.json());

// doing this Express knows that we are defining a middleware here.
// using app.use() makes it apply to each and every single request. That is because we didn'y supply any route.
// kind of like if we did app.get+post+patch+delete('*', () => {})
app.use((req, res, next) => {
    // console.log('Hello from the middleware')
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next()
});

// we do this outside of the main get request for some reason
// JSON.parse converts a json file into an array of JS objects.
let tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// ROUTE HANDLERS

const getAllTours = (req, res) => {
    // this is the JSend standard of sending a response.
    // the results part however, is not part of that standard.
    res.status(200).json({
        status: 'success',
        results: tours.length,
        tours
    });
};

const createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = {
        id: newId,
        ...req.body
    }
    tours.push(newTour);
    // we use status code 201 because we created something new on the server.
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        if(err) return console.log(err.message);
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    });
};

const getTour = (req, res) => {
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

const updateTour = (req, res) => {
    const id = +req.params.id;
    res.status(200).json({
        message: 'success',
        data: {
            tour: 'this is the updated tour'
        }
    });
};

const deleteTour = (req, res) => {
    const id = +req.params.id;
    // 204 is the normal delete status code
    res.status(204).json({
        message: 'success',
        data: null
    });
};

// this here code just sends all of the tours we have in the simple-tours.json file we have
// app.get('/api/v1/tours', getAllTours);

// this here code adds a new tour to our simple-tours.json file
// app.post('/api/v1/tours', createTour);

// responding to URL parameters dynamically
// adding a question mark to a parameter makes it optional ('/api/v1/tours/:id/:user?'). In this case the user param is optionsl.
// app.get('/api/v1/tours/:id', getTour);

// patch requests to update data
// app.patch('/api/v1/tours/:id', updateTour);

// delete requests
// app.delete('/api/v1/tours/:id', deleteTour);


// ROUTES

app
  .route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);


// START SERVER

const port = 3000;
app.listen(port, () => {
    console.log(`App now listening on port ${port}`);
});

