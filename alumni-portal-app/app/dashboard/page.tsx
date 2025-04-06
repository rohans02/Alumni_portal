import { UserButton } from "@clerk/nextjs";
import { getCurrentRole, checkNoRole } from "@/lib/roles";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AlumniDashboard from "@/components/alumni/AlumniDashboard";
import StudentDashboard from "@/components/student/StudentDashboard";

// Make this page dynamic to prevent caching
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export default async function Page() {
  console.log("Dashboard page rendering...");

  // Check if user has no role, and redirect to profile creation
  if (await checkNoRole()) {
    console.log("No role found, redirecting to create-profile...");
    redirect("/create-profile");
  }

  // Get current user role
  const role = await getCurrentRole();
  console.log("Current role:", role);

  if (role === null) {
    console.log("Role still undefined, redirecting to create-profile...");
    redirect("/create-profile");
  }
  
  // Render different dashboards based on role
  switch (role) {
    case "admin":
      return <AdminDashboard />;
    
    case "student":
      return <StudentDashboard />;
    
    case "alumni":
      return <AlumniDashboard />;
    
    default:
      return (
        <>
          <UserButton />
        </>
      );
  }
}
