// checkPassword.js
const bcrypt = require("bcryptjs");

const password = "sa@123456";
const hash = "$2a$12$UunNcH/NKYXBO03EeOgaWuBec3x1JQeFtmlwhg3JU/srY8sTKE5Gu";

bcrypt.compare(password, hash, (err, result) => {
  if (err) throw err;
  console.log("Password matches hash:", result);
});
