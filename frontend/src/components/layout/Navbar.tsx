import {
  Bell,
  User,
} from "lucide-react";

function Navbar() {
  return (
    <header className="fixed left-64 right-0 top-0 z-10 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8">
      <div>
        <p className="text-sm text-gray-500">
          Animal welfare management system
        </p>
      </div>

      <div className="flex items-center gap-5">
        <button
          type="button"
          className="rounded-lg p-2 hover:bg-gray-100"
        >
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-3">
          <div className="rounded-full bg-gray-100 p-2">
            <User size={20} />
          </div>

          <div>
            <p className="text-sm font-semibold">
              Vrinda User
            </p>

            <p className="text-xs text-gray-500">
              Volunteer
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;