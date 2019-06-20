const bcrypt = require("bcrypt");
const db = require("../config/db");
const validation = require("../validations/user");
const { checkRestrictions } = require("../helpers");
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
    return await User.findById(id)
      .select("-password")
      .populate("country")
      .populate("followers")
      .populate("following")
      .populate("chats")
      .populate({
        path: "event_signups",
        select: "id _id name image country city type",
        populate: { path: "type country", select: "name" }
      });
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
    let editedUser = await user.save();
    editedUser = await editedUser
      .populate("followers")
      .populate("country")
      .populate("following")
      .populate("chats")
      .populate({
        path: "event_signups",
        select: "id _id name image country city type",
        populate: { path: "type country", select: "name _id id" }
      })
      .execPopulate();
    console.log("POPULATE EDIT", editedUser);
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
      .equals(true)
      .where("status")
      .equals("pending")
      .populate("user")
      .populate("event", "name image");
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
    const invitation = await Invitation.findById(id).populate(
      "user",
      "-password"
    );
    const event = await Event.findById(invitation.event);
    const { active, status, used, user } = invitation;
    const eventUser = await User.findById(user.id);
    console.log(invitation);
    let pass = 0;
    if (params.confirm === "1") {
      for (let restriction of event.restrictions) {
        const result = checkRestrictions(
          restriction.toObject(),
          user.genre,
          user.birthDate
        );
        console.log("result", result);
        pass = pass + result;
      }
      console.log("af", pass);
      if (pass > 0) {
        throw {
          type: "validation",
          message:
            "User is not allowed to sign up for event due to restrictions"
        };
      }
    }
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
            console.log(event.guests.length);
            for (let guest of event.guests) {
              console.log("itero", guest, invitation.user);
              if (guest == user.id) {
                throw {
                  type: "already exist",
                  message: "User already exist in the guest list",
                  data: event.guests
                };
              } else {
                console.log("before", event.guests, guest);
                event.guests.push(user.id);
                console.log(">", event.guests);
              }
            }
          } else {
            event.guests.push(user.id);
            console.log("<", event.guests);
          }
        } else {
          throw {
            type: "not found",
            message: "event id was not found",
            data: invitation.event
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

          eventUser.event_signups.push(event.id);
          await eventUser.save();

          if (newGuestList) {
            return { guest: user.id, data: invitation };
          } else {
            throw {
              type: "failed",
              message: "Error while adding guest ot the event guest list",
              data: user.id
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

  async leaveFromEvent(eventId, userId) {
    const event = await Event.findById(eventId);
    const user = await User.findById(userId);
    if (!event) {
      throw {
        type: "not found",
        message: "event id was not found",
        data: eventId
      };
    }
    if (!user) {
      throw { type: "not found", message: "User not found", code: 14 };
    }
    const userIndex = event.guests.indexOf(userId);
    if (userIndex == -1) {
      throw {
        type: "not found",
        message: "User not found in event guest list",
        code: 14
      };
    }
    event.guests.splice(userIndex, 1);
    return await event.save();
  }

  async followUser(followId, userId) {
    const follow = await User.findById(followId);
    const user = await User.findById(userId);
    if (!follow) {
      throw {
        type: "not found",
        message: "User to follow wasnt found"
      };
    }
    if (!user) {
      throw {
        type: "not found",
        message: "Current User wasnt found"
      };
    }
    if (follow.followers.indexOf(userId) > -1) {
      console.log(userId in follow.followers);
      throw {
        type: "validation",
        message: "User is already following this account"
      };
    }
    follow.followers.push(userId);
    await follow.save();
    user.following.push(follow.id);
    let updatedUser = await user.save();
    updatedUser = await updatedUser
      .populate("followers", "_id name lastName avatar username followers")
      .populate("following", "_id name lastName avatar username following")
      .execPopulate();
    return {
      log: `User: ${userId} added to User: ${follow.id} followers list`,
      user: updatedUser
    };
  }

  async unfollowUser(followId, userId) {
    const follow = await User.findById(followId);
    const user = await User.findById(userId);
    if (!follow) {
      throw {
        type: "not found",
        message: "User to follow wasnt found"
      };
    }
    if (!user) {
      throw {
        type: "not found",
        message: "Current User wasnt found"
      };
    }
    if (follow.followers.indexOf(userId) > -1) {
      const index = follow.followers.indexOf(userId);
      follow.followers.splice(index, 1);
      await follow.save();

      const userIndex = user.following.indexOf(follow.id);
      user.following.splice(userIndex, 1);
      let updatedUser = await user.save();
      updatedUser = await updatedUser
        .populate(
          "followers",
          "_id name lastName avatar username followers following"
        )
        .populate(
          "following",
          "_id name lastName avatar username followers following"
        )
        .execPopulate();
      return {
        log: `User: ${userId} removed from User: ${follow.id} followers list`,
        user: updatedUser
      };
    }

    throw {
      type: "not found",
      message: `User is not following ${follow.id}`
    };
  }

  async getFollowers(userId) {
    const user = await User.findById(userId).populate(
      "followers",
      "_id name lastName avatar username"
    );
    console.log(userId, user);
    if (!user) {
      throw {
        type: "not found",
        message: "User wasnt found"
      };
    }
    console.log(user);
    return user.followers;
  }

  async getFollowing(userId) {
    const user = await User.findById(userId).populate(
      "following",
      "_id name lastName avatar username"
    );
    if (!user) {
      throw {
        type: "not found",
        message: "User wasnt found"
      };
    }
    return user.following;
  }

  async searchUser(query) {
    const users = await User.find({
      $or: [
        { name: new RegExp(query, "i") },
        { email: new RegExp(query, "i") },
        { username: new RegExp(query, "i") }
      ]
    }).select(" _id id name lastName username avatar email");
    if (!users || users.length == 0) {
      throw {
        type: "not found",
        message: `users with [${query}] were not found`
      };
    }
    return users;
  }
}

module.exports = new UserService();
