"use server";

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function getDashboardData() {
  try {
    const courses = await sql`
      SELECT id, title, price, is_free, created_at, 
      (SELECT COUNT(*) FROM modules WHERE course_id = courses.id) as modules_count
      FROM courses 
      ORDER BY created_at DESC;
    `;

    const totalRevenue = await sql`SELECT SUM(price) as total FROM courses WHERE published = TRUE`;
    const totalCourses = await sql`SELECT COUNT(*) as count FROM courses`;

    return {
      courses,
      stats: {
        totalRevenue: totalRevenue[0]?.total || 0,
        totalCourses: totalCourses[0]?.count || 0,
        totalStudents: 12840, // Static for now until Auth
      }
    };
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    return null;
  }
}
