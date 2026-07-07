const mysql = require('mysql2/promise');

async function createUploadsTable() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'coisa_computers'
    });

    console.log('Creating uploads table...');
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS uploads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        mimeType VARCHAR(50) NOT NULL DEFAULT 'image/jpeg',
        data LONGBLOB NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_uploads_filename (filename)
      )
    `);

    console.log('✅ Uploads table created successfully!');

    // Verify it exists
    const [tables] = await connection.execute(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'coisa_computers' AND TABLE_NAME = 'uploads'"
    );

    if (tables.length > 0) {
      console.log('✅ Verified: uploads table exists in database');
    }

    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createUploadsTable();
