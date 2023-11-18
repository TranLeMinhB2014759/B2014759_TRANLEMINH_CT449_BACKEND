const { ObjectId } = require("mongodb");

class CartService {
  constructor(client) {
    this.Carts = client.db().collection("Giohang");
    this.Users = client.db().collection("khachHang");
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

  // async findIdUser(IdUser) {
  //   try {
  //     const aggregationPipeline = [
  //       {
  //         $match: { IdUser: ObjectId(IdUser) },
  //       },
  //       {
  //         $lookup: {
  //           from: "khachHang", // Name of the khachHang collection
  //           localField: "IdUser",
  //           foreignField: "UserId",
  //           as: "user",
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "HangHoa", // Name of the HangHoa collection
  //           localField: "IdHangHoa",
  //           foreignField: "_id",
  //           as: "product",
  //         },
  //       },
  //       {
  //         $unwind: "$user",
  //       },
  //       {
  //         $unwind: "$product",
  //       },
  //       {
  //         $project: {
  //           _id: 1,
  //           IdUser: 1,
  //           IdHangHoa: 1,
  //           SoLuong: 1,
  //           user: {
  //             UserId: 1,
  //             // Add other fields from khachHang collection as needed
  //           },
  //           product: {
  //             // Add fields from HangHoa collection as needed
  //           },
  //         },
  //       },
  //     ];

  //     const documents = await this.Carts.aggregate(
  //       aggregationPipeline
  //     ).toArray();

  //     return documents;
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error("An error occurred while finding user cart by user ID");
  //   }
  // }

  // async findIdHangHoa(IdHangHoa) {
  //   try {
  //     const aggregationPipeline = [
  //       {
  //         $match: { IdHangHoa: ObjectId(IdHangHoa) },
  //       },
  //       {
  //         $lookup: {
  //           from: "khachHang", // Name of the khachHang collection
  //           localField: "IdUser",
  //           foreignField: "UserId",
  //           as: "user",
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "HangHoa", // Name of the HangHoa collection
  //           localField: "IdHangHoa",
  //           foreignField: "_id",
  //           as: "product",
  //         },
  //       },
  //       {
  //         $unwind: "$user",
  //       },
  //       {
  //         $unwind: "$product",
  //       },
  //       {
  //         $project: {
  //           _id: 1,
  //           IdUser: 1,
  //           IdHangHoa: 1,
  //           SoLuong: 1,
  //           user: {
  //             UserId: 1,
  //             // Add other fields from khachHang collection as needed
  //           },
  //           product: {
  //             // Add fields from HangHoa collection as needed
  //           },
  //         },
  //       },
  //     ];

  //     const documents = await this.Carts.aggregate(
  //       aggregationPipeline
  //     ).toArray();

  //     return documents;
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error("An error occurred while finding cart items by product ID");
  //   }
  // }

  async findAll(filter = {}) {
    try {
      const aggregationPipeline = [
        {
          $match: filter,
        },
        {
          $lookup: {
            from: "khachHang",
            localField: "IdUser",
            foreignField: "UserId",
            as: "user",
          },
        },
        {
          $lookup: {
            from: "HangHoa",
            localField: "IdHangHoa",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$product",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            IdUser: 1,
            IdHangHoa: 1,
            SoLuong: 1,
            user: {
              UserId: "$user.UserId",
              name: "$user.name",
              email: "$user.email",
              address: "$user.address",
              phoneNumber: "$user.phoneNumber",
              role: "$user.role",
              imgURL: "$user.imgURL",
            },
            product: {
              TenHH: "$product.TenHH",
              MoTaHH: "$product.MoTaHH",
              Gia: "$product.Gia",
              SoLuongHangHoa: "$product.SoLuongHangHoa",
              GhiChu: "$product.GhiChu",
              imgURL: "$product.imgURL",
            },
          },
        },
      ];

      const documents = await this.Carts.aggregate(
        aggregationPipeline
      ).toArray();
      return documents;
    } catch (error) {
      console.log(error);
      throw new Error("An error occurred while finding all cart items");
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
}

module.exports = CartService;
