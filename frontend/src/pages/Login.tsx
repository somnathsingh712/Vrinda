import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Users,
  Ambulance,
  PawPrint,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/auth/login",
        {
          email: email.trim(),
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const accessToken = response.data.access_token;

      if (!accessToken) {
        setError("Login failed. Access token was not received.");
        return;
      }

      // Store authentication token
      localStorage.setItem("token", accessToken);
      localStorage.setItem("access_token", accessToken);

      // Backend currently does not return user details,
      // so we don't store a user object here.

      // Go to dashboard
      navigate("/", { replace: true });

    } catch (err: any) {
      console.error("Login error:", err);

      if (err.response) {
        if (err.response.status === 401) {
          setError("Invalid email or password.");
        } else if (err.response.status === 422) {
          setError("Please enter valid login details.");
        } else {
          setError(
            err.response.data?.detail ||
            "Unable to login. Please try again."
          );
        }
      } else {
        setError(
          "Unable to connect to the server. Please check that the backend is running."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">

      {/* ========================================= */}
      {/* LEFT SIDE */}
      {/* ========================================= */}

      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white p-12 flex-col justify-between">

        <div>
          {/* Logo */}

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-green-600 flex items-center justify-center">
              <PawPrint size={25} />
            </div>

            <h1 className="text-2xl font-bold">
              Vrinda
            </h1>
          </div>


          {/* Heading */}

          <div className="mt-20 max-w-xl">

            <h2 className="text-4xl font-bold leading-tight">
              Caring for animals,
              <br />
              together.
            </h2>

            <p className="mt-6 text-lg text-slate-300 leading-8">
              Manage animal health, vaccinations, rescue operations,
              and volunteers from one platform.
            </p>

          </div>
        </div>


        {/* Feature Cards */}

        <div className="grid grid-cols-3 gap-4">

          <div className="border border-slate-700 bg-slate-800 rounded-xl p-5">
            <PawPrint
              size={24}
              className="text-purple-400"
            />

            <p className="mt-3 text-sm text-slate-300">
              Animal Care
            </p>
          </div>


          <div className="border border-slate-700 bg-slate-800 rounded-xl p-5">
            <Ambulance
              size={24}
              className="text-purple-400"
            />

            <p className="mt-3 text-sm text-slate-300">
              Rescue
            </p>
          </div>


          <div className="border border-slate-700 bg-slate-800 rounded-xl p-5">
            <Users
              size={24}
              className="text-purple-400"
            />

            <p className="mt-3 text-sm text-slate-300">
              Volunteers
            </p>
          </div>

        </div>

      </div>


      {/* ========================================= */}
      {/* RIGHT SIDE */}
      {/* ========================================= */}

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">

          {/* Heading */}

          <div className="text-center mb-8">

            <h2 className="text-3xl font-bold text-slate-900">
              Welcome back
            </h2>

            <p className="mt-2 text-slate-500">
              Sign in to continue to Vrinda
            </p>

          </div>


          {/* Error */}

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-3">

              <AlertCircle
                size={20}
                className="text-red-500 mt-0.5 flex-shrink-0"
              />

              <p className="text-sm text-red-600">
                {error}
              </p>

            </div>
          )}


          {/* Login Form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>

              <div className="relative">

                <Mail
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  required
                />

              </div>

            </div>


            {/* Password */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <div className="relative">

                <Lock
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-12 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  required
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >

                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}

                </button>

              </div>

            </div>


            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>


          {/* Register */}

          <div className="mt-6 text-center text-sm text-slate-500">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="font-semibold text-green-600 hover:text-green-700"
            >
              Create account
            </Link>

          </div>


          {/* Footer */}

          <p className="mt-10 text-center text-xs text-slate-400">
            Vrinda · Animal Welfare Management Platform
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;