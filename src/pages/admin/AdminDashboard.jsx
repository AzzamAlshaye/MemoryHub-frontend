import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import { pinService } from "../../service/pinService";
import { userService } from "../../service/userService";
import { reportService } from "../../service/reportService";
import { parseISO, format } from "date-fns";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [pins, setPins] = useState([]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);

  // Chart refs
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const reportStatusChartRef = useRef(null);
  const reportTypeChartRef = useRef(null);

  // Chart instances
  const barChartInstance = useRef(null);
  const pieChartInstance = useRef(null);
  const reportStatusChartInstance = useRef(null);
  const reportTypeChartInstance = useRef(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [pinsData, usersData, reportsData] = await Promise.all([
          pinService.listMyPins(),
          userService.list(),
          reportService.list(),
        ]);
        setPins(pinsData);
        setUsers(usersData);
        setReports(reportsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Bar Chart - Pins Per Month
  useEffect(() => {
    if (loading || !barChartRef.current) return;

    const months = Array.from({ length: 12 }, (_, i) =>
      format(new Date(2000, i, 1), "MMMM")
    );

    const monthCounts = Object.fromEntries(months.map((m) => [m, 0]));
    pins.forEach((pin) => {
      if (pin.createdAt) {
        const month = format(parseISO(pin.createdAt), "MMMM");
        monthCounts[month]++;
      }
    });

    const ctx = barChartRef.current.getContext("2d");
    barChartInstance.current?.destroy();
    barChartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: months,
        datasets: [
          {
            label: "Number of Pins",
            data: months.map((m) => monthCounts[m]),
            backgroundColor: "rgba(255, 193, 100, 0.8)",
            borderRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } },
        },
      },
    });
  }, [loading, pins]);

  // Pie Chart - Pins Privacy
  useEffect(() => {
    if (loading || !pieChartRef.current) return;

    const privacyCounts = { public: 0, private: 0, group: 0 };
    pins.forEach((pin) => privacyCounts[pin.privacy]++);

    const ctx = pieChartRef.current.getContext("2d");
    pieChartInstance.current?.destroy();
    pieChartInstance.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Public", "Private", "Group"],
        datasets: [
          {
            data: Object.values(privacyCounts),
            backgroundColor: [
              "rgba(234, 179, 150, 0.8)",
              "rgba(234, 179, 100, 0.6)",
              "rgba(234, 179, 100, 0.3)",
            ],
          },
        ],
      },
      options: {
        plugins: {
          legend: { position: "bottom" },
        },
      },
    });
  }, [loading, pins]);

  // Pie Chart - Report Status
  useEffect(() => {
    if (loading || !reportStatusChartRef.current) return;

    const statusCounts = { open: 0, resolved: 0, dismissed: 0 };
    reports.forEach((r) => statusCounts[r.status]++);

    const ctx = reportStatusChartRef.current.getContext("2d");
    reportStatusChartInstance.current?.destroy();
    reportStatusChartInstance.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Open", "Resolved", "Dismissed"],
        datasets: [
          {
            data: Object.values(statusCounts),
            backgroundColor: [
              "rgba(234, 179, 150, 0.8)",
              "rgba(234, 179, 150, 0.5)",
              "rgba(234, 179, 150, 0.4)",
            ],
          },
        ],
      },
      options: {
        plugins: {
          legend: { position: "bottom" },
        },
      },
    });
  }, [loading, reports]);

  // Pie Chart - Report Type
  useEffect(() => {
    if (loading || !reportTypeChartRef.current) return;

    const typeCounts = { pin: 0, comment: 0 };
    reports.forEach((r) => typeCounts[r.targetType]++);

    const ctx = reportTypeChartRef.current.getContext("2d");
    reportTypeChartInstance.current?.destroy();
    reportTypeChartInstance.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Pin", "Comment"],
        datasets: [
          {
            data: Object.values(typeCounts),
            backgroundColor: [
              "rgba(234, 179, 150, 0.8)",
              "rgba(234, 179, 100, 0.4)",
            ],
          },
        ],
      },
      options: {
        plugins: {
          legend: { position: "bottom" },
        },
      },
    });
  }, [loading, reports]);

  return (
    <div className="bg-[#FDF7F0] min-h-screen w-full">
      <div className="p-6 max-w-[1200px] mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
          Admin Dashboard
        </h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading data...</p>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
              <StatCard title="Total Users" value={users.length} color="blue" />
              <StatCard title="Total Pins" value={pins.length} color="green" />
              <StatCard
                title="Total Reports"
                value={reports.length}
                color="yellow"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
              <ChartBox title="Pins Per Month">
                <canvas ref={barChartRef} className="w-full h-full" />
              </ChartBox>
              <ChartBox title="Pins Privacy Distribution">
                <canvas ref={pieChartRef} style={{ maxWidth: 300 }} />
              </ChartBox>
              <ChartBox title="Report Status Distribution">
                <canvas ref={reportStatusChartRef} style={{ maxWidth: 300 }} />
              </ChartBox>
              <ChartBox title="Report Type Distribution">
                <canvas ref={reportTypeChartRef} style={{ maxWidth: 300 }} />
              </ChartBox>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Reusable components
function StatCard({ title, value, color }) {
  const colorClass = {
    blue: "text-blue-600",
    green: "text-green-600",
    yellow: "text-yellow-600",
  }[color];

  return (
    <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition-shadow duration-300">
      <h2 className={`text-3xl font-extrabold ${colorClass}`}>{value}</h2>
      <p className="text-gray-700 mt-3 text-lg">{title}</p>
    </div>
  );
}

function ChartBox({ title, children }) {
  return (
    <div
      className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-center items-center"
      style={{ height: "400px" }}
    >
      <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center w-full">
        {title}
      </h3>
      {children}
    </div>
  );
}
