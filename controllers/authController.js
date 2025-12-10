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

    // Setting a cookie to indicate user has signed up 
    res.cookie('SignedUp', `${username} signed up`, {
      httpOnly: true,  // Prevent client-side access to the cookie
      maxAge: 15 * 60 * 1000  
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

  // SQL query to get user by email (now parameterized)
  const query = "SELECT * FROM users WHERE email = ?";
  const params = [email];

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

      // Set a cookie indicating the user is logged in (optional)
      res.cookie('LoggedIn', `${email} logged in`, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000  // Cookie expires in 15 minutes
      });

      // If passwords match, sign a JWT token and return it with user data
      let token;
      try {
        token = signToken(row.id, row.role);
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
        token  // Return token for authentication
      });
    });
  });
};

// Make current logged-in user an admin (DEV ONLY,)
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

    return res.status(200).json({ message: "You are now an admin. Please log in again to get a new admin token." });
  });
};


// Logout route handler
const logout = (req, res) => {
  res.clearCookie('LoggedIn');  // Clear the 'LoggedIn' cookie
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { signup, login, logout, makeMeAdmin }; 