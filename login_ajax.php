<?php
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//Variables can be accessed as such:
$username = $json_obj['username'];
$password = $json_obj['password'];
//This is equivalent to what you previously did with $_POST['username'] and $_POST['password']

// Check to see if the username and password are valid.  (You learned how to do this in Module 3.)

require 'database_ajax.php';
$stmt = $mysqli->prepare("SELECT COUNT(*), username, pass_word FROM users WHERE username=?");
if(!$stmt){
    echo json_encode(array(
        "success" => false,
        "message" => "Connection to database fail!"
    ));
    exit;  
}
$stmt->bind_param('s', $username);
$stmt->execute();
$stmt->bind_result($cnt, $user_name, $pass_hashed);
$stmt->fetch();
if($cnt == 1 && password_verify($password, $pass_hashed)){ 
    session_start();
    // $_SESSION['user_Id'] = $user_Id;
    $_SESSION['user_name'] = $user_name;
    $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32));
    echo json_encode(array(
        "success" => true,
        "token" => $_SESSION['token']
    ));
    exit;
}
else{
    echo json_encode(array(
        "success" => false,
        "message" => "Incorrect Username or Password!"
    ));
    exit;    
}
?>