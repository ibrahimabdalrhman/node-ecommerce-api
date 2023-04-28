const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const compression = require("compression");
dotenv.config({ path: 'config.env' });
const dbConnection = require('./config/database');
const ApiError = require("./utils/apiError");
const errorMiddleware = require('./middlewares/errorMiddleware');
require('mongoose').set('strictQuery', false);

const app = express();
dbConnection();
app.use(express.json());

//enable others domans to access your api
app.use(cors());
app.options("*", cors());

//compress all responses
app.use(compression());

app.use(express.static(path.join(__dirname, 'uploads')));
console.log("mode : ", process.env.NODE_ENV);

//routes
const mountRoute = require('./routes');
mountRoute(app);

//404 error if not found page
app.all('*', (req,res,next) => {
    next(new ApiError("can't find this page",404));
});

//Global error middleware
app.use(errorMiddleware);

//Running Server
const port=process.env.PORT || 3000
const server = app.listen(port, () => {
    console.log(`Server Running on port ${port} ...`);
});

//handle rejection errors outside  express
process.on('unhandledRejection', (err) => {
    console.error(`unhandledRejection : ${  err.name  } | ${  err.message}`);
    server.close(() => {
        console.error("shutting down ... ");
        process.exit(1);
    });
});