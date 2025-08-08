import { Outlet } from "react-router-dom";
import { Sidebar } from "./ui/sidebar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-200 dark:bg-gray-900">
      <Sidebar />
      {/* Main content */}
      <div className="min-h-screen lg:ml-64">
        <main className="min-h-screen bg-white p-6 dark:bg-gray-800">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
