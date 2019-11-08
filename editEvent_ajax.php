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
$event_title = $json_obj['new_eventtitle'];
$rawdate = $json_obj['new_date'];
$rawtime = $json_obj['new_time'];
$urgent = $json_obj['new_urgent'];
$event_id = $json_obj['event_id'];
$token = $json_obj['token'];
$username = $_SESSION['user_name'];

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
    $stmt = $mysqli->prepare("UPDATE events SET event_title=?, event_date=?, event_time=?, is_urgent=? WHERE event_id =? AND username=?");
	if(!$stmt){
        echo json_encode(array(
            "success" => false,
            "message" => "Connection to database fail!"
        ));
        exit;  
    }
    $stmt->bind_param('ssssis', $event_title, $date, $time, $urgent ,$event_id, $username);
    $stmt->execute();
    $stmt->close();
    echo json_encode(array(
        "success" => true,
        "date" => $rawdate
        // "time" => $new_time,
        // "event" => $new_eventtitle
    ));
    exit;  
}

?>