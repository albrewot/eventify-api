const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../helpers/db");
const User = db.User;

class UserService {
  //Login y devuelve objeto de usuario sin el hash del password
  async authenticate({ username, password }) {
    console.log("LOGIN SERVICE |", username, password);
    const user = await User.findOne({ username });
    console.log("USER |", user);
    if (!user) {
      return;
    }
    const compare = await bcrypt.compare(password, user.password);
    console.log("COMPARE |", compare);
    if (user && compare) {
      const { password, ...userWithoutHash } = user.toObject();
      console.log("user hash", userWithoutHash);
      const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET);
      return {
        ...userWithoutHash,
        token
      };
    }
  }

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
    console.log(userParam);
    // validate
    if (await User.findOne({ username: userParam.username })) {
      throw `the username: ${userParam.username} is already taken`;
    }

    const user = new User(userParam);

    if (userParam.password) {
      const hash = await bcrypt.hash(userParam.password, 10);
      user.password = hash;
    }

    await user.save();
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
