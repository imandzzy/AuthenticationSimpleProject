<?php

header("Cache-Control: no-store, must-revalidate");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$servername = "192.168.1.3";
$usernamelog = "user";
$passwordlog = "password";
$dbname = "mydb";

$conn = mysqli_connect($servername, $usernamelog, $passwordlog, $dbname);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// echo "Connected successfully \n";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $stmt = mysqli_stmt_init($conn);

    if (!$stmt) {
        die("Error " . mysqli_error($conn));
    }

    // Get the JSON data from the request body
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    // echo "Received JSON Data: " . json_encode($data) . "\n";

    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        // echo 'Invalid JSON data';
        exit;
    }

    // Retrieve form data
    $username = $data["username"];
    $password = $data["password"];
    $email = $data["email"];
    $department = $data["department"];
    $selectedCategories = $data["categories"];
    $selectedHobbies = $data["hobbies"];

    // Check if the username or email already exists
    $checkUsernameQuery = "SELECT * FROM users WHERE username = ?";
    $checkEmailQuery = "SELECT * FROM users WHERE email = ?";
    
    if (mysqli_stmt_prepare($stmt, $checkUsernameQuery) && mysqli_stmt_bind_param($stmt, "s", $username)) {
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);

        if (mysqli_num_rows($result) > 0) {
            $response = array("error" => "Username is not unique");
            http_response_code(400); // Set HTTP status code to 400 (Bad Request)
            echo json_encode($response);
            exit;
        }
    }

    if (mysqli_stmt_prepare($stmt, $checkEmailQuery) && mysqli_stmt_bind_param($stmt, "s", $email)) {
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);

        if (mysqli_num_rows($result) > 0) {
            $response = array("error" => "Email is not unique");
            http_response_code(400); // Set HTTP status code to 400 (Bad Request)
            echo json_encode($response);
            exit;
        }
    }

    // Insert data into the database
    $sql = "INSERT INTO users (username, password, email, department) VALUES (?, ?, ?, ?)";

    if (mysqli_stmt_prepare($stmt, $sql)) {
        mysqli_stmt_bind_param($stmt, "ssss", $username, $password, $email, $department);

        if (mysqli_stmt_execute($stmt)) {
            echo "User data submitted successfully \n";
        } else {
            echo "Error: " . mysqli_error($conn);
        }

        // Get the ID of the inserted user
        $userId = mysqli_insert_id($conn);

        foreach ($selectedCategories as $category) {
            $insertCategoryQuery = "INSERT INTO categories (name, user_id) VALUES (?, ?)";
            if (mysqli_stmt_prepare($stmt, $insertCategoryQuery)) {
                mysqli_stmt_bind_param($stmt, "si", $category, $userId);
                mysqli_stmt_execute($stmt);
            }
        }

        foreach ($selectedHobbies as $hobby) {
            $insertHobbyQuery = "INSERT INTO hobbies (name, user_id) VALUES (?, ?)";
            if (mysqli_stmt_prepare($stmt, $insertHobbyQuery)) {
                mysqli_stmt_bind_param($stmt, "si", $hobby, $userId);
                mysqli_stmt_execute($stmt);
            }
        }

        // Debug the selected categories and hobbies
        echo "Selected Categories: ";
        print_r($selectedCategories);

        echo "Selected Hobbies: ";
        print_r($selectedHobbies);
        
    mysqli_stmt_close($stmt);
    
    } else {
        echo "Error: " . mysqli_error($conn);
    }
}
?>