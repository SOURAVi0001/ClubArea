const Club = require('../models/clubs');
class Register {
  constructor(id, name, description, photo) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.photo = photo;
  }

  async save() {
    try {
      const existing = await Club.findOne({ id: this.id });

      if (existing) {
        existing.name = this.name;
        existing.description = this.description;
        existing.photo = this.photo;
        return await existing.save();
      } else {
        const newClub = new Club({
          id: this.id,
          name: this.name,
          description: this.description,
          photo: this.photo
        });
        return await newClub.save();
      }
    } catch (err) {
      throw err;
    }
  }

  static fetchAll() {
    return Club.find();
  }

  static findById(id) {
    return Club.findOne({ id: id });
  }
}

module.exports = Register;