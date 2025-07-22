import React, { useEffect, useState } from "react";
import { getManagerFeedback, FeedbackResponse } from "@/api/getManagerFeedback";

const ManagerFeedback: React.FC = () => {
  const [responses, setResponses] = useState<FeedbackResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getManagerFeedback()
      .then((responses) => {
        setResponses(responses);
      })
      .catch((err) => {
        setError(
          "Failed to fetch feedback responses. See console for details."
        );
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading feedback...</div>;
  if (error) return <div>{error}</div>;
  if (responses.length === 0) return <div>No feedback responses found.</div>;

  const headers = responses.length > 0 ? Object.keys(responses[0]) : [];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100">
      <div className="flex flex-1">
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight mb-4">
              Manager Feedback Responses
            </h2>
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
                  {responses.map((resp, idx) => (
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
