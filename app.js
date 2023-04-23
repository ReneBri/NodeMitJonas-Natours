// it is convention to keep all the Express files inside an app.js.

const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

const app = express();
// FIRST MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// this is middleware. It adds the request body to the request. Apparently, that isnt a normal part of Express
// its basically us running a method on the request that converts it to (or from?) json.
app.use(express.json());

// serving up static files
app.use(express.static(`${__dirname}/public`));

// doing this Express knows that we are defining a middleware here.
// using app.use() makes it apply to each and every single request. That is because we didn'y supply any route.
// kind of like if we did app.get+post+patch+delete('*', () => {})
app.use((req, res, next) => {
    // console.log('Hello from the middleware')
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// ROUTE HANDLERS

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// START SERVER

module.exports = app;
