const { ObjectId } = require("mongodb");

class DetailService {
  constructor(client) {
    this.Detail = client.db().collection("ChiTietDatHang");
  }

  extractDetailData(payload) {
    const detail = {
      SoDonDH: payload.SoDonDH,
      MSHH: payload.MSHH,
      SoLuong: payload.SoLuong,
      GiaDatHang: payload.GiaDatHang,
      GiamGia: payload.GiamGia,
    };

    // Loại bỏ các trường có giá trị undefined
    Object.keys(detail).forEach(
      (key) => detail[key] === undefined && delete detail[key]
    );

    return detail;
  }

  async create(payload) {
    const detail = this.extractDetailData(payload);
    const result = await this.Detail.insertOne(detail, {
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
    const cursor = await this.Detail.find(filter);
    return await cursor.toArray();
  }

  async findById(id) {
    return await this.Detail.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractDetailData(payload);
    const result = await this.Detail.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.Detail.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
}

module.exports = DetailService;
