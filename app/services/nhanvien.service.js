const { ObjectId } = require("mongodb");

class EmployeeService {
  constructor(client) {
    this.Employees = client.db().collection("NhanVien");
  }

  extractEmployeeData(payload) {
    const employee = {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      address: payload.address,
      phoneNumber: payload.phoneNumber,
      role: payload.role || "employee",
      // token: payload.token || null,
    };

    Object.keys(employee).forEach(
      (key) => employee[key] === undefined && delete employee[key]
    );

    return employee;
  }

  async create(payload) {
    const employee = this.extractEmployeeData(payload);
    const result = await this.Employees.findOneAndUpdate(
      { email: employee.email },
      {
        $set: {
          name: employee.name,
          email: employee.email,
          password: employee.password,
          role: employee.role,
          chucVu: employee.chucVu,
        },
      },
      { returnDocument: "after", upsert: true }
    );
    return result.value;
  }

  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(name), $options: "i" },
    });
  }

  async find(filter) {
    const cursor = await this.Employees.find(filter);
    return await cursor.toArray();
  }

  async findEmployeeById(id) {
    const employee = await this.Employees.findOne({ _id: new ObjectId(id) });
    return employee;
  }

  async update(id, payload) {
    const filter = { _id: new ObjectId(id) };
    const update = { $set: payload };
    const result = await this.Employees.findOneAndUpdate(filter, update, {
      returnOriginal: false,
    });
    return result.value;
  }

  async delete(id) {
    const result = await this.Employees.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result.value;
  }

  async deleteAll() {
    const result = await this.Employees.deleteMany({});
    return result.deletedCount;
  }

 
}

module.exports = EmployeeService;
