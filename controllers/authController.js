const { db } = require('../models/db.js');  // Import database instance
const bcrypt = require('bcryptjs');         // Import bcrypt for password hashing
const jwt = require('jsonwebtoken');        // Import jsonwebtoken for creating JWT tokens

// Sign JWT with all the useful user info
const signToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Signup route handler
const signup = (req, res) => {
  const { username, email, password } = req.body;
  const role = 'user';  // Default role for new users

  if (!username || !email) {
    return res.status(400).json({ error: "Username or email missing" });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Error hashing password" });
    }

    const query = `
      INSERT INTO users (username, email, password, role)
      VALUES ('${username}', '${email}', '${hashedPassword}', '${role}')
    `;

    res.cookie('SignedUp', `${username} signed up`, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000
    });

    db.run(query, (err) => {
      if (err) {
        console.log(err);
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.status(400).json({ error: "Email already exists" });
        }
        return res.status(500).json({ error: "Error creating user" });
      }
      return res.status(201).json({ message: "User created successfully" });
    });
  });
};

// Login route handler
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email or password missing" });
  }

  const query = "SELECT * FROM users WHERE email = ?";
  const params = [email];

  db.get(query, params, (err, row) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Error retrieving user" });
    }

    if (!row) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    bcrypt.compare(password, row.password, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Error comparing passwords" });
      }

      if (!result) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      res.cookie('LoggedIn', `${email} logged in`, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000
      });

      let token;
      try {
        // now we pass the whole user row so the token has id, username, email, role
        token = signToken(row);
      } catch (e) {
        console.log(e);
        return res.status(500).json({ error: "Error generating token" });
      }

      return res.status(200).json({
        message: "Login successful",
        data: {
          id: row.id,
          username: row.username,
          email: row.email,
          role: row.role
        },
        token
      });
    });
  });
};

// Make current logged-in user an admin (DEV ONLY)
const makeMeAdmin = (req, res) => {
  const userId = req.user.userId; // from JWT

  if (!userId) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const query = "UPDATE users SET role = 'admin' WHERE id = ?";
  const params = [userId];

  db.run(query, params, function (err) {
    if (err) {
      console.log("Error making user admin:", err);
      return res.status(500).json({ error: "Database error while making admin" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "You are now an admin. Please log in again to get a new admin token."
    });
  });
};

// Get logged-in user's profile
const getMe = (req, res) => {
  const user = req.user; // Comes from JWT (protect middleware)

  return res.status(200).json({
    message: "User profile fetched.",
    user: {
      id: user.userId,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
};

// Get all users (Admin-only)
const getAllUsers = (req, res) => {

  // 🚨 IMPORTANT: Only admins allowed
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admins only" });
  }

  const query = "SELECT id, username, email, role FROM users";

  db.all(query, [], (err, rows) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Error fetching users" });
    }

    return res.status(200).json({
      message: "All users fetched",
      users: rows
    });
  });
};


// Logout route handler
const logout = (req, res) => {
  res.clearCookie('LoggedIn');
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
  signup,
  login,
  logout,
  makeMeAdmin,
  getMe,
  getAllUsers
};
