<?php
ini_set("session.cookie_httponly", 1);
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
session_start();
require 'database_ajax.php';
//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);
// date_default_timezone_set('America/Chicago');
$friendname = $json_obj['friendname'];
$username = $_SESSION['user_name'];
$token = $json_obj['token'];

if(!hash_equals($_SESSION['token'], $token)) {
	die("Request forgery detected");
}
// echo $token;

$stmt = $mysqli->prepare("UPDATE events SET friendname=? WHERE username=?");
if(!$stmt){
    echo json_encode(array(
    "success" => false,
    "message" => "Connection to database fail!"
    ));
    exit;  
}
$stmt->bind_param('ss', $friendname, $username);
$stmt->execute();
$stmt->close();
echo json_encode(array(
    "success" => true,
    "message" => "Share succcessfully!"
));
exit;
?>
