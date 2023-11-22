const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");
const CartService = require("../services/giohang.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  console.log("hi",req.body);
 
  if (!req.body?.IdHangHoa || !req.body?.SoLuong || !req.body?.IdUser) {
    return next(new ApiError(400, "IdHangHoa, SoLuong, and IdUser are required fields"));
  }

  try {
    const cartService = new CartService(MongoDB.client);
    
    const document = await cartService.create(req.body);
   
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while creating a cart item")
    );
  }
};


exports.findOne = async (req, res, next) => {
  try {
    const cartService = new CartService(MongoDB.client);
    const document = await cartService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Cart item not found"));
    }
    return res.send(document);
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Error retrieving cart item with id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0 || !req.body?.IdUser) {
    return next(new ApiError(400, "Data to update and IdUser can't be empty"));
  }

  try {
    const cartService = new CartService(MongoDB.client);
    const document = await cartService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Cart item not found"));
    }
    return res.send({ message: "Cart item was updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating cart item with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const cartService = new CartService(MongoDB.client);
    const document = await cartService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Cart item not found"));
    }
    return res.send({ message: "Cart item was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error deleting cart item with id=${req.params.id}`)
    );
  }
};
exports.deleteAll = async (req, res, next) => {
  try {
    const cartService = new CartService(MongoDB.client);
    const result = await cartService.deleteAll();
    
    // Kiểm tra xem có bản ghi nào bị xóa không
    if (result.deletedCount === 0) {
      return res.send({ message: "No cart items found to delete" });
    }

    return res.send({ message: "All cart items were deleted successfully" });
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while deleting all cart items"));
  }
};




exports.findAll = async (req, res, next) => {
  try {
    const cartService = new CartService(MongoDB.client);

    const documents = await cartService.findAllCart();
    
    const result = await Promise.all(
      documents.map(async (doc) => {
        const user = await cartService.getUserDetailsById(doc.IdUser);
        const product = await cartService.getProductDetailsById(doc.IdHangHoa);

        return {
          ...doc,
          userDetails: user,
          productDetails: product,
        };
      })
    );
    return res.send(result);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while retrieving cart items"));
  }
};




