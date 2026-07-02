# Coisa Computers

A Next.js app for Coisa Computers with a public product catalog, admin dashboard, and MySQL-backed content management.

## Setup

1. Copy [.env.local.example](.env.local.example) to `.env.local`
2. Create the MySQL schema from [SQL_SETUP.md](SQL_SETUP.md)
3. Run the app:

```bash
npm install
npm run dev
```

## Environment variables

```env
ADMIN_SESSION_SECRET=coisa-admin-secret
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=coisa_computers
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Deploy to Vercel + Railway

1. Create a MySQL database on Railway and import the schema from [SQL_SETUP.md](SQL_SETUP.md)
2. Deploy this repository to Vercel
3. Add the same environment variables in Vercel under Project Settings > Environment Variables
4. Set the production site URL to your Vercel domain

> The app currently stores uploaded files under `public/uploads`. That works locally, but on serverless hosting those files are not durable across redeploys. For production image persistence, a cloud storage option such as Cloudinary or S3 should be added later.

## Features

- **Product Catalog** - Browse and search products by category
- **Admin Dashboard** - Manage products, inquiries, and users
- **File Upload** - Upload product images and documents
- **Inquiry Management** - Handle customer inquiries
- **Responsive Design** - Works on desktop and mobile devices
