<?php
ini_set("session.cookie_httponly", 1);
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
session_start();
require 'database_ajax.php';
//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);
date_default_timezone_set('America/Chicago');
$event_title = $json_obj['event_title'];
$rawdate = $json_obj['date'];
$rawtime = $json_obj['time'];
$urgent = $json_obj['urgent'];
$username = $_SESSION['user_name'];
$teammate = $json_obj['teammate'];
$token = $json_obj['token'];

if(!hash_equals($_SESSION['token'], $token)) {
	die("Request forgery detected");
}

if($event_title == ""){//check if inputs have void event name
    echo json_encode(array(
        "success" => false,
        "message" => "Missing event name!"
    ));
    exit;  
}
else{
    $date = date('Y-m-d', strtotime($rawdate)); //transfer date
    $time = date('H:i:s', strtotime($rawtime)); //transfer time
    $stmt = $mysqli->prepare("INSERT INTO events (username, teammate, event_title, event_date, event_time, is_urgent) VALUES (?, ?, ?, ?, ?, ?)");
	if(!$stmt){
        echo json_encode(array(
            "success" => false,
            "message" => "Connection to database fail!"
        ));
        exit;  
    }
	$stmt->bind_param('ssssss', $teammate, $username, $event_title, $date, $time, $urgent);
	$stmt->execute();
    $stmt->close();
    $stmt = $mysqli->prepare("INSERT INTO events (username, teammate, event_title, event_date, event_time, is_urgent) VALUES (?, ?, ?, ?, ?, ?)");
	if(!$stmt){
        echo json_encode(array(
            "success" => false,
            "message" => "Connection to database fail!"
        ));
        exit;  
    }
	$stmt->bind_param('ssssss', $username, $teammate, $event_title, $date, $time, $urgent);
	$stmt->execute();
    $stmt->close();
    echo json_encode(array(
        "success" => true,
        "date" => $rawdate,
        "time" => $time,
        "event" => $event_title,
        "urgent" => $urgent
    ));
    exit;  
}
?>