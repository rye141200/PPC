const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(204).send({
      status: 'success',
      data: null,
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
    if (req.file) console.log(req.file);
    const doc = await Model.create(req.body);

    res.status(201).send({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOption, selectOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOption) query = query.populate(popOption);

    const doc = await query.populate({
      path: popOption,
      select: selectOptions,
    });

    /* another way to query is: 
    const existingTour = await Tour.findOne({ _id: req.params.id });*/
    if (!doc) return next(new AppError('No document Found with that ID', 404));

    res.status(200).send({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model, popOption, selectOptions) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on product (hack)
    let filter = {};
    if (req.params.ProductId) filter = { _id: req.params.ProductId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limit()
      .paginate();

    if (popOption && selectOptions)
      features.query.populate({ path: popOption, select: selectOptions });
    else if (popOption) features.query.populate(popOption);

    // const doc = await features.query.explain();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
