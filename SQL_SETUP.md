# Coisa Computers Admin Dashboard Database Setup

Use the following SQL script in XAMPP MySQL/phpMyAdmin to create the required tables.

```sql
CREATE DATABASE IF NOT EXISTS coisa_computers;
USE coisa_computers;

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  profile_image VARCHAR(255) DEFAULT '',
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image VARCHAR(255) DEFAULT '',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  -- canonical FK to categories
  category_id INT DEFAULT NULL,
  -- human readable category name (kept for compatibility with older code)
  category VARCHAR(255) DEFAULT NULL,
  -- brand/model
  brand VARCHAR(255) DEFAULT '',
  model VARCHAR(255) DEFAULT '',
  description TEXT,
  -- free-form specifications / JSON/text
  specifications TEXT,
  price DECIMAL(12,2) DEFAULT 0,
  discount_price DECIMAL(12,2) DEFAULT 0,
  -- use both naming variants to be resilient to code expectations
  stock_quantity INT DEFAULT 0,
  stock INT DEFAULT 0,
  -- image fields (single primary image and optional image_url name)
  image VARCHAR(255) DEFAULT '',
  image_url VARCHAR(255) DEFAULT '',
  -- slug and featured/status
  slug VARCHAR(255) DEFAULT '',
  featured TINYINT(1) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  sku VARCHAR(100) DEFAULT '',
  tags TEXT,
  warranty VARCHAR(255) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- optional: index on category_id and slug for faster lookups
  INDEX idx_products_category_id (category_id),
  INDEX idx_products_slug (slug)
);

CREATE TABLE IF NOT EXISTS product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  image VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS enquiries (
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
);

-- Uploads table for storing image data (Vercel-compatible)
CREATE TABLE IF NOT EXISTS uploads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL UNIQUE,
  mimeType VARCHAR(50) NOT NULL DEFAULT 'image/jpeg',
  data LONGBLOB NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_uploads_filename (filename)
);

INSERT INTO admins (name, email, password, role)
VALUES (
  'System Admin',
  'coisacomputers@gmail.com',
  '$2a$10$kOE4nJMaFhGmUF7gGQknQeTKnYpG4V2G1Q4dWnEMPhcgYqQj8bJX2',
  'admin'
) ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  password = VALUES(password),
  role = VALUES(role);
```

## Environment variables

Create a .env.local file in the project root with:

```env
ADMIN_SESSION_SECRET=coisa-admin-secret
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=coisa_computers
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

If you are using XAMPP, keep DB_PASSWORD empty unless you set a password.
