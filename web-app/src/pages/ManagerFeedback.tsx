import { appConfig } from "@/config/configs";
import React, { useEffect, useState } from "react";

type FeedbackResponse = {
  [key: string]: string;
};

const GOOGLE_SHEET_API_KEY =
  import.meta.env.VITE_GOOGLE_SHEET_API_KEY ||
  appConfig?.VITE_GOOGLE_SHEET_API_KEY ||
  "";
const SHEET_ID = "1LmvPIp-Ixdvur80OKFQ7Dm31QB1KpjOZDAstUWLkK-o";
const RANGE = "Sheet1!A1:Z100";

const fetchSheetData = async (): Promise<FeedbackResponse[]> => {
  if (!GOOGLE_SHEET_API_KEY) {
    throw new Error(
      "Google Sheets API key is not configured. Please set VITE_GOOGLE_SHEET_API_KEY in your .env file."
    );
  }
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${GOOGLE_SHEET_API_KEY}`;
  console.log("Fetching Google Sheet data from URL:", url);
  const res = await fetch(url);
  console.log("Fetch response status:", res.status, res.statusText);
  if (!res.ok) {
    console.error("HTTP error:", res.status, res.statusText, "Response:", res);
    throw new Error(`HTTP error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  console.log("Fetched data:", data);
  if (!data.values || data.values.length < 2) {
    console.error("No values found or not enough rows in data:", data);
    return [];
  }
  const [headers, ...rows] = data.values;
  return rows.map((row: string[]) =>
    headers.reduce((acc: FeedbackResponse, header: string, idx: number) => {
      acc[header] = row[idx] || "";
      return acc;
    }, {})
  );
};

const ManagerFeedback: React.FC = () => {
  const [responses, setResponses] = useState<FeedbackResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search state
  const [searchType, setSearchType] = useState<"StudentID" | "ManagerID">(
    "StudentID"
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSheetData()
      .then((responses) => {
        console.log("Parsed feedback responses:", responses);
        setResponses(responses);
      })
      .catch((err) => {
        console.error("Error fetching feedback responses:", err);
        if (err instanceof Error) {
          console.error("Error message:", err.message);
          if (err.stack) console.error("Error stack:", err.stack);
        }
        setError(
          "Failed to fetch feedback responses. See console for details."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading feedback...</div>;
  if (error) return <div>{error}</div>;
  if (responses.length === 0) return <div>No feedback responses found.</div>;

  // Helper to find the correct key for StudentID/ManagerID (case-insensitive, ignore spaces)
  function findKey(keys: string[], target: string) {
    const normalizedTarget = target.replace(/\s+/g, "").toLowerCase();
    return keys.find(
      (k) => k.replace(/\s+/g, "").toLowerCase() === normalizedTarget
    );
  }

  // Get headers from first response
  const headers = Object.keys(responses[0]);

  // Find the actual column names (handles variations like "Manager ID", "ManagerID", etc.)
  const studentIdKey = findKey(headers, "StudentID");
  const managerIdKey = findKey(headers, "ManagerID");

  // Debug: Log found keys
  console.log("Available headers:", headers);
  console.log("Found Student ID key:", studentIdKey);
  console.log("Found Manager ID key:", managerIdKey);

  // Filter responses by selected ID type
  const filteredResponses = responses.filter((resp) => {
    if (!searchQuery.trim()) return true;

    let searchValue = "";

    if (searchType === "StudentID" && studentIdKey) {
      searchValue = resp[studentIdKey] ?? "";
    } else if (searchType === "ManagerID" && managerIdKey) {
      searchValue = resp[managerIdKey] ?? "";
    }

    // Convert to string and perform case-insensitive exact match
    return String(searchValue).toLowerCase() === searchQuery.toLowerCase();
  });

  // Show warning if search column not found
  const showWarning = () => {
    if (searchType === "StudentID" && !studentIdKey) {
      return "Student ID column not found in data";
    }
    if (searchType === "ManagerID" && !managerIdKey) {
      return "Manager ID column not found in data";
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100">
      <div className="flex flex-1">
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight mb-4">
              Manager Feedback Responses
            </h2>

            {/* Search Bar Section */}
            <div className="flex flex-wrap md:flex-nowrap md:items-center gap-2 md:gap-4 mb-6 w-full">
              <div className="flex h-[40px] flex-shrink-0">
                <button
                  className={`px-4 py-2 h-full rounded-l-lg border border-gray-300 text-sm font-medium transition-colors ${
                    searchType === "StudentID"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white hover:bg-gray-100"
                  }`}
                  onClick={() => setSearchType("StudentID")}
                  type="button"
                >
                  Student ID
                </button>
                <button
                  className={`px-4 py-2 h-full rounded-r-lg border border-gray-300 text-sm font-medium transition-colors ${
                    searchType === "ManagerID"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white hover:bg-gray-100"
                  }`}
                  onClick={() => setSearchType("ManagerID")}
                  type="button"
                >
                  Manager ID
                </button>
              </div>
              <div className="flex-grow min-w-[180px]">
                <input
                  type="text"
                  className="pl-3 pr-4 py-2 h-[40px] rounded-lg border border-gray-300 bg-white/80 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 w-full"
                  placeholder={`Search by ${searchType}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Warning message if column not found */}
            {showWarning() && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                <strong>Warning:</strong> {showWarning()}
              </div>
            )}

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 overflow-x-auto mt-6 w-full">
              <table
                className="min-w-[600px] md:min-w-full border-separate border-spacing-0"
                border={1}
                cellPadding={8}
                cellSpacing={0}
              >
                <thead>
                  <tr>
                    {headers.map((header) => (
                      <th
                        key={header}
                        className="font-semibold text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100/50 text-left border-b border-gray-200 border-r last:border-r-0 px-4 py-2"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredResponses.map((resp, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-blue-50/50 transition-colors duration-200"
                    >
                      {headers.map((header) => (
                        <td
                          key={header}
                          className="text-gray-700 border-b border-gray-100 border-r last:border-r-0 px-4 py-2"
                        >
                          {resp[header]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerFeedback;
