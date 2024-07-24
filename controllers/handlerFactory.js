const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).send({
      status: 'success',
      message: 'document was deleted successfully',
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedDoc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).send({
      status: 'success',
      data: {
        data: updatedDoc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).send({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOption) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOption) query = query.populate(popOption);
    const doc = await query;
    /* another way to query is: 
    const existingTour = await Tour.findOne({ _id: req.params.id });*/
    if (!doc) {
      return next(new AppError('No tour Found with that ID', 404));
    }
    res.status(200).send({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //# to allow for nested GET reviews on Tour
    // eslint-disable-next-line prefer-const
    let filter = {};
    if (req.params.tourId) {
      filter.tour = req.params.tourId;
    }
    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query.populate('totalPrice');

    // SEND RESPONSE
    Model.calcAverageRatings;
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
