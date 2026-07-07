const mysql = require('mysql2/promise');

// Minimal valid PNG (1x1 gray pixel) - base64 encoded
const MINIMAL_PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';

// Simple JPEG header (minimal valid JPEG)
const MINIMAL_JPEG = '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=';

async function createPlaceholderImages() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'coisa_computers'
    });

    console.log('🎨 Generating placeholder images for orphaned references...\n');

    // Get orphaned filenames
    const [productImages] = await connection.execute(
      "SELECT DISTINCT image_url FROM products WHERE image_url LIKE '/uploads/%' AND image_url != ''"
    );
    const [categoryImages] = await connection.execute(
      "SELECT DISTINCT image FROM categories WHERE image LIKE '/uploads/%' AND image != ''"
    );

    const orphanedFilenames = new Set([
      ...productImages.map(p => p.image_url.replace('/uploads/', '')),
      ...categoryImages.map(c => c.image.replace('/uploads/', ''))
    ]);

    console.log(`Creating ${orphanedFilenames.size} placeholder images...\n`);

    let created = 0;

    for (const filename of orphanedFilenames) {
      try {
        // Check if already exists
        const [exists] = await connection.execute(
          'SELECT id FROM uploads WHERE filename = ?',
          [filename]
        );

        if (exists.length > 0) {
          console.log(`⏭️  ${filename} - already exists`);
          continue;
        }

        // Determine MIME type and placeholder data from filename
        let mimeType, placeholderData;
        if (filename.endsWith('.png')) {
          mimeType = 'image/png';
          placeholderData = MINIMAL_PNG;
        } else if (filename.endsWith('.webp')) {
          mimeType = 'image/webp';
          placeholderData = MINIMAL_JPEG; // Use JPEG as fallback
        } else {
          mimeType = 'image/jpeg';
          placeholderData = MINIMAL_JPEG;
        }

        // Insert into database
        await connection.execute(
          'INSERT INTO uploads (filename, mimeType, data) VALUES (?, ?, ?)',
          [filename, mimeType, placeholderData]
        );

        console.log(`✅ ${filename} - created (${(placeholderData.length / 1024).toFixed(2)} KB base64)`);
        created++;

      } catch (err) {
        if (err.message.includes('Duplicate entry')) {
          console.log(`⏭️  ${filename} - already exists`);
        } else {
          console.log(`❌ ${filename} - error: ${err.message}`);
        }
      }
    }

    console.log(`\n✅ Created ${created}/${orphanedFilenames.size} placeholder images!`);
    console.log('\n📝 Next steps:');
    console.log('1. Images should now display (as minimal placeholders)');
    console.log('2. Go to admin dashboard to re-upload actual product/category images');
    console.log('3. When you upload, it will replace placeholders with real images');

    await connection.end();

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createPlaceholderImages();

createPlaceholderImages();
