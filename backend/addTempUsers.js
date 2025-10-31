const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/user"); // Adjust path if needed

dotenv.config();

const tempUsers = [
  {
    username: "admin.au@phinmaed.com",
    email: "admin.au@phinmaed.com",
    role: "admin",
    status: "active",
    password: "Admin@123",
  },
  {
    username: "checker.au@phinmaed.com",
    email: "checker.au@phinmaed.com",
    role: "checker",
    status: "active",
    password: "Checker@1",
  },
  {
    username: "facilitator.au@phinmaed.com",
    email: "w",
    role: "facilitator",
    status: "active",
    password: "Facilit8@r",
  },
];

async function addTempUsers() {
  try {
    // connect using your .env MongoDB connection
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    for (const userData of tempUsers) {
      const existingUser = await User.findOne({ username: userData.username });
      if (existingUser) {
        console.log(`⚠️ ${userData.username} already exists, skipping.`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const newUser = new User({
        username: userData.username,
        email: userData.email,
        role: userData.role,
        status: userData.status,
        password: hashedPassword,
      });

      await newUser.save();
      console.log(`✅ Created ${userData.role}: ${userData.username}`);
    }

    mongoose.connection.close();
    console.log("🚪 Connection closed. Done!");
  } catch (err) {
    console.error("❌ Error adding users:", err);
  }
}

addTempUsers();
