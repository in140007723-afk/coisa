const mysql = require('mysql2/promise');
const path = require('path');

async function migrateExistingImages() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'coisa_computers'
    });

    console.log('📋 Checking for orphaned image references...\n');

    // Get all unique image URLs from products and categories
    const [productImages] = await connection.execute(
      "SELECT DISTINCT image_url FROM products WHERE image_url LIKE '/uploads/%' AND image_url != ''"
    );

    const [categoryImages] = await connection.execute(
      "SELECT DISTINCT image FROM categories WHERE image LIKE '/uploads/%' AND image != ''"
    );

    const allImages = [
      ...productImages.map(p => p.image_url),
      ...categoryImages.map(c => c.image)
    ];

    console.log(`Found ${allImages.length} image references in database:`);
    allImages.forEach(img => console.log(`  - ${img}`));

    // Extract filenames and check if they exist in uploads table
    console.log('\n📁 Checking which images exist in uploads table...\n');

    for (const imageUrl of allImages) {
      const filename = imageUrl.replace('/uploads/', '');
      const [existsInDb] = await connection.execute(
        'SELECT COUNT(*) as cnt FROM uploads WHERE filename = ?',
        [filename]
      );

      const status = existsInDb[0].cnt > 0 ? '✅' : '❌';
      console.log(`${status} ${filename}`);
    }

    // Get filenames that need to be in database
    const orphanedFilenames = [];
    for (const imageUrl of allImages) {
      const filename = imageUrl.replace('/uploads/', '');
      const [existsInDb] = await connection.execute(
        'SELECT COUNT(*) as cnt FROM uploads WHERE filename = ?',
        [filename]
      );
      if (existsInDb[0].cnt === 0) {
        orphanedFilenames.push(filename);
      }
    }

    console.log(`\n⚠️  ${orphanedFilenames.length} images need to be migrated to database`);
    console.log(`\nTo fix this, you need to:`);
    console.log(`1. Re-upload images through admin dashboard, OR`);
    console.log(`2. Migrate images from old storage location (if available)`);
    console.log(`3. Clear old image references and upload new ones`);
    console.log(`\n📝 Orphaned filenames that need images:`);
    orphanedFilenames.forEach(f => console.log(`   - ${f}`));

    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

migrateExistingImages();
