Music Manager Playlist API
Overview:

The Music Manager Playlist API allows users to manage playlists (create, update, fetch, and delete) using Node.js, Express, and SQLite.

Features
Create Playlist: Adds a new playlist for a user.
Get Playlists: Fetches all playlists for a user.
Update Playlist: Updates the name of an existing playlist.
Delete Playlist: Removes a playlist and its songs.
Share Playlist: shares playlists between users.

Project Structure
Controllers: has all logic functions
Routes: Defines API endpoints and links to controllers (e.g., playlistRoutes.js).
Models: Database interactions like db.js
Server: Sets up the Express app and database connection.
How It Works
Controllers: Handle database interactions and responses.
Routes: Define API endpoints that trigger controller functions.
Database: Stores data using SQLite, accessed by controllers.

Server connects all and run
