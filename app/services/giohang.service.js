const { ObjectId } = require("mongodb");

class CartService {
  constructor(client) {
    this.Carts = client.db().collection("Giohang");
    this.Users = client.db().collection("KhachHang");
    this.Products = client.db().collection("HangHoa");
  }

  async extractCartData(payload) {
    const cart = {
      IdUser: payload.IdUser,
      IdHangHoa: payload.IdHangHoa,
      SoLuong: payload.SoLuong,
      
    };

    // Remove fields with undefined values
    Object.keys(cart).forEach(
      (key) => cart[key] === undefined && delete cart[key]
    );

    console.log("Final Cart:", cart);

    return cart;
  }

  async create(payload) {
    try {
      const cart = await this.extractCartData(payload);
      const result = await this.Carts.insertOne(cart, {
        returnDocument: "after",
        upsert: true,
      });
      return result.value; // Corrected line
    } catch (error) {
      console.log(error);
      throw new Error("An error occurred while creating a cart item");
    }
  }

  async find(filter) {
    const cursor = await this.Carts.find(filter);
    return await cursor.toArray();
  }

  async findById(id) {
    return await this.Carts.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }
  async findAllCart() {
    try {
      const cursor = await this.Carts.aggregate([
        
        {
          $lookup: {
            from: "KhachHang", // Users collection
            localField: "IdUser",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $lookup: {
            from: "HangHoa", // Products collection
            localField: "IdHangHoa",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $project: {
            _id: 1,
            IdUser: 1,
            IdHangHoa: 1,
            SoLuong: 1,
            name: 1,
            address: 1,
            userDetails: {
              $arrayElemAt: ["$userDetails", 0],
            },
            productDetails: {
              $arrayElemAt: ["$productDetails", 0],
            },
          },
        },
      ]);

      const result = await cursor.toArray();
      return result;
    } catch (error) {
      console.log(error);
      throw new Error("An error occurred while fetching cart details");
    }
  }
  async getUserDetailsById(userId) {
    try {
      const user = await this.Users.findOne({ _id: new ObjectId(userId) });
      return user;
    } catch (error) {
      console.error("An error occurred while fetching user details");
      throw error;
    }
  }
  

  
  async getProductDetailsById(productId) {
    try {
      const product = await this.Products.findOne({ _id: new ObjectId(productId) });
      return product;
    } catch (error) {
      console.log(error);
      throw new Error("An error occurred while fetching product details");
    }
  }
  

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = await this.extractCartData(payload);
    const result = await this.Carts.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.Carts.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
  async deleteAll() {
    try {
      const result = await this.Carts.deleteMany({});
      return result;
    } catch (error) {
      console.log(error);
      throw new Error("An error occurred while deleting all cart items");
    }
  }
  
}

module.exports = CartService;
