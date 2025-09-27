<?php
// StreetConnect Authentication System
// Simple PHP backend for user authentication

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Database configuration (for MySQL)
$db_config = [
    'host' => 'localhost',
    'username' => 'root',
    'password' => '',
    'database' => 'streetconnect'
];

// Initialize response array
$response = [
    'success' => false,
    'message' => '',
    'data' => null
];

// Function to connect to database
function connectDB($config) {
    try {
        $pdo = new PDO(
            "mysql:host={$config['host']};dbname={$config['database']};charset=utf8mb4",
            $config['username'],
            $config['password'],
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        return null;
    }
}

// Function to hash password
function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

// Function to verify password
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

// Function to generate JWT token (simplified)
function generateToken($user_id, $email) {
    $payload = [
        'user_id' => $user_id,
        'email' => $email,
        'iat' => time(),
        'exp' => time() + (60 * 60 * 24) // 24 hours
    ];
    
    // In production, use a proper JWT library
    return base64_encode(json_encode($payload));
}

// Function to validate token
function validateToken($token) {
    try {
        $payload = json_decode(base64_decode($token), true);
        if ($payload && $payload['exp'] > time()) {
            return $payload;
        }
    } catch (Exception $e) {
        return false;
    }
    return false;
}

// Handle different request types
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'register':
        handleRegistration();
        break;
    case 'login':
        handleLogin();
        break;
    case 'logout':
        handleLogout();
        break;
    case 'verify':
        handleTokenVerification();
        break;
    default:
        $response['message'] = 'Invalid action';
        break;
}

function handleRegistration() {
    global $response, $db_config;
    
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        $response['message'] = 'Method not allowed';
        echo json_encode($response);
        return;
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate input
    if (!isset($input['name']) || !isset($input['email']) || !isset($input['password']) || !isset($input['phone'])) {
        $response['message'] = 'Missing required fields';
        echo json_encode($response);
        return;
    }
    
    $name = trim($input['name']);
    $email = trim($input['email']);
    $password = $input['password'];
    $phone = trim($input['phone']);
    $vendor_type = $input['vendor_type'] ?? 'street-food';
    
    // Basic validation
    if (strlen($name) < 2) {
        $response['message'] = 'Name must be at least 2 characters long';
        echo json_encode($response);
        return;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Invalid email format';
        echo json_encode($response);
        return;
    }
    
    if (strlen($password) < 6) {
        $response['message'] = 'Password must be at least 6 characters long';
        echo json_encode($response);
        return;
    }
    
    // Connect to database
    $pdo = connectDB($db_config);
    if (!$pdo) {
        $response['message'] = 'Database connection failed';
        echo json_encode($response);
        return;
    }
    
    try {
        // Check if user already exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        
        if ($stmt->fetch()) {
            $response['message'] = 'User with this email already exists';
            echo json_encode($response);
            return;
        }
        
        // Insert new user
        $hashed_password = hashPassword($password);
        $stmt = $pdo->prepare("
            INSERT INTO users (name, email, password, phone, vendor_type, created_at) 
            VALUES (?, ?, ?, ?, ?, NOW())
        ");
        
        $stmt->execute([$name, $email, $hashed_password, $phone, $vendor_type]);
        $user_id = $pdo->lastInsertId();
        
        // Generate token
        $token = generateToken($user_id, $email);
        
        $response['success'] = true;
        $response['message'] = 'Registration successful';
        $response['data'] = [
            'user_id' => $user_id,
            'name' => $name,
            'email' => $email,
            'token' => $token
        ];
        
    } catch (PDOException $e) {
        $response['message'] = 'Registration failed: ' . $e->getMessage();
    }
    
    echo json_encode($response);
}

function handleLogin() {
    global $response, $db_config;
    
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        $response['message'] = 'Method not allowed';
        echo json_encode($response);
        return;
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate input
    if (!isset($input['email']) || !isset($input['password'])) {
        $response['message'] = 'Email and password are required';
        echo json_encode($response);
        return;
    }
    
    $email = trim($input['email']);
    $password = $input['password'];
    
    // Connect to database
    $pdo = connectDB($db_config);
    if (!$pdo) {
        $response['message'] = 'Database connection failed';
        echo json_encode($response);
        return;
    }
    
    try {
        // Find user
        $stmt = $pdo->prepare("SELECT id, name, email, password, vendor_type FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if (!$user) {
            $response['message'] = 'Invalid email or password';
            echo json_encode($response);
            return;
        }
        
        // Verify password
        if (!verifyPassword($password, $user['password'])) {
            $response['message'] = 'Invalid email or password';
            echo json_encode($response);
            return;
        }
        
        // Generate token
        $token = generateToken($user['id'], $user['email']);
        
        // Update last login
        $stmt = $pdo->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
        $stmt->execute([$user['id']]);
        
        $response['success'] = true;
        $response['message'] = 'Login successful';
        $response['data'] = [
            'user_id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'vendor_type' => $user['vendor_type'],
            'token' => $token
        ];
        
    } catch (PDOException $e) {
        $response['message'] = 'Login failed: ' . $e->getMessage();
    }
    
    echo json_encode($response);
}

function handleLogout() {
    global $response;
    
    // In a real application, you might want to blacklist the token
    // For now, we'll just return success
    $response['success'] = true;
    $response['message'] = 'Logout successful';
    
    echo json_encode($response);
}

function handleTokenVerification() {
    global $response, $db_config;
    
    $headers = getallheaders();
    $token = $headers['Authorization'] ?? '';
    
    if (!$token) {
        $response['message'] = 'No token provided';
        echo json_encode($response);
        return;
    }
    
    // Remove 'Bearer ' prefix if present
    $token = str_replace('Bearer ', '', $token);
    
    $payload = validateToken($token);
    if (!$payload) {
        $response['message'] = 'Invalid or expired token';
        echo json_encode($response);
        return;
    }
    
    // Connect to database
    $pdo = connectDB($db_config);
    if (!$pdo) {
        $response['message'] = 'Database connection failed';
        echo json_encode($response);
        return;
    }
    
    try {
        // Get user data
        $stmt = $pdo->prepare("SELECT id, name, email, vendor_type FROM users WHERE id = ?");
        $stmt->execute([$payload['user_id']]);
        $user = $stmt->fetch();
        
        if (!$user) {
            $response['message'] = 'User not found';
            echo json_encode($response);
            return;
        }
        
        $response['success'] = true;
        $response['message'] = 'Token valid';
        $response['data'] = $user;
        
    } catch (PDOException $e) {
        $response['message'] = 'Token verification failed: ' . $e->getMessage();
    }
    
    echo json_encode($response);
}

// Database schema (run this in MySQL to create tables)
/*
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    vendor_type ENUM('street-food', 'restaurant', 'catering', 'other') DEFAULT 'street-food',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    supplier_id INT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    payment_method VARCHAR(50),
    delivery_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
*/
?> 