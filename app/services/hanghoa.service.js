const { ObjectId } = require("mongodb");

class ProductService {
  constructor(client) {
    this.Products = client.db().collection("HangHoa");
  }

  extractProductData(payload) {
    const product = {
      TenHH: payload.TenHH,
      MoTaHH: payload.MoTaHH,
      Gia: payload.Gia,
      SoLuongHangHoa: payload.SoLuongHangHoa,
      GhiChu: payload.GhiChu,
      imgURL: payload.imgURL,
    };

    // Remove undefined fields
    Object.keys(product).forEach(
      (key) => product[key] === undefined && delete product[key]
    );

    return product;
  }

  async create(payload) {
    const product = this.extractProductData(payload);
    const result = await this.Products.insertOne(product, {
      returnDocument: "after",
      upsert: true,
    });
    return result.value;
  }

  async findByTenHH(TenHH) {
    return await this.find({
      TenHH: { $regex: new RegExp(TenHH), $options: "i" },
    });
  }

  async find(filter) {
    const cursor = await this.Products.find(filter);
    return await cursor.toArray();
  }

  async findById(id) {
    return await this.Products.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
  });
  }

  async update(id, payload) {
    const filter = {
        _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractProductData(payload);
    const result = await this.Products.findOneAndUpdate(
        filter,
        { $set: update },
        { returnDocument: "after" }
    );
    return result;
}


  async delete(id) {
    const result = await this.Products.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  
}

module.exports = ProductService;
