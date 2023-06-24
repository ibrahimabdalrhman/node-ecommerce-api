const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const compression = require("compression");
dotenv.config({ path: 'config.env' });
const rateLimit = require("express-rate-limit");
const hpp = require('hpp');
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const dbConnection = require('./config/database');
const ApiError = require("./utils/apiError");
const errorMiddleware = require('./middlewares/errorMiddleware');
require('mongoose').set('strictQuery', false);
const { webhookCheckout } = require('./services/orderService');

const app = express();
dbConnection();
app.use(express.json({ limit: '20kb' }));

app.use(mongoSanitize());


//enable others domans to access your api
app.use(cors());
app.options("*", cors());

//compress all responses
app.use(compression());

app.use(xss());

//Check Webhoob
app.post(
    "/webhook-checkout",
    webhookCheckout
);

app.use(express.static(path.join(__dirname, 'uploads')));
console.log("mode : ", process.env.NODE_ENV);

//routes
const mountRoute = require('./routes');
const { log } = require('console');
mountRoute(app);

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message:
        "Too many accounts created from this IP, please try again after an hour",
});

// Apply the rate limiting middleware to API calls only
app.use("/api", apiLimiter);

app.use(
    hpp({
        whitelist: ["ratingsAverage", "ratingsQuantity", "quantity", 'sold', 'price'],
    })
); // <- THIS IS THE NEW LINE

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