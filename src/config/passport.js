//Imports
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

// Load User model
const db = require("./db");
const User = db.User;

module.exports = passport => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      console.log("1 local strategy");

      let user = await User.findOne({ username });
      if(!user){
        user = await User.findOne({email:username});
      }
      if (!user) {
        done(null, false, {
          message: `User [${username}] not found`,
          code: 204
        });
      }

      const hash = await bcrypt.compare(password, user.password);

      if (hash) {
        console.log("done", user);
        const { password, ...userInfo } = user.toObject();
        return done(null, userInfo);
      } else {
        return done(null, false, { message: "Incorrect password", code: 205 });
      }
    })
  );
};
