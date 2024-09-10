const dotenv = require('dotenv');
const mongoose = require('mongoose');
//const fs = require('fs');
//const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD);
mongoose.connect(DB).then(() => console.log('DB connection successful 😶‍🌫️'));
//! read json file
//! import data into db

const importData = async () => {
  try {
    //! Import here
    process.exit(1);
  } catch (e) {
    console.log(e);
  }
};
//! delete all data from db

const deleteData = async () => {
  try {
    await Order.deleteMany();
    await Cart.deleteMany();
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
