import { useNavigate } from "react-router-dom";
import { Clock, Users, Smile, Frown, Meh } from "lucide-react";
import { useState, useEffect } from "react";
import { useCardService } from "../api/getCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const { getCards } = useCardService();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCards()
      .then((data) => setEmployees(data))
      .catch(() => setEmployees([]))
      .finally(() => setLoading(false));
  }, []);

  // Sort employees by mood priority: sad > neutral > happy
  const sortedEmployees = [...employees].sort((a, b) => {
    const moodPriority = { sad: 1, neutral: 2, happy: 3 };
    return (moodPriority[a.emotion] || 4) - (moodPriority[b.emotion] || 4);
  });

  // Calculate statistics
  const totalEmployees = employees.length;
  const happyEmployees = employees.filter(
    (emp) => emp.emotion === "happy"
  ).length;

  // Helper to determine checked in/out status for today
  function getStatusForToday(employee) {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10); // "YYYY-MM-DD"
    const checkedInRaw = employee.check_in_date_time;
    const checkedOutRaw = employee.check_out_date_time;

    // Special "zero" timestamp string (can appear as with or without T, so check both)
    const ZERO_TIMESTAMP = "0001-01-01";
    const isZeroTimestamp = (val) =>
      typeof val === "string" && val.startsWith(ZERO_TIMESTAMP);

    // Parse check-in/check-out dates
    let checkedInDate = checkedInRaw ? new Date(checkedInRaw) : null;
    let checkedOutDate = checkedOutRaw ? new Date(checkedOutRaw) : null;

    // Check if check-in/check-out is today
    const isCheckedInToday =
      checkedInDate && checkedInDate.toISOString().slice(0, 10) === todayStr;
    const isCheckedOutToday =
      checkedOutDate && checkedOutDate.toISOString().slice(0, 10) === todayStr;

    // 1. If there is a checked out record for today and it is not the zero timestamp, show "Out"
    if (checkedOutRaw && !isZeroTimestamp(checkedOutRaw) && isCheckedOutToday) {
      return {
        status: "Out",
        statusColor: "bg-red-100 text-red-700",
      };
    }

    // 2. If checked out is zero timestamp or not recorded, and there is a valid checked in for today, mark "In"
    if (
      isCheckedInToday &&
      (!checkedOutRaw || isZeroTimestamp(checkedOutRaw))
    ) {
      return {
        status: "In",
        statusColor: "bg-green-100 text-green-700",
      };
    }

    // 3. Otherwise, mark "Out"
    return {
      status: "Out",
      statusColor: "bg-red-100 text-red-700",
    };
  }

  // Calculate checked in employees using the same logic as getStatusForToday
  const checkedInEmployees = employees.filter(
    (emp) => getStatusForToday(emp).status === "In"
  ).length;

  // Emotion counts
  const happyCount = employees.filter((emp) => emp.emotion === "happy").length;
  const neutralCount = employees.filter(
    (emp) => emp.emotion === "neutral"
  ).length;
  const sadCount = employees.filter((emp) => emp.emotion === "sad").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100">
      <div className="flex flex-1">
        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                Employee Dashboard
              </h2>
              {/* Optionally add search/filter here */}
            </div>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 shadow-sm border border-blue-100/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Employees
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                      {totalEmployees}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-white to-green-50 rounded-xl p-6 shadow-sm border border-green-100/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Currently Checked In
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                      {checkedInEmployees}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-white to-yellow-50 rounded-xl p-6 shadow-sm border border-yellow-100/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Mood Overview
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1 text-yellow-600 font-semibold text-lg">
                        <Smile className="w-5 h-5" /> {happyCount}
                      </span>
                      <span className="flex items-center gap-1 text-blue-600 font-semibold text-lg">
                        <Meh className="w-5 h-5" /> {neutralCount}
                      </span>
                      <span className="flex items-center gap-1 text-red-600 font-semibold text-lg">
                        <Frown className="w-5 h-5" /> {sadCount}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg">
                    <Smile className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
            {/* Employee Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedEmployees.map((employee) => {
                const { status, statusColor } = getStatusForToday(employee);
                return (
                  <EmployeeCard
                    key={employee.student_id}
                    employee={{
                      id: employee.student_id,
                      name: `${employee.first_name} ${employee.last_name}`,
                      employer: employee.employer_name,
                      status,
                      statusColor,
                      workingHours: `${
                        employee.check_in_date_time
                          ? new Date(
                              employee.check_in_date_time
                            ).toLocaleTimeString()
                          : "N/A"
                      } - ${
                        employee.check_out_date_time &&
                        !employee.check_out_date_time.startsWith(
                          "0001-01-01T05:53:28"
                        )
                          ? new Date(
                              employee.check_out_date_time
                            ).toLocaleTimeString()
                          : "N/A"
                      }`,
                      mood: employee.emotion,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

function EmployeeCard({ employee }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/employee/${employee.id}`);
  };

  // Returns a Lucide icon component for the mood
  const getMoodIcon = (mood) => {
    switch (mood) {
      case "happy":
        return <Smile className="w-7 h-7 text-yellow-400" />;
      case "sad":
        return <Frown className="w-7 h-7 text-red-400" />;
      case "neutral":
        return <Meh className="w-7 h-7 text-blue-400" />;
      default:
        return null;
    }
  };

  return (
    <div
      className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-gray-900">
            {employee.name}
          </h2>
          <p className="text-sm text-gray-500">ID: {employee.id}</p>
          <p className="text-sm text-gray-500">{employee.employer}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${employee.statusColor}`}
        >
          {employee.status}
        </span>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Mood Indicator: icon and bold label, no circle */}
            <div className="flex flex-col items-center">
              <span>{getMoodIcon(employee.mood)}</span>
              <span
                className={
                  {
                    happy: "text-yellow-700",
                    sad: "text-red-700",
                    neutral: "text-blue-700",
                  }[employee.mood] + " text-xs font-bold mt-1 capitalize"
                }
              >
                {employee.mood}
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-500">{employee.workingHours}</div>
        </div>
      </div>
      {/* Removed View Details button */}
    </div>
  );
}

export default Dashboard;
