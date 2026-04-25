import { Metadata } from "next";
import { readDb } from "@/lib/local-db";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const id = params.id;
  
  // Ma'lumotlarni bazadan o'qish (server-side)
  try {
    const db = readDb();
    const course = db.courses.find((c: any) => c.id === id);
    
    if (!course) {
      return {
        title: "Kurs topilmadi | Course Architect",
      };
    }

    const title = `${course.title} | Course Architect`;
    const description = course.subtitle || course.description || "Professional kurs";
    const image = course.image_url || "/og-image.png"; // Default image if none

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: course.title,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  } catch (error) {
    return {
      title: "Course Architect",
    };
  }
}

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
