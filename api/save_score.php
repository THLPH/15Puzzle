<?php
header("Content-Type: application/json");
require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['player'], $data['mode'], $data['moves'], $data['time'])) {
    
    $player = htmlspecialchars(strip_tags($data['player']));
    $mode = htmlspecialchars(strip_tags($data['mode']));
    $moves = filter_var($data['moves'], FILTER_VALIDATE_INT);
    $time = filter_var($data['time'], FILTER_VALIDATE_INT);

    if ($moves !== false && $time !== false) {
        $stmt = $pdo->prepare("INSERT INTO leaderboard (player_name, mode, moves, time_seconds) VALUES (?, ?, ?, ?)");
        
        if ($stmt->execute([$player, $mode, $moves, $time])) {
            echo json_encode(["status" => "success"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to save score"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Invalid data format"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields"]);
}
?>