const mysql = require('mysql2/promise');

(async () => {
  const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', multipleStatements: true });
  await conn.query('CREATE DATABASE IF NOT EXISTS coisa_computers; USE coisa_computers;');
  await conn.query(`CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile_image VARCHAR(255) DEFAULT '',
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`);
  await conn.query(`CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255) DEFAULT '',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`);
  await conn.query(`CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id INT DEFAULT NULL,
    brand VARCHAR(255) DEFAULT '',
    model VARCHAR(255) DEFAULT '',
    description TEXT,
    specifications TEXT,
    price DECIMAL(10,2) DEFAULT 0,
    discount_price DECIMAL(10,2) DEFAULT 0,
    stock_quantity INT DEFAULT 0,
    image VARCHAR(255) DEFAULT '',
    featured TINYINT(1) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    sku VARCHAR(100) DEFAULT '',
    tags TEXT,
    warranty VARCHAR(255) DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`);
  await conn.query(`CREATE TABLE IF NOT EXISTS product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`);
  await conn.query(`CREATE TABLE IF NOT EXISTS enquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) DEFAULT '',
    product_id INT DEFAULT NULL,
    subject VARCHAR(255) DEFAULT '',
    message TEXT,
    status VARCHAR(50) DEFAULT 'New',
    admin_reply TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`);
  await conn.query(`INSERT INTO admins (name, email, password, role)
    VALUES ('System Admin','admin@coisa.com','$2a$10$kOE4nJMaFhGmUF7gGQknQeTKnYpG4V2G1Q4dWnEMPhcgYqQj8bJX2','admin')
    ON DUPLICATE KEY UPDATE email=email`);
  const [rows] = await conn.query('SHOW TABLES');
  console.log('TABLES_OK');
  console.log(rows.map((row) => Object.values(row)[0]).join(', '));
  await conn.end();
})().catch((err) => {
  console.error('SCHEMA_SETUP_FAILED');
  console.error(err.message);
  process.exit(1);
});
