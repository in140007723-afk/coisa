const mysql = require('mysql2/promise');

async function checkUploads() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'coisa_computers'
    });

    // Check uploads table
    const [uploads] = await connection.execute(
      'SELECT COUNT(*) as total_images FROM uploads'
    );
    console.log('\n📁 UPLOADS TABLE:');
    console.log('Total images in database:', uploads[0].total_images);

    if (uploads[0].total_images > 0) {
      const [images] = await connection.execute(
        'SELECT filename, mimeType, LENGTH(data) as size_bytes, createdAt FROM uploads ORDER BY createdAt DESC LIMIT 5'
      );
      console.log('\nRecent uploads:');
      images.forEach((img, i) => {
        console.log(`  ${i+1}. ${img.filename}`);
        console.log(`     Type: ${img.mimeType}, Size: ${(img.size_bytes / 1024).toFixed(2)} KB`);
        console.log(`     Uploaded: ${img.createdAt}`);
      });
    } else {
      console.log('⚠️  No images in uploads table yet');
    }

    // Check products table for image_url
    const [products] = await connection.execute(
      'SELECT COUNT(*) as total_products, COUNT(image_url) as products_with_images FROM products WHERE image_url != "" AND image_url IS NOT NULL'
    );
    console.log('\n📦 PRODUCTS TABLE:');
    console.log('Total products:', products[0].total_products);
    console.log('Products with images:', products[0].products_with_images);

    if (products[0].products_with_images > 0) {
      const [prods] = await connection.execute(
        'SELECT id, name, image_url FROM products WHERE image_url != "" AND image_url IS NOT NULL LIMIT 5'
      );
      console.log('\nProducts with images:');
      prods.forEach((prod) => {
        console.log(`  - ${prod.name}`);
        console.log(`    URL: ${prod.image_url}`);
      });
    }

    // Check categories table for images
    const [cats] = await connection.execute(
      'SELECT COUNT(*) as total_categories, COUNT(image) as cats_with_images FROM categories WHERE image != "" AND image IS NOT NULL'
    );
    console.log('\n🏷️  CATEGORIES TABLE:');
    console.log('Total categories:', cats[0].total_categories);
    console.log('Categories with images:', cats[0].cats_with_images);

    if (cats[0].cats_with_images > 0) {
      const [catData] = await connection.execute(
        'SELECT id, name, image FROM categories WHERE image != "" AND image IS NOT NULL LIMIT 5'
      );
      console.log('\nCategories with images:');
      catData.forEach((cat) => {
        console.log(`  - ${cat.name}`);
        console.log(`    URL: ${cat.image}`);
      });
    }

    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkUploads();
