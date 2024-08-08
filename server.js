/* eslint-disable no-console */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//!Uncaught exceptions (synchronous code)
process.on('uncaughtException', (err) => {
  console.log('Unhandled exception 💥 Shutting down....');
  console.log(err);
  process.exit(1);
});
dotenv.config({ path: './config.env' });
const app = require('./app');

//!Database connection
const DB = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD);
mongoose.connect(DB).then(() => console.log('DB connection successful ✅'));

//!Server initializing
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}.... ✅`);
});

//!Asynchronous unhandled rejections
process.on('unhandledRejection', (err) => {
  console.log('Unhandled rejection 💥 Shutting down....');
  console.log(err);
  server.close(() => process.exit(1));
});
