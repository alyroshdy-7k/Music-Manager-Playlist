const { db } = require('../models/db.js'); // Import database connection

// Function to update user role
const updateUserRole = (req, res) => {
  const user_id = req.params.id;  // Get the user ID from the route params
  const { role } = req.body;  // Get the new role from the request body

  // Basic validation for role
  if (!role || !user_id) {
    return res.status(400).json({ error: "User ID and role are required" });
  }

  // Update the user's role in the database
  const query = "UPDATE users SET role = ? WHERE id = ?";
  const params = [role, user_id];

  db.run(query, params, function(err) {

    if (this.changes === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: `User role updated to ${role}` });
  });
};

// Get all users (admin only)
const getAllUsers = (req, res) => {

  const query = "SELECT id, username, email, role FROM users";

  db.all(query, [], (err, rows) => {
    if (err) {
      console.log("Error fetching users:", err);
      return res.status(500).json({ error: "Database error fetching users" });
    }

    res.status(200).json({
      message: "Users fetched successfully",
      users: rows
    });
  });
};


module.exports = {updateUserRole,getAllUsers};
