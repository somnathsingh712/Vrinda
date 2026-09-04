import {
  Dog,
  HeartPulse,
  ShieldCheck,
  Siren,
} from "lucide-react";

function Dashboard() {
  const stats = [
    {
      title: "Total Animals",
      value: "0",
      icon: Dog,
    },
    {
      title: "Healthy Animals",
      value: "0",
      icon: HeartPulse,
    },
    {
      title: "Vaccinated",
      value: "0",
      icon: ShieldCheck,
    },
    {
      title: "Active Rescue Cases",
      value: "0",
      icon: Siren,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Welcome to Vrinda Animal Welfare Platform.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-100 p-3">
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">
          Recent Animals
        </h2>

        <p className="mt-4 text-gray-500">
          No animals to display yet.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;