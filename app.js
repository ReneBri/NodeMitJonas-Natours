// it is convention to keep all the Express files inside an app.js.
const fs = require('fs');
const express = require('express');

const app = express();

// this is middleware. It adds the request body to the request. Apparently, that isnt a normal part of Express
app.use(express.json());

// we do this outside of the main get request for some reason
// JSON.parse converts a json file into an array of JS objects.
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

app.get('/api/v1/tours', async (req, res) => {
    
    // this is the JSend standard of sending a response.
    // the reults part however, is not part of that standard.
    res.status(200).json({
        status: 'success',
        results: tours.length,
        tours
    });
    
});


app.post('/api/v1/tours', (req, res) => {
    // console.log(req.body);
    const newId = tours[tours.length - 1].id + 1;
    const newTour = {
        id: newId,
        ...req.body
    }
    tours.push(newTour);
    console.log(tours);
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
    
});


const port = 3000;
app.listen(port, () => {
    console.log(`App now listening on port ${port}`);
});

