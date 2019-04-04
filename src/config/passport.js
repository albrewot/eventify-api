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
  // passport.serializeUser((user, done) => {
  //   console.log("inside serialize", user);
  //   done(null, user._id);
  // });

  // passport.deserializeUser((id, done) => {
  //   User.findById(id, (err, user) => {
  //     console.log(user, "dese");
  //     done(err, user);
  //   }).select("-password");
  // });

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      console.log("1 local strategy");

      let user = await User.findOne({ username });

      if (!user) {
        done(null, false, { message: `User [${username}] not found` });
      }

      const hash = await bcrypt.compare(password, user.password);

      if (hash) {
        console.log("done", user);
        const { password, ...userInfo } = user.toObject();
        return done(null, userInfo);
      } else {
        return done(null, false, { message: "Password incorrect" });
      }
    })
  );

  // passport.use(
  //   new JWTStrategy(
  //     {
  //       jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  //       secretOrKey: process.env.JWT_SECRET
  //     },
  //     function(jwtPayload, done) {
  //       console.log("jwt", jwtPayload);
  //       //find the user in db if needed
  //       return User.findOneById(jwtPayload._id)
  //         .then(user => {
  //           console.log("jwts", user);
  //           return done(null, user);
  //         })
  //         .catch(err => {
  //           console.log("jwterr", err);
  //           return done(err);
  //         });
  //     }
  //   )
  // );
};
