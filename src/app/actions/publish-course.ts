"use server";

import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';

const sql = neon(process.env.DATABASE_URL!);

export async function publishCourseAction(courseData: any) {
  try {
    // 1. Insert course
    const [course] = await sql`
      INSERT INTO courses (title, subtitle, category_id, description, image_url, price, is_free, published)
      VALUES (
        ${courseData.title}, 
        ${courseData.subtitle || ""}, 
        ${courseData.categoryId}, 
        ${courseData.description}, 
        ${courseData.imageUrl || ""}, 
        ${courseData.price}, 
        ${courseData.isFree}, 
        TRUE
      )
      RETURNING id;
    `;

    // 2. Insert modules and lessons
    for (const [mIndex, module] of courseData.modules.entries()) {
      const [newModule] = await sql`
        INSERT INTO modules (course_id, title, order_index)
        VALUES (${course.id}, ${module.title}, ${mIndex})
        RETURNING id;
      `;

      for (const [lIndex, lesson] of module.lessons.entries()) {
        await sql`
          INSERT INTO lessons (module_id, title, video_url, content, is_free, order_index)
          VALUES (${newModule.id}, ${lesson.title}, ${lesson.videoUrl || ""}, ${lesson.content || ""}, ${lesson.isFree || false}, ${lIndex});
        `;
      }
    }

    revalidatePath('/dashboard');
    return { success: true, courseId: course.id };
  } catch (error) {
    console.error('Failed to publish course:', error);
    return { success: false, error: "Database transition failed." };
  }
}
