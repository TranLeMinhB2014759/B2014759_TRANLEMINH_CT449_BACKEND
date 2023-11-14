const { ObjectId } = require("mongodb");

class OrderService {
  constructor(client) {
    this.Orders = client.db().collection("DatHang");
  }

  extractOrderData(payload) {
    const order = {
      SoDonDH: payload.SoDonDH,
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

  async findById(id) {
    return await this.Orders.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
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
