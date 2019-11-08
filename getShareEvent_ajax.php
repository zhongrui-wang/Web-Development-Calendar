<?php
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
session_start();
require 'database_ajax.php';
//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

$event_date = $json_obj['sqldate'];
$username = $_SESSION['user_name'];

$stmt = $mysqli->prepare("SELECT event_title, event_time, event_id FROM events WHERE friendname=? and event_date=?");
if(!$stmt){
    echo json_encode(array(
        "success" => false,
        "message" => "Connection to database fail!"
    ));
    exit;  
}
$event_titles = array();
$event_times = array();
$event_ids = array();
$stmt->bind_param('ss', $username, $event_date);
$stmt->execute();
$stmt->bind_result($event_title, $event_time, $event_id);
while($stmt->fetch()){
    $event_titles[] = htmlentities($event_title); 
    $event_times[] = htmlentities($event_time);
    $event_ids[] = htmlentities($event_id);
}
$stmt->close();

echo json_encode(array(
    "success" => true,
    "date" => $event_date,
    "event_times" => $event_times,
    "event_titles" => $event_titles,
    "event_ids" => $event_ids,
    "username" => $username,
));
exit;  

?>