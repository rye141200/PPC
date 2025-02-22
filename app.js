const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const path = require('path'); // Add this line to import the 'path' module
const cookieParser = require('cookie-parser');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const orderRouter = require('./routes/orderRoutes');
const viewRouter = require('./routes/viewRoutes');
const orderController = require('./controllers/orderController');
const cartRouter = require('./routes/cartRoutes');
const categoryRouter = require('./routes/categoryRoutes');

const app = express();

//!1) Global middlewares
app.use(cookieParser());
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//? Limit requests from same API
const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/', limiter); //!edit this later

app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

//? Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());

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
app.post('/moyasar-webhook', orderController.moyasarWebhook);

app.use('/user', userRouter);
app.use('/product', productRouter);
app.use('/order', orderRouter);
app.use('/category', categoryRouter);
app.use('/cart', cartRouter);
app.use('/', viewRouter);

app.all('*', (req, res, next) => {
  next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404, true),
  );
});
app.use(globalErrorHandler);

module.exports = app;
