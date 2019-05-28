const bcrypt = require("bcrypt");
const db = require("../config/db");
const validation = require("../validations/user");
const User = db.User;
const Event = db.Event;
const Invitation = db.Invitation;

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
      const valid = await validation("register", params);
      if (valid.error) {
        // if (!username || !password || !email || !name) {
        throw {
          type: "validation",
          message: valid.error,
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
    const valid = await validation("edit", params);
    console.log("edit user", valid);
    if (valid.error) {
      throw {
        type: "validation",
        message: valid.error,
        code: 201
      };
    }
    console.log("valid", valid);
    const user = await User.findById(valid.id);
    //Valida si el usuario existe o ya esta usado
    if (!user) throw { type: "not found", message: "User not found", code: 14 };

    if (
      valid.email &&
      user.email != valid.email &&
      (await User.findOne({ email: valid.email }))
    ) {
      throw {
        type: "taken",
        message: `Email [${email}] is already taken`,
        code: 202
      };
    }

    Object.assign(user, valid);
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

  async getUserInvitations(id) {
    const invitations = await Invitation.find({ user: id })
      .where("active")
      .equals(true);
    if (invitations) {
      return invitations;
    } else {
      throw {
        type: "not found",
        message: "invitations not found"
      };
    }
  }

  async confirmUserInvitation(params, id) {
    const invitation = await Invitation.findById(id);
    const event = await Event.findById(invitation.event);
    const { active, status, used } = invitation;
    console.log(invitation);
    if (invitation && active) {
      if (status !== "pending" || used) {
        throw {
          type: "already used",
          message: "this invitation was already used or declined",
          data: invitation
        };
      } else {
        if (event) {
          console.log("hue", event);
          if (event.guests.length > 0) {
            for (let guest of event.guests) {
              console.log("guest id", guest);
              if (guest === invitation.user) {
                throw {
                  type: "already exist",
                  message: "User already exist in the guest list",
                  data: invitation
                };
              }
              console.log("before", event.guests, guest);
              event.guests.push(invitation.user);
              console.log(">", event.guests);
            }
          } else {
            event.guests.push(invitation.user);
            console.log("<", event.guests);
          }
        } else {
          throw {
            type: "not found",
            message: "event id was not found",
            data: id
          };
        }
        switch (params.confirm) {
          case "1":
            Object.assign(invitation, { status: "accepted", used: true });
            break;
          case "2":
            Object.assign(invitation, { status: "declined", used: true });
            break;
        }
        const confirmedInvitation = await invitation.save();
        console.log("confirmed inv", confirmedInvitation);
        if (confirmedInvitation && params.confirm == "1") {
          console.log("accepted");
          const newGuestList = await event.save();
          if (newGuestList) {
            return { guest: id };
          } else {
            throw {
              type: "failed",
              message: "Error while adding guest ot the event guest list",
              data: id
            };
          }
        } else if (confirmedInvitation && params.confirm == "2") {
          return { data: invitation, invitation: "was declined" };
        } else {
          throw {
            type: "failed",
            message: "Error while confirming invitation",
            data: invitation
          };
        }
      }
    } else if (invitation && !active) {
      throw {
        type: "invitation disabled",
        message: "this invitation was already disabled",
        data: invitation
      };
    } else {
      throw {
        type: "not found",
        message: "invitation id was not found",
        data: id
      };
    }
  }
}

module.exports = new UserService();
