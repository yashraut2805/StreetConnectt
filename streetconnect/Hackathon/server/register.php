<?php
$conn = new mysqli("localhost", "root", "", "streetconnect");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = $_POST["name"];
    $email = $_POST["email"];
    $password = password_hash($_POST["password"], PASSWORD_DEFAULT);
    $pincode = $_POST["pincode"];

    $stmt = $conn->prepare("INSERT INTO users (name, email, password, pincode) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $name, $email, $password, $pincode);

    if ($stmt->execute()) {
        header("Location: ../pages/login.html");
        exit;
    } else {
        echo "Error: " . $stmt->error;
    }
}
?>
