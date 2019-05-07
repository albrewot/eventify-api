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
  async create(params) {
    try {
      const { username, password, email, name } = params;
      if (!username || !password || !email || !name) {
        throw {
          type: "missing",
          message: `Missing one or more of the following: username, email, password, name`,
          code: 201
        };
      } else {
        if (await User.findOne({ username })) {
          throw {
            type: "taken",
            message: `the username ${username} is already taken`,
            code: 202
          };
        }
        if (await User.findOne({ email })) {
          throw {
            type: "taken",
            message: `the email ${email} is already taken`,
            code: 203
          };
        }

        const user = new User(params);

        const hash = await bcrypt.hash(password, 10);

        user.password = hash;

        const newUser = await User.create(user);
        if (newUser) {
          return newUser;
        } else {
          throw {
            type: "failed",
            message: `Error while creating the user`,
            code: 204
          };
        }
      }
    } catch (err) {
      throw err;
    }
  }

  async editUser(params) {
    const user = await User.findById(params.id);

    //Valida si el usuario existe o ya esta usado
    if (!user) throw { type: "not found", message: "User not found", code: 14 };
    if (!params.name || !params.email) {
      throw { type: "empty", message: "name or email fields are empty" };
    }
    if (
      user.email !== params.email &&
      (await User.findOne({ email: params.email }))
    ) {
      throw {
        type: "taken",
        message: `Email [${params.email}] is already taken`,
        code: 202
      };
    } else {
      Object.assign(user, {
        email: params.email
      });
    }
    if (!params.lastName) {
      params.lastName = "";
    }
    if (user.lastName !== params.lastName) {
      Object.assign(user, {
        lastName: params.lastName
      });
    }
    if (user.name !== params.name) {
      Object.assign(user, {
        name: params.name
      });
    }
    if (!params.tlf) {
      params.tlf = [];
    }
    if (!params.address) {
      params.address = [];
    }
    if (!params.country) {
      params.country = "";
    }
    if (!params.city) {
      params.city = "";
    }
    if (!params.state) {
      params.state = "";
    }
    Object.assign(user, {
      tlf: params.tlf,
      address: params.address,
      country: params.country,
      city: params.city,
      state: params.state
    });

    const editedUser = await user.save();
    const { password, ...editted } = editedUser.toObject();
    return editted;
  }

  async changeAvatar(id, image) {
    const user = await User.findById(id);
    console.log("found", user);
    if (!user) throw { type: "not found", message: "User not found", code: 14 };

    if (image) {
      Object.assign(user, {
        avatar: `${process.env.HOSTNAME_HANDLER}images/avatar/${image}`
      });
      const editedUser = await user.save();
      console.log("edited", editedUser);
      return editedUser;
    } else {
      throw "no image supplied";
    }
  }

  async changePassword(params) {
    console.log(params);
    try {
      const user = await User.findById(params.id);
      console.log(user);
      if (!user)
        throw { type: "not found", message: "User not found", code: 14 };
      //si se ingreso password, la hashea
      if (params.old && params.new) {
        const hash = await bcrypt.compare(params.old, user.password);
        if (hash) {
          const newHash = await bcrypt.hash(params.new, 10);
          Object.assign(user, {
            password: newHash
          });
          const editedUser = await user.save();
          console.log(editedUser, "edited");
          return editedUser;
        }
        throw { message: "password doesn't match" };
      }
    } catch (err) {
      throw err;
    }
  }

  async _delete(id) {
    await User.findByIdAndRemove(id);
  }
}

module.exports = new UserService();
