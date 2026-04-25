"use server";

import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';
import { localSql } from '@/lib/local-db';

const dbUrl = process.env.DATABASE_URL;
const sql: any = dbUrl && dbUrl.includes('neon.tech') ? neon(dbUrl) : null;

export async function publishCourseAction(courseData: any) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Tizimga kirish talab qilinadi." };

    if (!sql) {
      // Local xotiraga saqlash
      const newCourse = localSql.insert('courses', {
        title: courseData.title,
        subtitle: courseData.subtitle,
        category_id: courseData.categoryId,
        description: courseData.description,
        image_url: courseData.imageUrl,
        price: courseData.price,
        is_free: courseData.isFree,
        published: true,
        owner_id: user.id
      });

      for (const [mIndex, module] of courseData.modules.entries()) {
        const newModule = localSql.insert('modules', {
          course_id: newCourse.id,
          title: module.title,
          order_index: mIndex
        });

        for (const [lIndex, lesson] of module.lessons.entries()) {
          localSql.insert('lessons', {
            module_id: newModule.id,
            title: lesson.title,
            video_url: lesson.videoUrl,
            content: lesson.content,
            is_free: lesson.isFree,
            order_index: lIndex
          });
        }
      }

      revalidatePath('/dashboard');
      return { success: true, courseId: newCourse.id };
    }

    // Cloud Database Logic
    const [course] = await sql`
      INSERT INTO courses (title, subtitle, category_id, description, image_url, price, is_free, published, owner_id)
      VALUES (${courseData.title}, ${courseData.subtitle || ""}, ${courseData.categoryId}, ${courseData.description}, ${courseData.imageUrl || ""}, ${courseData.price}, ${courseData.isFree}, TRUE, ${user.id})
      RETURNING id;
    `;

    for (const [mIndex, module] of courseData.modules.entries()) {
      const [newModule] = await sql`INSERT INTO modules (course_id, title, order_index) VALUES (${course.id}, ${module.title}, ${mIndex}) RETURNING id;`;
      for (const [lIndex, lesson] of module.lessons.entries()) {
        await sql`INSERT INTO lessons (module_id, title, video_url, content, is_free, order_index) VALUES (${newModule.id}, ${lesson.title}, ${lesson.videoUrl || ""}, ${lesson.content || ""}, ${lesson.isFree || false}, ${lIndex});`;
      }
    }

    revalidatePath('/dashboard');
    return { success: true, courseId: course.id };
  } catch (error) {
    console.error('Failed to publish course:', error);
    return { success: false, error: "Kutilmagan xatolik yuz berdi." };
  }
}
