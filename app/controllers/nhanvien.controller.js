const ApiError = require("../api-error");
const EmployeeService = require("../services/nhanvien.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  if (!req.body?.name) {
    return next(new ApiError(400, "Name is a required field"));
  }
  try {
    const employeeService = new EmployeeService(MongoDB.client);
    const document = await employeeService.create(req.body);
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while creating an employee"));
  }
};

exports.findEmployeeById = async (req, res, next) => {
  try {
    const employeeService = new EmployeeService(MongoDB.client);
    const document = await employeeService.findEmployeeById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Employee not found"));
    }
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Error retrieving employee with id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can't be empty"));
  }
  try {
    const employeeService = new EmployeeService(MongoDB.client);
    const document = await employeeService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Employee not found"));
    }
    return res.send({ message: "Employee was updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating employee with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const employeeService = new EmployeeService(MongoDB.client);
    const document = await employeeService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Employee not found"));
    }
    return res.send({ message: "Employee was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error deleting employee with id=${req.params.id}`)
    );
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const employeeService = new EmployeeService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await employeeService.findByName(name);
    } else {
      documents = await employeeService.find({});
    }
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while retrieving employees")
    );
  }
  return res.send(documents);
};

exports.deleteAll = async (req, res, next) => {
  try {
    const employeeService = new EmployeeService(MongoDB.client);
    const deletedCount = await employeeService.deleteAll();
    return res.send({
      message: `${deletedCount} employees were deleted successfully`,
    });
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while removing all employees")
    );
  }
};

