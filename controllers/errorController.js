/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable no-console */
const AppError = require('../utils/AppError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400, true);
};
const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue.name;
  const message = `${value} is already used! Please use another value!`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const validationErrors = Object.values(err.errors).map(
    (field) => field.message,
  );
  const message = `Invalid input data. ${validationErrors.join('. ')}`;
  return new AppError(message, 400);
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  const statusCodes = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
  };

  if (!err.render && err.isOperational)
    //Operational errors like 404s etc
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  else if (err.render && err.isOperational)
    res.status(err.statusCode).render('errorPage', {
      title: 'Error',
      statusCode: err.statusCode,
      header: statusCodes[err.statusCode],
      message: err.message,
    });
  else
    res.status(err.statusCode).render('errorPage', {
      statusCode: err.statusCode,
      title: 'Error',
      header: 'Server error!',
      message: 'Something went wrong! 💥',
    }); //! render and !operational
};

module.exports = (err, req, res, next) => {
  //console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') sendErrorDev(err, res);
  else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    sendErrorProd(error, res);
  }
};
