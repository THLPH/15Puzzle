CREATE DATABASE puzzle_db;
USE puzzle_db;

CREATE TABLE leaderboard (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_name VARCHAR(50) NOT NULL,
    mode VARCHAR(20) NOT NULL,
    moves INT NOT NULL,
    time_seconds INT NOT NULL,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);