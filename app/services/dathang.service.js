const { ObjectId } = require("mongodb");

class OrderService {
  constructor(client) {
    this.Orders = client.db().collection("DatHang");
    this.Employees = client.db().collection("NhanVien");
    this.Users = client.db().collection("KhachHang");
  }

  extractOrderData(payload) {
    const order = {
      MSKH: payload.MSKH,
      MSNV: payload.MSNV,
      NgayDH: payload.NgayDH,
      NgayGH: payload.NgayGH,
      TrangthaiDH: payload.TrangthaiDH,
    };

    // Loại bỏ các trường có giá trị undefined
    Object.keys(order).forEach(
      (key) => order[key] === undefined && delete order[key]
    );

    return order;
  }

  async create(payload) {
    const order = this.extractOrderData(payload);
    const result = await this.Orders.insertOne(order, {
      returnDocument: "after",
      upsert: true,
    });
    return result.value;
  }

  async findBySoDonDH(SoDonDH) {
    return await this.find({
      SoDonDH: { $regex: new RegExp(SoDonDH), $options: "i" },
    });
  }

  async find(filter) {
    const cursor = await this.Orders.find(filter);
    return await cursor.toArray();
  }

  async findAllOrder() {
    try {
      const cursor = await this.Orders.aggregate([
        {
          $lookup: {
            from: "KhachHang", // Customers collection
            localField: "MSKH",
            foreignField: "_id",
            as: "customerInfo",
          },
        },
        {
          $lookup: {
            from: "NhanVien", // Employees collection
            localField: "MSNV",
            foreignField: "_id",
            as: "employeeInfo",
          },
        },
        {
          $project: {
            _id: 1,
            MSKH: 1,
            MSNV: 1,
            NgayDH: 1,
            NgayGH: 1,
            TrangthaiDH: 1,
            customerInfo: {
              $arrayElemAt: ["$customerInfo", 0],
            },
            employeeInfo: {
              $arrayElemAt: ["$employeeInfo", 0],
            },
          },
        },
      ]);

      const result = await cursor.toArray();
      return result;
    } catch (error) {
      console.log(error);
      throw new Error("An error occurred while fetching order details");
    }
  }

  async findCustomerId(userId) {
    try {
      const user = await this.Users.findOne({ _id: new ObjectId(userId) });
      return user;
    } catch (error) {
      console.error("An error occurred while fetching user details");
      throw error;
    }
  }

 // In OrderService class
async findEmployeeIdBy(employeeId) {
  try {
    // Convert the employeeId to a valid ObjectId before querying the database
    const employeeObjectId = ObjectId.isValid(employeeId) ? new ObjectId(employeeId) : null;
    
    const employee = await this.Employees.findOne({ _id: employeeObjectId });

    return employee;
  } catch (error) {
    console.error("An error occurred while fetching employee details");
    throw error;
  }
}

  

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractOrderData(payload);
    const result = await this.Orders.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.Orders.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
}

module.exports = OrderService;
