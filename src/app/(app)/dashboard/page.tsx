import { getDashboardData } from "@/app/actions/get-dashboard";
import { DashboardClient } from "./DashboardClient";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const data = await getDashboardData();
  const stats = data?.stats || { totalRevenue: 0, totalCourses: 0, totalStudents: 0 };
  const courses = data?.courses || [];

  return <DashboardClient stats={stats} courses={courses} />;
}
