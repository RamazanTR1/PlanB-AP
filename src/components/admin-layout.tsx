import { Outlet } from "react-router-dom";
import { Sidebar } from "./ui/sidebar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Main content */}
      <div className="lg:ml-64 min-h-screen">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
