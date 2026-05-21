const PasswordHasher = require('../../../../ports/auth/outbound/password-hasher');
const bcrypt = require('bcryptjs');

class BcryptPasswordHasher extends PasswordHasher {
  async hash(password) {
    return bcrypt.hash(password, 10);
  }

  async compare(password, hash) {
    return bcrypt.compare(password, hash);
  }
}

module.exports = BcryptPasswordHasher;
