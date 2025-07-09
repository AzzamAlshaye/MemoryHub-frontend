// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import "chart.js/auto"; // register all Chart.js pieces once
import { Bar, Pie } from "react-chartjs-2";
import { pinService } from "../../service/pinService";
import { userService } from "../../service/userService";
import { reportService } from "../../service/reportService";
import { parseISO, format } from "date-fns";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [pins, setPins] = useState([]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);

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
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // — prepare chart data —
  const monthLabels = Array.from({ length: 12 }, (_, i) =>
    format(new Date(2000, i, 1), "MMM")
  );
  const monthCounts = monthLabels.map(
    (m) => pins.filter((p) => format(parseISO(p.createdAt), "MMM") === m).length
  );

  const privacyCounts = ["public", "private", "group"].map(
    (key) => pins.filter((p) => p.privacy === key).length
  );
  const statusCounts = ["open", "resolved", "dismissed"].map(
    (key) => reports.filter((r) => r.status === key).length
  );
  const typeCounts = ["pin", "comment"].map(
    (key) => reports.filter((r) => r.targetType === key).length
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { boxWidth: 12 } },
    },
  };

  return (
    <div className="bg-white-theme min-h-screen p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-dark-theme">
        Admin Dashboard
      </h1>

      {loading ? (
        <p className="text-center text-dark-theme">Loading...</p>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
            <StatCard title="Users" value={users.length} />
            <StatCard title="Pins" value={pins.length} />
            <StatCard title="Reports" value={reports.length} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pins Per Month */}
            <ChartBox title="Pins Per Month">
              <div className="w-full h-64">
                <Bar
                  id="pins-bar-chart"
                  redraw
                  data={{
                    labels: monthLabels,
                    datasets: [
                      {
                        label: "Pins",
                        data: monthCounts,
                        backgroundColor:
                          "rgba(253,137,80,0.8)" /* main-theme */,
                        borderRadius: 4,
                      },
                    ],
                  }}
                  options={{
                    ...chartOptions,
                    scales: {
                      y: { beginAtZero: true, ticks: { stepSize: 1 } },
                    },
                  }}
                />
              </div>
            </ChartBox>

            {/* Privacy Distribution */}
            <ChartBox title="Privacy Distribution">
              <div className="w-full h-64">
                <Pie
                  id="privacy-pie-chart"
                  redraw
                  data={{
                    labels: ["Public", "Private", "Group"],
                    datasets: [
                      {
                        data: privacyCounts,
                        backgroundColor: [
                          "rgba(253,160,115,0.8)" /* lighter-theme */,
                          "rgba(253,160,115,0.5)",
                          "rgba(253,160,115,0.3)",
                        ],
                      },
                    ],
                  }}
                  options={chartOptions}
                />
              </div>
            </ChartBox>

            {/* Report Status */}
            <ChartBox title="Report Status">
              <div className="w-full h-64">
                <Pie
                  id="status-pie-chart"
                  redraw
                  data={{
                    labels: ["Open", "Resolved", "Dismissed"],
                    datasets: [
                      {
                        data: statusCounts,
                        backgroundColor: [
                          "rgba(202,110,64,0.8)" /* dark-theme */,
                          "rgba(202,110,64,0.5)",
                          "rgba(202,110,64,0.3)",
                        ],
                      },
                    ],
                  }}
                  options={chartOptions}
                />
              </div>
            </ChartBox>

            {/* Report Type */}
            <ChartBox title="Report Type">
              <div className="w-full h-64">
                <Pie
                  id="type-pie-chart"
                  redraw
                  data={{
                    labels: ["Pin", "Comment"],
                    datasets: [
                      {
                        data: typeCounts,
                        backgroundColor: [
                          "rgba(33,33,33,0.8)" /* you can swap for dark-theme if you like */,
                          "rgba(33,33,33,0.5)",
                        ],
                      },
                    ],
                  }}
                  options={chartOptions}
                />
              </div>
            </ChartBox>
          </div>
        </>
      )}
    </div>
  );
}

// ———— Reusable components ————

function StatCard({ title, value }) {
  return (
    <div
      className="bg-main-theme hover:bg-lighter-theme transition-colors duration-200 text-white-theme 
                    rounded-lg shadow-md p-6 flex flex-col items-center"
    >
      <span className="text-3xl font-extrabold">{value}</span>
      <span className="mt-2">{title}</span>
    </div>
  );
}

function ChartBox({ title, children }) {
  return (
    <div className="bg-white-theme rounded-lg shadow-md p-4 flex flex-col">
      <h3 className="text-lg font-semibold text-dark-theme mb-2">{title}</h3>
      <div className="flex-1">{children}</div>
    </div>
  );
}
