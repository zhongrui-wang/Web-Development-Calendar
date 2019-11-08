<?php
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//Variables can be accessed as such:
$r_username = $json_obj['r_username'];
$r1_password = $json_obj['r1_password'];
$r2_password = $json_obj['r2_password'];

require 'database_ajax.php';
$stmt = $mysqli->prepare("SELECT COUNT(*) FROM users WHERE username=?");
if(!$stmt){
	echo json_encode(array(
        "success" => false,
        "message" => "Incorrect Username or Password!"
    ));
    exit;  
}
$stmt->bind_param('s', $r_username);
$stmt->execute(); 
$stmt->bind_result($countuser);
$stmt->fetch();
$stmt->close();
if($r_username == "" || $r1_password == "" || $r2_password == ""){//check if inputs have void value
    echo json_encode(array(
        "success" => false,
        "message" => "Incorrect Username or Password!"
    ));
    exit;  
}
else{
    if($countuser==0){
        if(strcmp($r1_password, $r2_password) == 0){//check if passwords entered are same  
            $pass_hashed = password_hash($r1_password, PASSWORD_DEFAULT);       
            $stmt = $mysqli->prepare("INSERT INTO users (username, pass_word) VALUES (?, ?)");//insert a new user into table             
            if(!$stmt){
                echo json_encode(array(
                    "success" => false,
                    "message" => "Connection to database fail!"
                ));
                exit;
            }
            $stmt->bind_param('ss',$r_username, $pass_hashed);
            $stmt->execute();
            $stmt->close();
            echo json_encode(array(
                "success" => true,
            ));
            exit;  
        }
        else{
            echo json_encode(array(
                "success" => false,
                "message" => "Make sure enter same password!"
            ));
            exit;  //ask user to make sure entering same password two times
        }        
    }
    else{
        echo json_encode(array(
            "success" => false,
            "message" => "Username already exists!"
        ));
        exit;//ask user to change new username
    }
}
?>