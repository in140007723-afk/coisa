# Image Storage Setup Guide for Coisa Computers

## Overview

The image system works in 3 layers:

1. **Database Storage** (`uploads` table) - Stores actual image data as base64
2. **Product/Category Records** - Store image URL references  
3. **Image Retrieval API** - Serves images from database via `/api/uploads/[filename]`

## Database Schema (Vercel-Compatible)

### Key Tables

```sql
-- Images table (stores actual image data)
CREATE TABLE IF NOT EXISTS uploads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL UNIQUE,
  mimeType VARCHAR(50) NOT NULL DEFAULT 'image/jpeg',
  data LONGBLOB NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_uploads_filename (filename)
);

-- Products table (stores image references)
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category_id INT DEFAULT NULL,
  category VARCHAR(255) DEFAULT NULL,
  brand VARCHAR(255) DEFAULT '',
  model VARCHAR(255) DEFAULT '',
  description TEXT,
  specifications TEXT,
  price DECIMAL(12,2) DEFAULT 0,
  discount_price DECIMAL(12,2) DEFAULT 0,
  stock_quantity INT DEFAULT 0,
  stock INT DEFAULT 0,
  image VARCHAR(255) DEFAULT '',           -- Legacy field
  image_url VARCHAR(255) DEFAULT '',       -- Current: stores URL like /api/uploads/[filename]
  slug VARCHAR(255) DEFAULT '',
  featured TINYINT(1) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  sku VARCHAR(100) DEFAULT '',
  tags TEXT,
  warranty VARCHAR(255) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_products_category_id (category_id),
  INDEX idx_products_slug (slug)
);

-- Categories table (stores image references)
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image VARCHAR(255) DEFAULT '',           -- Stores URL like /api/uploads/[filename]
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Image Upload Flow

### Step 1: User Uploads Image (Admin Dashboard)
```
Admin selects image file
     ↓
FormData sent to /api/admin/upload
     ↓
uploadStorage.saveUploadedFile(file)
```

### Step 2: Image Saved to Database
```
saveUploadedFile() does:
  1. Generate unique filename: ${Date.now()}-${filename}
  2. Convert file to base64
  3. INSERT into uploads table:
     - filename: "1782991399895-screenshot.png"
     - mimeType: "image/png"
     - data: "iVBORw0KGgoAAAANS..." (base64)
  4. Return: { url: "/api/uploads/1782991399895-screenshot.png" }
```

### Step 3: URL Stored in Product/Category
```
Admin form includes uploaded URL in images array: 
  [ "/api/uploads/1782991399895-screenshot.png" ]
     ↓
Product created with:
  image_url: "/api/uploads/1782991399895-screenshot.png"
```

### Step 4: Frontend Displays Image
```
API returns product with imageUrl: "/api/uploads/1782991399895-screenshot.png"
     ↓
Frontend renders: <img src="/api/uploads/1782991399895-screenshot.png" />
     ↓
Browser requests /api/uploads/1782991399895-screenshot.png
     ↓
Retrieval endpoint extracts filename
     ↓
Queries uploads table for filename
     ↓
Decodes base64 from data column
     ↓
Returns image with proper Content-Type header
```

## Environment Setup

### Local Development (.env.local)
```env
ADMIN_SESSION_SECRET=coisa-admin-secret
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=coisa_computers
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Vercel Production (.env.production - Template)
```env
NEXT_PUBLIC_SITE_URL=https://coisa-five.vercel.app
ADMIN_SESSION_SECRET=coisa-admin-secret
```

**In Vercel Dashboard:**
1. Go to Project Settings → Environment Variables
2. Add for all environments (Production, Preview, Development):
   - `DB_HOST`: Your database host (e.g., `mysql.example.com`)
   - `DB_USER`: Database user
   - `DB_PASSWORD`: Database password
   - `DB_NAME`: `coisa_computers`

## Troubleshooting Images Not Displaying

### Check 1: Verify Database Connection
```bash
# Test endpoint available at:
GET http://localhost:3000/api/debug/db-test

# Should return:
{
  "status": "connected",
  "testQuery": [{"test": 1}],
  "uploadsTableExists": true,
  "env": {...}
}
```

### Check 2: Verify Uploads Table Exists
```sql
-- In phpMyAdmin or MySQL console:
SELECT * FROM coisa_computers.uploads LIMIT 5;

-- Should show uploaded images with filename and base64 data
```

### Check 3: Verify Product Stores Image URL
```sql
-- Check if product has image_url set:
SELECT id, name, image_url FROM coisa_computers.products LIMIT 5;

-- Should return URLs like:
-- id: 1, name: "MacBook Pro", image_url: "/api/uploads/1782991399895-macbook.png"
```

### Check 4: Test Image Retrieval Directly
```bash
# If product has image_url: "/api/uploads/1782991399895-macbook.png"
# Test direct access:
curl -v http://localhost:3000/api/uploads/1782991399895-macbook.png

# Should return:
# HTTP/1.1 200 OK
# Content-Type: image/png
# (binary image data)
```

### Check 5: Check Content Security Policy
```
Expected header in response:
Content-Security-Policy: ... img-src 'self' data: blob: https://*.vercel.app http://localhost:* http://127.0.0.1:* ...
```

## Common Issues & Solutions

### Issue: Images Upload Successfully But Don't Display

**Cause:** Product record not saving image URL

**Fix:**
1. Verify admin form is sending `images` array with URL
2. Check `/api/admin/products` endpoint logs
3. Verify product's `image_url` field is populated:
   ```sql
   SELECT image_url FROM products WHERE id = 1;
   ```

### Issue: 404 Error When Accessing `/api/uploads/[filename]`

**Cause:** Image filename not found in uploads table

**Fix:**
1. Check if uploads table exists:
   ```sql
   SELECT * FROM uploads WHERE filename LIKE '%screenshot%';
   ```
2. Verify filename matches exactly (case-sensitive on some servers)
3. Check database connection in debug endpoint

### Issue: Images Work Locally But Not on Vercel

**Cause:** Database credentials not set or database not accessible from Vercel

**Fix:**
1. Verify all DB_* environment variables set in Vercel dashboard
2. Ensure database is accessible from Vercel IPs (check database firewall)
3. Test database query with debug endpoint on Vercel
4. Check build logs for connection errors

### Issue: Upload Fails with "Database table creation failed"

**Cause:** Database connection lost during upload

**Fix:**
1. Verify database is running
2. Check database credentials in .env.local
3. Run debug endpoint: `/api/debug/db-test`
4. Check database error logs for connection issues

## Vercel Deployment Checklist

- [ ] SQL_SETUP.md executed on remote database
- [ ] Verify `uploads` table exists on remote database
- [ ] Set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME in Vercel dashboard
- [ ] Build completes successfully: `npm run build`
- [ ] Test `/api/debug/db-test` endpoint on Vercel
- [ ] Upload test image via admin dashboard on Vercel
- [ ] Verify image displays on product detail page
- [ ] Check `/api/uploads/[filename]` returns image directly

## Performance Optimization (Optional)

### Image Compression (Future Enhancement)
Currently stores full resolution. Consider adding:
```typescript
// Before storing in database:
import sharp from 'sharp';

const compressed = await sharp(buffer)
  .resize(1920, 1440, { fit: 'inside', withoutEnlargement: true })
  .jpeg({ quality: 80 })
  .toBuffer();
```

### Caching
Images already cached with:
```
Cache-Control: public, max-age=31536000, immutable
```
(1 year cache for immutable filenames)

## Key Files

- `src/lib/upload-storage.ts` - Upload/retrieval logic
- `src/app/api/admin/upload/route.ts` - Upload endpoint
- `src/app/api/uploads/[...fileName]/route.ts` - Retrieval endpoint
- `src/app/api/debug/db-test/route.ts` - Database test endpoint
- `SQL_SETUP.md` - Database schema setup
