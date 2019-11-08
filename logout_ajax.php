<?php
    ini_set("session.cookie_httponly", 1);//HTTP only cookies
    session_start();

    session_destroy();
    
    echo json_encode(array(
		"success" => false
	));
    exit;
?>