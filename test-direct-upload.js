const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function testImageUpload() {
  try {
    console.log('🧪 Testing image upload to database...\n');

    // Create a small test image (1KB)
    const testImagePath = path.join(__dirname, 'test-image.png');
    const fakeImageBuffer = Buffer.alloc(1024, 255); // 1KB white image data
    fs.writeFileSync(testImagePath, fakeImageBuffer);
    console.log(`1. Created test image: ${testImagePath} (1 KB)`);

    // Connect to database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'coisa_computers'
    });
    console.log('2. Connected to database');

    // Insert test image
    const filename = `${Date.now()}-test-image.png`;
    const base64Data = fakeImageBuffer.toString('base64');
    
    console.log(`3. Inserting image: ${filename}`);
    console.log(`   Size: ${(base64Data.length / 1024).toFixed(2)} KB (base64)`);

    const result = await connection.execute(
      'INSERT INTO uploads (filename, mimeType, data) VALUES (?, ?, ?)',
      [filename, 'image/png', base64Data]
    );

    console.log('4. Insert result:', result[0]);

    if (result[0].affectedRows > 0) {
      console.log(`\n✅ Image inserted successfully!`);
      console.log(`   Insert ID: ${result[0].insertId}`);

      // Verify it's in the database
      const [rows] = await connection.execute(
        'SELECT filename, mimeType, LENGTH(data) as size FROM uploads WHERE filename = ?',
        [filename]
      );

      if (rows.length > 0) {
        console.log(`\n✅ Verified in database:`);
        console.log(`   Filename: ${rows[0].filename}`);
        console.log(`   MIME Type: ${rows[0].mimeType}`);
        console.log(`   Size: ${(rows[0].size / 1024).toFixed(2)} KB`);
        console.log(`\n✅ Image URL would be: /api/uploads/${filename}`);
      }
    }

    await connection.end();
    fs.unlinkSync(testImagePath);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testImageUpload();
