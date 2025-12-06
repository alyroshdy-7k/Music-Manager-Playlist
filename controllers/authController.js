const { db } = require('../models/db.js');  // Import database instance
const bcrypt = require('bcryptjs');  // Import bcrypt for password hashing
const jwt = require('jsonwebtoken');  // Import jsonwebtoken for creating JWT tokens

// Function to sign a JWT token with user ID and role, and set expiration time
const signToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

// Signup route handler
const signup = (req, res) => {
  const { username, email, password } = req.body;  // Destructure request body
  const role = 'user';  // Default role for new users

  // Check if username and email are provided
  if (!username || !email) {
    return res.status(400).json({ error: "Username or email missing" });
  }

  // Hash the password before storing it in the database
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.log(err);  // Log error
      return res.status(500).json({ error: "Error hashing password" });
    }

    // Updated query to insert 'role' explicitly into the database
    const query = "INSERT INTO users (username, email, password, role) VALUES ('" + username + "', '" + email + "', '" + hashedPassword + "', '" + role + "')";

    // Set a cookie to indicate user has signed up (though this may not be needed)
    res.cookie('SignedUp', `${username} signed up`, {
      httpOnly: true,  // Prevent client-side access to the cookie
      maxAge: 15 * 60 * 1000  // Cookie expires in 15 minutes
    });

    // Run the SQL query to create the user
    db.run(query, (err) => {
      if (err) {
        console.log(err);  // Log database error
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
  const { email, password } = req.body;  // Destructure request body

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: "Email or password missing" });
  }

  // SQL query to get user by email
  const query = "SELECT * FROM users WHERE email = '" + email + "'";  // Be cautious with SQL injection risks
  const params = email;

  // Set a cookie indicating the user is logged in (not ideal, consider using tokens)
  res.cookie('LoggedIn', `${email} logged in`, {
    httpOnly: true,
    maxAge: 15 * 60 * 1000  // Cookie expires in 15 minutes
  });

  // Fetch user from the database
  db.get(query, params, (err, row) => {
    if (err) {
      console.log(err);  // Log error
      return res.status(500).json({ error: "Error retrieving user" });
    }
    if (!row) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Compare the provided password with the stored hashed password
    bcrypt.compare(password, row.password, (err, result) => {
      if (err) {
        console.log(err);  // Log error
        return res.status(500).json({ error: "Error comparing passwords" });
      }
      if (!result) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      // If passwords match, sign a JWT token and return it with user data
      const token = signToken(row.id, row.role);

      return res.status(200).json({
        message: "Login successful",
        data: { id: row.id, username: row.username, email: row.email, role: row.role },
        token,  // Return token for authentication
      });
    });
  });
};

// Logout route handler
const logout = (req, res) => {
  res.clearCookie('LoggedIn');  // Clear the 'LoggedIn' cookie
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { signup, login, logout };  // Export functions to be used in routes