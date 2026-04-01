"use server";

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function getDashboardData() {
  try {
    const courses = await sql`
      SELECT id, title, price, is_free, created_at, image_url,
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
        totalStudents: 0,
      }
    };
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    return null;
  }
}

export async function getCourseById(id: string) {
  try {
    const [course] = await sql`SELECT * FROM courses WHERE id = ${id}`;
    const modules = await sql`SELECT * FROM modules WHERE course_id = ${id} ORDER BY order_index ASC`;
    
    // Fetch lessons for each module
    const modulesWithLessons = await Promise.all(modules.map(async (mod) => {
      const lessons = await sql`SELECT * FROM lessons WHERE module_id = ${mod.id} ORDER BY order_index ASC`;
      return { ...mod, lessons };
    }));

    return { ...course, modules: modulesWithLessons };
  } catch (error) {
    console.error('Failed to fetch course details:', error);
    return null;
  }
}
