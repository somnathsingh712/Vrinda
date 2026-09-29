import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  User,
  Mail,
  ShieldCheck,
  LogOut,
  CheckCircle,
  Server,
  Database,
  Code2,
  Loader2,
  AlertCircle,
} from "lucide-react";


interface UserProfile {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
}


function Settings() {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    fetchProfile();
  }, []);


  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

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

      /*
       * Backend response:
       *
       * {
       *   message: "Welcome!",
       *   user: current_user
       * }
       */

      setUser(response.data.user);

    } catch (err: any) {
      console.error(
        "Profile fetch error:",
        err
      );

      if (err.response?.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");

        navigate("/login", {
          replace: true,
        });

        return;
      }

      setError(
        err.response?.data?.detail ||
        "Unable to load your profile."
      );

    } finally {
      setLoading(false);
    }
  };


  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };


  const formatRole = (role?: string) => {

    if (!role) {
      return "User";
    }

    return role
      .replace("_", " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };


  return (
    <div className="p-6 md:p-8">

      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-slate-900">
          Settings
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your account and application information.
        </p>

      </div>


      {/* ===================================== */}
      {/* ERROR */}
      {/* ===================================== */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">

          <AlertCircle
            size={20}
            className="text-red-500 mt-0.5"
          />

          <div>

            <p className="font-medium text-red-700">
              Unable to load profile
            </p>

            <p className="text-sm text-red-600 mt-1">
              {error}
            </p>

          </div>

        </div>
      )}


      {/* ===================================== */}
      {/* PROFILE */}
      {/* ===================================== */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6">

        <div className="p-6 border-b border-slate-200">

          <h2 className="text-lg font-semibold text-slate-900">
            Profile
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Your account information.
          </p>

        </div>


        <div className="p-6">

          {loading ? (

            <div className="flex items-center gap-3 text-slate-500">

              <Loader2
                size={20}
                className="animate-spin"
              />

              <span>
                Loading profile...
              </span>

            </div>

          ) : (

            <div className="space-y-5">

              {/* Name */}

              <div className="flex items-center gap-4">

                <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">

                  <User
                    size={21}
                    className="text-slate-600"
                  />

                </div>

                <div>

                  <p className="text-xs text-slate-500">
                    Name
                  </p>

                  <p className="font-medium text-slate-900">
                    {user?.name || "Not available"}
                  </p>

                </div>

              </div>


              {/* Email */}

              <div className="flex items-center gap-4">

                <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">

                  <Mail
                    size={21}
                    className="text-slate-600"
                  />

                </div>

                <div>

                  <p className="text-xs text-slate-500">
                    Email
                  </p>

                  <p className="font-medium text-slate-900">
                    {user?.email || "Not available"}
                  </p>

                </div>

              </div>


              {/* Role */}

              <div className="flex items-center gap-4">

                <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">

                  <ShieldCheck
                    size={21}
                    className="text-slate-600"
                  />

                </div>

                <div>

                  <p className="text-xs text-slate-500">
                    Role
                  </p>

                  <p className="font-medium text-slate-900">
                    {formatRole(user?.role)}
                  </p>

                </div>

              </div>


              {/* Status */}

              <div className="flex items-center gap-4">

                <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">

                  <CheckCircle
                    size={21}
                    className="text-green-600"
                  />

                </div>

                <div>

                  <p className="text-xs text-slate-500">
                    Account Status
                  </p>

                  <p className="font-medium text-green-600">
                    Active
                  </p>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>


      {/* ===================================== */}
      {/* SECURITY */}
      {/* ===================================== */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6">

        <div className="p-6 border-b border-slate-200">

          <h2 className="text-lg font-semibold text-slate-900">
            Security
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Authentication and account security.
          </p>

        </div>


        <div className="p-6">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">

                <ShieldCheck
                  size={21}
                  className="text-green-600"
                />

              </div>

              <div>

                <p className="font-medium text-slate-900">
                  JWT Authentication
                </p>

                <p className="text-sm text-slate-500">
                  Your account is protected using JWT tokens.
                </p>

              </div>

            </div>


            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
              Enabled
            </span>

          </div>

        </div>

      </div>


      {/* ===================================== */}
      {/* APPLICATION INFORMATION */}
      {/* ===================================== */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6">

        <div className="p-6 border-b border-slate-200">

          <h2 className="text-lg font-semibold text-slate-900">
            Application Information
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Technology stack used by Vrinda.
          </p>

        </div>


        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Backend */}

          <div className="border border-slate-200 rounded-xl p-4 flex items-center gap-4">

            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">

              <Server
                size={20}
                className="text-slate-600"
              />

            </div>

            <div>

              <p className="text-xs text-slate-500">
                Backend
              </p>

              <p className="font-medium text-slate-900">
                FastAPI
              </p>

            </div>

          </div>


          {/* Database */}

          <div className="border border-slate-200 rounded-xl p-4 flex items-center gap-4">

            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">

              <Database
                size={20}
                className="text-slate-600"
              />

            </div>

            <div>

              <p className="text-xs text-slate-500">
                Database
              </p>

              <p className="font-medium text-slate-900">
                MongoDB
              </p>

            </div>

          </div>


          {/* Frontend */}

          <div className="border border-slate-200 rounded-xl p-4 flex items-center gap-4">

            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">

              <Code2
                size={20}
                className="text-slate-600"
              />

            </div>

            <div>

              <p className="text-xs text-slate-500">
                Frontend
              </p>

              <p className="font-medium text-slate-900">
                React + TypeScript
              </p>

            </div>

          </div>


          {/* Application */}

          <div className="border border-slate-200 rounded-xl p-4 flex items-center gap-4">

            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">

              <CheckCircle
                size={20}
                className="text-green-600"
              />

            </div>

            <div>

              <p className="text-xs text-slate-500">
                Application
              </p>

              <p className="font-medium text-slate-900">
                Vrinda
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* ===================================== */}
      {/* LOGOUT */}
      {/* ===================================== */}

      <div className="bg-white rounded-2xl border border-red-200 shadow-sm">

        <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <h2 className="font-semibold text-slate-900">
              Sign out
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Sign out of your Vrinda account on this device.
            </p>

          </div>


          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 transition"
          >

            <LogOut size={18} />

            Logout

          </button>

        </div>

      </div>

    </div>
  );
}

export default Settings;