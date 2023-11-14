const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");
const ProductService = require("../services/hanghoa.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  if (!req.body?.TenHH) {
    return next(new ApiError(400, "Tên hàng hóa là trường bắt buộc"));
  }

  try {
    const productService = new ProductService(MongoDB.client);
    const document = await productService.create(req.body);
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while creating a product")
    );
  }
};
exports.findOne = async (req, res, next) => {
  try {
    const productService = new ProductService(MongoDB.client);
    const document = await productService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "product not found"));
    }
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Error retrieving contact with id=${req.params.id} `)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can't be empty"));
  }

  try {
    const productService = new ProductService(MongoDB.client);
    const document = await productService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Product not found"));
    }
    return res.send({ message: "Product was updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating product with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const productService = new ProductService(MongoDB.client);
    const document = await productService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Product not found"));
    }
    return res.send({ message: "Product was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error deleting product with id=${req.params.id}`)
    );
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const productService = new ProductService(MongoDB.client);
    const { TenHH } = req.query;

    if (TenHH) {
      documents = await productService.findByTenHH(TenHH);
    } else {
      documents = await productService.find({});
    }
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while retrieving products")
    );
  }

  return res.send(documents);
};


