import {
  Dog,
  HeartPulse,
  LayoutDashboard,
  PlusCircle,
  Settings,
  ShieldCheck,
  Siren,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Animals",
    path: "/animals",
    icon: Dog,
  },
  {
    name: "Register Animal",
    path: "/animals/register",
    icon: PlusCircle,
  },
  {
    name: "Rescue Requests",
    path: "/rescue",
    icon: Siren,
  },
  {
    name: "Health",
    path: "/health",
    icon: HeartPulse,
  },
  {
    name: "Vaccinations",
    path: "/vaccinations",
    icon: ShieldCheck,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-gray-200 bg-white">
      <div className="flex h-20 items-center border-b border-gray-200 px-6">
        <div>
          <h1 className="text-2xl font-bold">
            Vrinda
          </h1>

          <p className="text-xs text-gray-500">
            Animal Welfare Platform
          </p>
        </div>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <Icon size={20} />
                  {item.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;