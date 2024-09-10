/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable no-console */
const AppError = require('../utils/AppError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400, true);
};
const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate field value: ${value} . Please use another value!`;
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
  if (!err.render && err.isOperational)
    //Operational errors like 404s etc
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  else if (err.render && err.isOperational)
    res.status(err.statusCode).render('errorPage', {
      title: 'Error',
      status: err.status,
      message: err.message,
    });
  else
    res.status(404).render('errorPage', {
      title: 'Error',
      message: 'Something went wrong! 💥',
    }); //! !render and !operational
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
