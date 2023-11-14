const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");
const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  if (!req.body?.name) {
    return next(new ApiError(400, "Name  are required fields"));
  }
  try {
    const userService = new UserService(MongoDB.client);
    const document = await userService.create(req.body);
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while creating a user"));
  }
};

exports.findUserById = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const document = await userService.findUserById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "User not found"));
    }
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Error retrieving user with id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can't be empty"));
  }
  try {
    const userService = new UserService(MongoDB.client);
    const document = await userService.updateUser(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "User not found"));
    }
    return res.send({ message: "User was updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating user with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const document = await userService.deleteUser(req.params.id);
    if (!document) {
      return next(new ApiError(404, "User not found"));
    }
    return res.send({ message: "User was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error deleting user with id=${req.params.id}`)
    );
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const userService = new UserService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await userService.findByName(name);
    } else {
      documents = await userService.find({});
    }
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while retrieving contacts")
    );
  }
  return res.send(documents);
};

exports.deleteAll = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const deletedCount = await userService.deleteAll();
    return res.send({
      message: `${deletedCount} users was deleted successfully`,
    });
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while removing all users")
    );
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email và mật khẩu là trường bắt buộc' });
  }

  try {
    const userService = new UserService(MongoDB.client);
    const  user  = await userService.login(email, password);
    

    if (user) {
      res.status(200).json({ message: 'Đăng nhập thành công', user :  user  });
    } else {
      res.status(401).json({ message: 'Đăng nhập thất bại' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

exports.logout = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email là trường bắt buộc' });
  }

  try {
    const userService = new UserService(MongoDB.client);
    await userService.logout(email);
    res.status(200).json({ message: 'Đăng xuất thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};



