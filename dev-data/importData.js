const mongoose = require('mongoose');
const fs = require('fs');
const User = require('../models/userModel');

mongoose
  .connect(
    'mongodb+srv://omarsaleh12216:deadman3@cluster0.57enkiv.mongodb.net/natours?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
  )
  .then(() => console.log('DB connection successful 😶‍🌫️'));
//! read json file
//! import data into db
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`));
// console.log(reviews);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`));
// console.log(users);

const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    process.exit(1);
  } catch (e) {
    console.log(e);
  }
};
//! delete all data from db

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    process.exit(1);
  } catch (e) {
    console.log(e);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
} else {
  console.log(
    'Invalid command. Use --import to import data or --delete to delete data.',
  );
  process.exit(1);
}
