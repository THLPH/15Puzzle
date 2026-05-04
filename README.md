# 15 Puzzle: Seasonal Edition

A sleek, responsive web-based 15-puzzle game featuring dynamic seasonal image slicing, a robust MySQL leaderboard, and advanced performance analytics. 

This project operates as a full-stack web application. The frontend is built with vanilla HTML, CSS, and JavaScript, while the backend utilizes a custom PHP API to persist game state and compute aggregate statistics.

## ✨ Features

* **Dynamic Image Slicing:** Play across three seasonal modes (Bloom, Breeze, Sun). The JavaScript engine automatically cuts a 400x400 image into 16 interactive tiles.
* **Mathematical Shuffling:** Uses a 360-depth valid-neighbor algorithm and inversion parity checks to guarantee that every generated puzzle is 100% solvable.
* **Magic Hint System:** Incorporates a "Greedy Manhattan Distance" evaluation to calculate and execute the optimal next move.
* **Performance Analytics:** A live dashboard tracks total runs, average solve times, and mode popularity dynamically from the database.
* **Graceful Fallback:** If the database connection fails, the application automatically catches the error and saves player scores to the browser's `localStorage` to ensure data is never lost.
* **Day/Night Theme:** A fully integrated CSS variable system allows users to swap between light and dark modes.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Grid & Variables), Vanilla JavaScript (ES6+)
* **Backend:** PHP (PDO)
* **Database:** MySQL
* **Environment:** Designed for local development (Laragon, XAMPP, MAMP)

## 📁 Directory Structure

```text
/
├── index.html              # Main application layout and UI
├── style.css               # CSS Grid layout and theme variables
├── puzzle.js               # Core game logic, DOM manipulation, and API fetching
├── schema.sql              # Database table creation script
├── api/                    # Backend endpoints
│   ├── db.php              # MySQL PDO connection configuration
│   ├── get_analytics.php   # Returns aggregate performance data (JSON)
│   ├── get_leaderboard.php # Returns top 10 scores (JSON)
│   └── save_score.php      # Validates and inserts new scores into the database
└── assets/                 # Local image assets
    ├── bloom.jpg
    ├── breeze.jpg
    └── sun.jpg
```

## 🚀 Installation & Setup

To run this project locally, you will need a local server environment capable of running PHP and MySQL (such as Laragon or XAMPP).

### 1. Clone the Repository
Clone or extract this project into your local web server's root directory (e.g., `C:\laragon\www\puzzle` or `C:\xampp\htdocs\puzzle`).

### 2. Database Setup
You must initialize the database before the leaderboard and analytics will work. You can do this via the Command Line or a Graphical User Interface (GUI).

**Option A: Command Line Setup (CLI)**
1. Open your terminal and log into MySQL:
   ```bash
   mysql -u root -p
   ```
2. Create the database and select it:
   ```sql
   CREATE DATABASE puzzle_db;
   USE puzzle_db;
   ```
3. Source the schema file from your project folder:
   ```sql
   SOURCE /path/to/your/project/schema.sql;
   ```

**Option B: GUI Setup (phpMyAdmin / HeidiSQL / DBeaver)**
1. Open your database management tool.
2. Create a new database named `puzzle_db` (Collation: `utf8mb4_general_ci`).
3. Navigate to the **Import** tab or open a new Query window.
4. Upload or paste the contents of the `schema.sql` file and execute it. 

### 3. Configure Database Credentials
If your local MySQL environment uses a password for the `root` user, you need to update the configuration file.
1. Open `api/db.php`.
2. Modify the `$pass` variable to match your local setup:
   ```php
   $user = 'root'; 
   $pass = 'YOUR_PASSWORD_HERE'; // Leave as '' if you have no password
   ```

### 4. Play
Open your web browser and navigate to `http://localhost/puzzle/index.html` (adjust the URL based on your specific local server configuration).

## 🤖 AI Disclosure

This project was developed by a solo developer, utilizing Generative AI tools (ChatGPT/Gemini) as a pair-programming assistant to accelerate development and solve complex mathematical logic. AI was specifically leveraged for the following tasks:

* **Algorithm Formulation:** Generating the mathematical inversion math required for the `isSolvable()` parity check to ensure the board is never placed in an unwinnable state.
* **Heuristics:** Drafting the "Greedy Manhattan Distance" logic used in the Magic Hint feature to evaluate the most optimal neighboring move.
* **Debugging:** Identifying race conditions and fixing a fatal DOM crash caused by attempting to attach event listeners to null elements.
* **Layout Scaffolding:** Assisting with the transition from a rigid Flexbox layout to a responsive 2-column CSS Grid architecture.
* **SQL Aggregation:** Helping construct the grouped aggregate queries in `get_analytics.php` to calculate mode distribution and average times. 

All AI-generated code was thoroughly reviewed, refactored, and integrated manually to fit the specific architecture and design patterns of this application.

## 📝 License
This project is open-source and available for educational purposes.
```
