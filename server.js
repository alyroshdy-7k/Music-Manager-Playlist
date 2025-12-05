const { app } = require('./index.js');  //Import Express app from index.js
const db_access = require('./db.js');   //Import database setup
const db = db_access.db;  //SQLite database instance

const PORT = 3000;  //Port number for the server

// Create the necessary tables if they don't exist
db.serialize(() => {
    db.run(db_access.createUserTable, (err) => {
        if (err) console.error("Error creating user table:", err.message);
    });
    db.run(db_access.createPlaylistTable, (err) => {
        if (err) console.error("Error creating playlist table:", err.message);
    });
    db.run(db_access.createSongTable, (err) => {
        if (err) console.error("Error creating song table:", err.message);
    });
});

//Start the server on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
