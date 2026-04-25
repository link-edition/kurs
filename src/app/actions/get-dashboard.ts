"use server";

import { neon } from '@neondatabase/serverless';
import { getCurrentUser } from "@/lib/auth";
import { localSql } from "@/lib/local-db";

const dbUrl = process.env.DATABASE_URL;
const sql: any = dbUrl && dbUrl.includes('neon.tech') ? neon(dbUrl) : null;

export async function getDashboardData() {
  try {
    const user = await getCurrentUser();
    // Agar user login bo'lmagan bo'lsa ham lokal ma'lumotlarni ko'rsataveramiz
    // (Lokal rivojlanish uchun qulaylik)

    if (!sql) {
      const allCourses = localSql.select('courses');
      const allUsers = localSql.select('users');

      // Agar login bo'lgan bo'lsa va admin bo'lmasa, filtrlaymiz. 
      // Login bo'lmagan bo'lsa hamma kursni ko'rsatamiz.
      const userCourses = (user && user.role !== 'admin') 
        ? allCourses.filter((c: any) => c.owner_id === user.id)
        : allCourses;

      const totalRevenue = userCourses.reduce((sum: number, c: any) => sum + (parseFloat(c.price) || 0), 0);
      const totalStudents = allUsers.filter((u: any) => u.role === 'student').length;

      return {
        courses: userCourses,
        stats: {
          totalRevenue: Math.round(totalRevenue),
          totalCourses: userCourses.length,
          totalStudents
        }
      };
    }

      // Cloud Database Logic
      const userId = user?.id || 'guest';
      const courses = await sql`SELECT * FROM courses WHERE owner_id = ${userId} ORDER BY created_at DESC`;
      const [rev] = await sql`SELECT SUM(price) as total FROM courses WHERE owner_id = ${userId}`;
      const [counts] = await sql`SELECT COUNT(*) as count FROM courses WHERE owner_id = ${userId}`;
    
    return {
      courses,
      stats: {
        totalRevenue: parseFloat(rev?.total || 0),
        totalCourses: parseInt(counts?.count || 0),
        totalStudents: 0 // Will implement with enrollments table later
      }
    };
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    return null;
  }
}

export async function getCourseById(id: string) {
  try {
    if (!sql) {
      const course = localSql.select('courses', (c) => c.id === id)[0];
      if (!course) return null;
      const modules = localSql.select('modules', (m) => m.course_id === id);
      const modulesWithLessons = modules.map((mod: any) => {
        const lessons = localSql.select('lessons', (l) => l.module_id === mod.id);
        return { ...mod, lessons };
      });
      return { ...course, modules: modulesWithLessons };
    }

    const [course] = await sql`SELECT * FROM courses WHERE id = ${id}`;
    if (!course) return null;
    const modules = await sql`SELECT * FROM modules WHERE course_id = ${id} ORDER BY order_index ASC`;
    const modulesWithLessons = await Promise.all(modules.map(async (mod: any) => {
      const lessons = await sql`SELECT * FROM lessons WHERE module_id = ${mod.id} ORDER BY order_index ASC`;
      return { ...mod, lessons };
    }));
    return { ...course, modules: modulesWithLessons };
  } catch (error) {
    return null;
  }
}
