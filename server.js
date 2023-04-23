const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const port = process.env.PORT || 3001;

app.listen(process.env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`App now listening on port ${port}`);
});
