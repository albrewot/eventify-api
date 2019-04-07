const bcrypt = require("bcrypt");
const db = require("../config/db");
const User = db.User;

class UserService {
  //se trae a todos los usuarios de la collecion, sin hash
  async getAll() {
    return await User.find().select("-password");
  }

  //se trae a un usuario sin hash
  async getById(id) {
    return await User.findById(id).select("-password");
  }

  //crea un usuario
  async create(userParam) {
    const { username, password, email } = userParam;
    if (!username || !password || !email) {
      throw `Missing one or more of the following: username, email, password`;
    } else {
      if (await User.findOne({ username })) {
        throw `the username ${username} is already taken`;
      }
      if (await User.findOne({ email })) {
        throw `the email ${email} is already taken`;
      }

      const user = new User(userParam);

      const hash = await bcrypt.hash(password, 10);

      user.password = hash;

      const newUser = await User.create(user);

      if (newUser) {
        return newUser;
      } else {
        throw `Error while creating the user`;
      }
    }
  }

  async update(id, userParam) {
    const user = await User.findById(id);

    //Valida si el usuario existe o ya esta usado
    if (!user) throw "User not found";
    if (
      user.username !== userParam.username &&
      (await User.findOne({ username: userParam.username }))
    ) {
      throw 'Username "' + userParam.username + '" is already taken';
    }

    //si se ingreso password, la hashea
    if (userParam.password) {
      const hash = await bcrypt.hash(userParam.password, 10);
      userParam.password = hash;
    }

    //asigna parametros al objeto user y lo guarda en db
    Object.assign(user, userParam);

    await user.save();
  }

  async _delete(id) {
    await User.findByIdAndRemove(id);
  }
}

module.exports = new UserService();
