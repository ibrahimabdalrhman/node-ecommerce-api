const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }

    // Trigger "remove" event when update document
    document.remove().exec();
    res.status(204).send();
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!doc) {
      return next(new ApiError(" not found", 404));
    }
    await doc.save();
    res.status(200).json({
      msg: doc,
    });
  });

exports.insertOne = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json({ data: doc });
  });

exports.getOne = (Model, populationOptions) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);
    if (populationOptions) {
      query = query.populate(populationOptions);
    }
    const doc = await query;
    if (!doc) {
      return next(new ApiError(" not found", 404));
    }
    res.status(200).json({
      data: doc,
    });
  });

exports.getAll = (Model, modename = '') =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    const page = req.query.page || 1;
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate()
      .sort()
      .search(modename)
      .filter()
      .fields();

    const doc = await apiFeatures.mongooseQuery;
    res.status(200).json({
      results: doc.length,
      page: page,
      data: doc,
    });
  });