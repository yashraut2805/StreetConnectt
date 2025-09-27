<?php
session_start();
$conn = new mysqli("localhost", "root", "", "streetconnect");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = $_POST["username"];
    $password = $_POST["password"];

    $stmt = $conn->prepare("SELECT * FROM users WHERE email=? OR username=? LIMIT 1");
    $stmt->bind_param("ss", $username, $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        if (password_verify($password, $row["password"])) {
            $_SESSION["user_id"] = $row["id"];
            $_SESSION["username"] = $row["username"];

            echo "<script>
                    alert('✅ You have logged in successfully!');
                    window.location.href='../index.html';
                  </script>";
        } else {
            echo "<script>alert('❌ Invalid password!'); window.history.back();</script>";
        }
    } else {
        echo "<script>alert('❌ User not found!'); window.history.back();</script>";
    }
}
?>
    