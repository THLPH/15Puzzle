<?php
header("Content-Type: application/json");
require_once 'db.php';

try {
    $stats = [];
    
    // Total runs
    $stats['total_runs'] = $pdo->query("SELECT COUNT(*) FROM leaderboard")->fetchColumn();
    
    // Avg solve time
    $avgTime = $pdo->query("SELECT AVG(time_seconds) FROM leaderboard")->fetchColumn();
    $stats['avg_time'] = $avgTime ? round($avgTime, 2) : 0;
    
    // Best run
    $bestRun = $pdo->query("SELECT moves, time_seconds FROM leaderboard ORDER BY moves ASC, time_seconds ASC LIMIT 1")->fetch(PDO::FETCH_ASSOC);
    $stats['best_run'] = $bestRun ? $bestRun['moves'] . ' moves in ' . $bestRun['time_seconds'] . 's' : 'None yet';

    // Mode distribution
    $stmt = $pdo->query("SELECT mode, COUNT(*) as count FROM leaderboard GROUP BY mode");
    $stats['modes'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($stats);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Analytics failed"]);
}
?>