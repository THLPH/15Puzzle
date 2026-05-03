<?php
header("Content-Type: application/json");
require_once 'db.php';

try {
    $stats = [];
    
    // Total runs
    $stats['total_runs'] = $pdo->query("SELECT COUNT(*) FROM leaderboard")->fetchColumn();
    
    // Avg solve time
    $stats['avg_time'] = round($pdo->query("SELECT AVG(time_seconds) FROM leaderboard")->fetchColumn(), 2);
    
    // Mode distribution
    $stmt = $pdo->query("SELECT mode, COUNT(*) as count FROM leaderboard GROUP BY mode");
    $stats['modes'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($stats);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Analytics failed"]);
}
?>