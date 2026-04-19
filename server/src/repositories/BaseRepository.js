import prisma from '../config/db.js';

class BaseRepository {
  constructor(modelName) {
    this.model = prisma[modelName];
  }

  async findAll(params = {}) {
    return await this.model.findMany(params);
  }

  async findById(id) {
    return await this.model.findUnique({
      where: { id }
    });
  }

  async create(data) {
    return await this.model.create({
      data
    });
  }

  async update(id, data) {
    return await this.model.update({
      where: { id },
      data
    });
  }

  async delete(id) {
    return await this.model.delete({
      where: { id }
    });
  }
}

export default BaseRepository;
