const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const { createUser, findUser } = require("../models/userModel");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const secretKey = process.env.JWT_SECRET;

const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken)
      return res.status(400).json({ message: "Missing Google Token." });

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;
    const name = payload?.name || email?.split("@")[0];
    const googleId = payload?.sub;
    const emailVerified = payload?.email_verified;

    if (!email || !emailVerified || !googleId) {
      return res.status(400).json({ message: "Unverified Google Account." });
    }

    let user = await findUser(email);

    if (!user) {
      user = await createUser(name, email, null, "google", googleId);
    }

    const token = jwt.sign({ userid: user.id, email: user.email }, secretKey, {
      expiresIn: "7d",
    });

    return res.status(200).json({ token });
  } catch (err) {
    console.error("Google Auth Error:", err.message || err);
    return res.status(500).json({ message: "Google auth failed" });
  }
};

const registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const registeredUser = await findUser(email);
    if (registeredUser) {
      return res.status(400).json({ message: "User already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser(name, email, hashedPassword);

    return res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error("Error registering user:", err.message || err);
    return res.status(500).json({ message: "Server error." });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required." });
    }

    const registeredUser = await findUser(email);
    if (!registeredUser) {
      return res
        .status(401)
        .json({ message: "Email not found, please register first." });
    }

    if (!registeredUser.password) {
      return res
        .status(400)
        .json({ message: "This account uses Google login." });
    }

    const valid = await bcrypt.compare(password, registeredUser.password);
    if (!valid) {
      return res.status(401).json({ message: "Incorrect Password!" });
    }

    const token = jwt.sign(
      { userid: registeredUser.id, email: registeredUser.email },
      secretKey,
      { expiresIn: "7d" }
    );

    return res.status(200).json({ token });
  } catch (err) {
    console.error("Error logging in user:", err.message || err);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = { registerUser, loginUser, googleAuth };
