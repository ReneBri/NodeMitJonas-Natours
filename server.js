const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const dbConfig = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
);

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name.'],
        unique: true
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price.']
    },
    rating: {
        type: Number,
        default: 4.5
    }
});

const Tour = mongoose.model('Tours', tourSchema);

const newTour = new Tour({
    name: "Big Ol' Hike12",
    price: 123,
    rating: 4.2
});

mongoose
    .connect(dbConfig, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(connection => {
        console.log('db connected');
    });

newTour
    .save()
    .then(doc => console.log(doc))
    .catch(err => console.log(err.message));
// we will add error handling here later

const app = require('./app');

const port = process.env.NODE_ENV === 'development' ? process.env.PORT : 3001;

app.listen(process.env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`App now listening on port ${port}`);
});
