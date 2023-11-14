const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");
const DetailService = require("../services/chitietdathang.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  if (!req.body?.SoDonDH) {
    return next(new ApiError(400, "Số đơn đặt hàng là trường bắt buộc"));
  }

  try {
    const detailService = new DetailService(MongoDB.client);
    const document = await detailService.create(req.body);
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while creating a Detail")
    );
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const detailService = new DetailService(MongoDB.client);
    const document = await detailService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Detail not found"));
    }
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Error retrieving Detail with id=${req.params.id} `)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can't be empty"));
  }

  try {
    const detailService = new DetailService(MongoDB.client);
    const document = await detailService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Detail not found"));
    }
    return res.send({ message: "Detail was updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating Detail with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const detailService = new DetailService(MongoDB.client);
    const document = await detailService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Detail not found"));
    }
    return res.send({ message: "Detail was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error deleting Detail with id=${req.params.id}`)
    );
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const detailService = new DetailService(MongoDB.client);
    const { SoDonDH } = req.query;

    if (SoDonDH) {
      documents = await detailService.findBySoDonDH(SoDonDH);
    } else {
      documents = await detailService.find({});
    }
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while retrieving Details")
    );
  }

  return res.send(documents);
};
