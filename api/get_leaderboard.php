<?php
header("Content-Type: application/json");
require_once 'db.php';

try {
    // Fetch top 10 scores ordered by moves (ascending) and then time (ascending)
    $stmt = $pdo->query("SELECT player_name, mode, moves, time_seconds FROM leaderboard ORDER BY moves ASC, time_seconds ASC LIMIT 10");
    $scores = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($scores);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Could not fetch leaderboard"]);
}
?>