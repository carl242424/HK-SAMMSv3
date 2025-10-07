// generateHash.js
const bcrypt = require("bcryptjs");

(async () => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash("Admin123!", salt);
  console.log("Hashed password:", hash);
})();
