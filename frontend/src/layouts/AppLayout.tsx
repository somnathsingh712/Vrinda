import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <Navbar />

      <main className="ml-64 pt-20">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AppLayout;