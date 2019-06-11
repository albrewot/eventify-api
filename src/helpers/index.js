const moment = require("moment");

const checkRestrictions = (restrictions, genre, birthDate) => {
  console.log("hue", restrictions, genre, birthDate);
  let birthday;
  let age;
  let check;
  if (birthDate) {
    birthday = moment(birthDate);
    age = moment().diff(birthday, "years");
  }

  switch (restrictions.restrictionType) {
    case "age-min":
      console.log(age, restrictions.rules[0]);
      check = age >= restrictions.rules[0] ? 0 : 1;
      console.log("Edad minima", check);
      break;
    case "age-max":
      check = age <= restrictions.rules[0] ? 0 : 1;
      console.log("Edad maxima", check);
      break;
    case "age-range":
      check =
        age > restrictions.rules[0] && age < restrictions.rules[1] ? 0 : 1;
      console.log("Entre el rango", check);
      break;
    case "genre":
      let genreCheck = false;
      for (let arrGenre of restrictions.restrictTo) {
        genreCheck = arrGenre.toString() === genre.toString();
      }
      check = genreCheck;
      if (check === false) {
        check = 1;
      } else {
        check = 0;
      }
      console.log("Genero en la Lista", check);
      break;
  }
  console.log("rev", check);
  return check;
};

module.exports = {
  checkRestrictions
};
