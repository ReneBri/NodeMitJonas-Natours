const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const dbConfig = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
);

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

const app = require('./app');

const port = process.env.NODE_ENV === 'development' ? process.env.PORT : 3001;

app.listen(process.env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`App now listening on port ${port}`);
});
