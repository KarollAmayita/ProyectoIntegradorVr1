class UserRepository {
  async findAllUsers() {
    throw new Error('Method not implemented');
  }
  async findUsersByCountry(pais_id) {
    throw new Error('Method not implemented');
  }
  async findUserByUsernameOrEmail(username, email) {
    throw new Error('Method not implemented');
  }
  async findUserById(id) {
    throw new Error('Method not implemented');
  }
  async createUser(userData) {
    throw new Error('Method not implemented');
  }
  async updateUser(id, updateData) {
    throw new Error('Method not implemented');
  }
  async updateUserPassword(id, password_hash) {
    throw new Error('Method not implemented');
  }
  async deleteUserPermanent(id) {
    throw new Error('Method not implemented');
  }
}

module.exports = UserRepository;
