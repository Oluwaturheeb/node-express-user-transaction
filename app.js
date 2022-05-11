import express from 'express';
import logger from 'morgan';

// import routes
import apiRouter from './routes/apiRoute.js';

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// register our api route
app.use('/api', apiRouter);
app.listen(process.env.PORT || 3000);