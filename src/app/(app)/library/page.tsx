import Link from "next/link";
import { getDashboardData } from "@/app/actions/get-dashboard";

export default async function LibraryPage() {
  const data = await getDashboardData();
  const courses = data?.courses || [];

  return (
    <div className="p-12 space-y-12 max-w-[1400px] w-full mx-auto relative z-10">
      <header className="space-y-4">
        <h1 className="text-5xl font-bold text-white font-headline tracking-tighter">My Library</h1>
        <p className="text-[#919191] text-lg max-w-2xl font-light">
          Manage and edit your published courses from your private library center.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course: any) => (
          <div key={course.id} className="bg-[#262626]/40 backdrop-blur-xl border border-[#cafd00]/10 rounded-3xl overflow-hidden group hover:border-[#cafd00]/30 transition-all duration-500">
            <div className="aspect-video bg-[#111] relative overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(202,253,0,0.1)_0%,transparent_70%)] animate-pulse"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-[#cafd00]/20">menu_book</span>
               </div>
               <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold text-[#fedc00] uppercase tracking-widest">
                 {course.is_free ? 'Free' : `$${course.price}`}
               </div>
            </div>
            <div className="p-8 space-y-4">
              <h3 className="text-xl font-bold text-white font-headline tracking-tight group-hover:text-[#cafd00] transition-colors">{course.title}</h3>
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-[#666]">
                 <span>{course.modules_count} Modules</span>
                 <span>{new Date(course.created_at).toLocaleDateString()}</span>
              </div>
              <div className="pt-4 flex gap-3">
                <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/5 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest text-white transition-all">Edit Course</button>
                <button className="w-12 h-12 bg-[#cafd00]/10 hover:bg-[#cafd00] flex items-center justify-center rounded-full text-[#cafd00] hover:text-[#516700] transition-all border border-[#cafd00]/20">
                  <span className="material-symbols-outlined">visibility</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        <Link href="/create-course" className="border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center aspect-[4/5] hover:border-[#cafd00]/20 transition-all group">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-[#cafd00]/20 group-hover:scale-110 transition-all">
               <span className="material-symbols-outlined text-white/20 group-hover:text-[#cafd00]">add</span>
            </div>
            <span className="mt-6 text-[11px] font-bold uppercase tracking-widest text-[#666]">Create New Course</span>
        </Link>
      </div>

      {courses.length === 0 && (
        <div className="text-center py-20 bg-[#111]/50 rounded-3xl border border-dashed border-white/5">
             <span className="material-symbols-outlined text-6xl text-[#333] mb-4">folder_off</span>
             <h3 className="text-xl font-bold text-white mb-2">Library is empty</h3>
             <p className="text-[#666] text-sm">Upload your first course to see it here.</p>
        </div>
      )}
    </div>
  );
}
