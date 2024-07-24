const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const orderRouter = require('./routes/orderRoutes');

const app = express();

//!1) Global middlewares
app.use(helmet());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//? Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/', limiter); //!edit this later

app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/public/`);
app.use(express.static(`${__dirname}/public/`));

//? Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// app.use(cors());
//? Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//? Data sanitization against XSS
app.use(xss());

//? Prevent parameter pollution
app.use(
  hpp({
    whitelist: [],
  }),
);

//!2) Routes
app.use('/user', userRouter);
app.use('/product', productRouter);
app.use('/order', orderRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
