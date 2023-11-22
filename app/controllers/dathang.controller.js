const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");
const OrderService = require("../services/dathang.service"); 
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  if (!req.body?.MSKH || !req.body?.MSNV) {
    return next(new ApiError(400, "Số đơn đặt hàng là trường bắt buộc"));
  }

  try {
    const orderService = new OrderService(MongoDB.client);
    const document = await orderService.create(req.body);
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while creating an order"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const orderService = new OrderService(MongoDB.client); // Đổi tên service
    const document = await orderService.findById(req.params.id); // Đổi tên service và phương thức
    if (!document) {
      return next(new ApiError(404, "Order not found"));
    }
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Error retrieving order with id=${req.params.id} `)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can't be empty"));
  }

  try {
    const orderService = new OrderService(MongoDB.client); // Đổi tên service
    const document = await orderService.update(req.params.id, req.body); // Đổi tên service và phương thức
    if (!document) {
      return next(new ApiError(404, "Order not found"));
    }
    return res.send({ message: "Order was updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating order with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const orderService = new OrderService(MongoDB.client); // Đổi tên service
    const document = await orderService.delete(req.params.id); // Đổi tên service và phương thức
    if (!document) {
      return next(new ApiError(404, "Order not found"));
    }
    return res.send({ message: "Order was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error deleting order with id=${req.params.id}`)
    );
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const orderService = new OrderService(MongoDB.client);

    const documents = await orderService.findAllOrder();

    const result = await Promise.all(
      documents.map(async (doc) => {
        const user = await orderService.findCustomerId(doc.MSKH);
        const employee = await orderService.findEmployeeIdBy(doc.MSNV);

        return {
          ...doc,
          customerInfo: user,
          employeeInfo: employee,
        };
      })
    );

    return res.send(result);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while retrieving order items"));
  }
};
