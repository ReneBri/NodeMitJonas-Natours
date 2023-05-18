const fs = require('fs');

const mongoose = require('mongoose');

const dotenv = require('dotenv');

const Tour = require('../../models/tourModel');

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

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('successful');
    } catch (err) {
        console.log(err.message);
    }
};

const deleteAllDataFromCollection = async () => {
    try {
        await Tour.deleteMany();
        console.log('deletion successful');
    } catch (err) {
        console.log(err.message);
    }
};

if (process.argv[2] === '--import') {
    importData();
}
if (process.argv[2] === '--delete') {
    deleteAllDataFromCollection();
}
console.log(process.argv);
process.exit();
