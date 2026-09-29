import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  AlertCircle,
  PawPrint,
} from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [role, setRole] = useState("citizen");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "http://127.0.0.1:8000/auth/register",
        {
          name: name.trim(),
          email: email.trim(),
          password: password,
          role: role,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (err: any) {
      console.error("Registration error:", err);

      if (err.response) {
        if (err.response.status === 409) {
          setError(
            "An account with this email already exists."
          );
        } else if (err.response.status === 422) {
          setError(
            "Please check your registration details."
          );
        } else {
          setError(
            err.response.data?.detail ||
            "Unable to create account."
          );
        }
      } else {
        setError(
          "Unable to connect to the server. Please make sure the backend is running."
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
              Join the Vrinda
              <br />
              community.
            </h2>

            <p className="mt-6 text-lg text-slate-300 leading-8">
              Help manage animal health, rescue operations,
              vaccinations, and volunteer activities from one
              platform.
            </p>

          </div>

        </div>


        {/* Bottom */}

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

            <span className="text-2xl">
              🚑
            </span>

            <p className="mt-3 text-sm text-slate-300">
              Rescue
            </p>

          </div>


          <div className="border border-slate-700 bg-slate-800 rounded-xl p-5">

            <span className="text-2xl">
              👥
            </span>

            <p className="mt-3 text-sm text-slate-300">
              Volunteers
            </p>

          </div>

        </div>

      </div>


      {/* ========================================= */}
      {/* RIGHT SIDE */}
      {/* ========================================= */}

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10">

        <div className="w-full max-w-md">

          {/* Heading */}

          <div className="text-center mb-7">

            <h2 className="text-3xl font-bold text-slate-900">
              Create account
            </h2>

            <p className="mt-2 text-slate-500">
              Join Vrinda and help care for animals
            </p>

          </div>


          {/* Error */}

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-3">

              <AlertCircle
                size={20}
                className="text-red-500 mt-0.5 flex-shrink-0"
              />

              <p className="text-sm text-red-600">
                {error}
              </p>

            </div>
          )}


          {/* Success */}

          {success && (
            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3">

              <p className="text-sm text-green-700">
                {success}
              </p>

            </div>
          )}


          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Name */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>

              <div className="relative">

                <User
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter your full name"
                  autoComplete="name"
                  className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  required
                />

              </div>

            </div>


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
                  className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  required
                />

              </div>

            </div>


            {/* Role */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Account Type
              </label>

              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 bg-white py-3 px-4 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >

                <option value="citizen">
                  Citizen
                </option>

                <option value="volunteer">
                  Volunteer
                </option>

                <option value="veterinarian">
                  Veterinarian
                </option>

                <option value="ngo">
                  NGO
                </option>

              </select>

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
                  placeholder="Create a password"
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-12 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
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


            {/* Confirm Password */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password
              </label>

              <div className="relative">

                <Lock
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-12 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? (
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
              {loading
                ? "Creating account..."
                : "Create Account"}
            </button>

          </form>


          {/* Login Link */}

          <div className="mt-6 text-center text-sm text-slate-500">

            Already have an account?{" "}

            <Link
              to="/login"
              className="font-semibold text-green-600 hover:text-green-700"
            >
              Sign in
            </Link>

          </div>


          {/* Footer */}

          <p className="mt-8 text-center text-xs text-slate-400">
            Vrinda · Animal Welfare Management Platform
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;