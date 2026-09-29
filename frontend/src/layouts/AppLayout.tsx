import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";

import Sidebar from "../components/layout/Sidebar";

interface UserProfile {
  name?: string;
  email?: string;
  role?: string;
}

function AppLayout() {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("access_token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      const response = await axios.get(
        "http://127.0.0.1:8000/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data.user);
    } catch (error) {
      console.error("Unable to load user profile:", error);
    }
  };

  const formatRole = (role?: string) => {
    if (!role) {
      return "User";
    }

    return role
      .replace("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Application Area */}
      <div className="ml-64 min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-8">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Vrinda
            </h2>

            <p className="text-xs text-slate-500">
              Animal Welfare Management Platform
            </p>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-slate-900">
                {user?.name || "Loading..."}
              </p>

              <p className="text-xs text-slate-500">
                {formatRole(user?.role)}
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;