import { NextResponse } from "next/server";
import { queryDb } from "@/lib/db";

export async function GET() {
  try {
    // Test basic query
    const result = await queryDb("SELECT 1 as test");
    
    if (!result) {
      return NextResponse.json({
        status: "error",
        message: "Database connection failed - queryDb returned null",
        env: {
          DB_HOST: process.env.DB_HOST,
          DB_USER: process.env.DB_USER,
          DB_NAME: process.env.DB_NAME,
        },
      }, { status: 500 });
    }

    // Check if uploads table exists
    const tableCheck = await queryDb(
      "SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'uploads'",
      [process.env.DB_NAME]
    );

    return NextResponse.json({
      status: "connected",
      testQuery: result,
      uploadsTableExists: tableCheck && tableCheck.length > 0,
      env: {
        DB_HOST: process.env.DB_HOST,
        DB_USER: process.env.DB_USER,
        DB_NAME: process.env.DB_NAME,
      },
    });
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: String(error),
    }, { status: 500 });
  }
}
