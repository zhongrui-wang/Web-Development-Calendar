<?php
ini_set("session.cookie_httponly", 1);
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
session_start();
require 'database_ajax.php';
//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

$event_id = $json_obj['event_id'];
$token = $json_obj['token'];
$username = $json_obj['username'];

if(!hash_equals($_SESSION['token'], $token)) {
	die("Request forgery detected");
}

$stmt = $mysqli->prepare("DELETE FROM events WHERE event_id = ? AND username = ?");
if(!$stmt) {
    echo json_encode(array(
		"success" => false
	));
	exit;
}
$stmt->bind_param('is', $event_id, $username);
$stmt->execute();
echo json_encode(array(
    "success" => true
));
exit;
?>