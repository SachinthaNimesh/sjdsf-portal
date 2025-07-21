import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "@/components/Logo";
import Cookies from "js-cookie";
import {
  LogOut,
  BriefcaseBusiness,
  LayoutDashboard,
  Contact,
  Factory,
  MessageSquareText,
} from "lucide-react";
import React from "react";

interface MainLayoutProps {
  children: ReactNode;
}

// Sidebar with icons and active state, compact support
function Sidebar({ compact = false }) {
  const location = useLocation();
  // Sidebar items config
  const items = [
    {
      to: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Dashboard",
      match: "/dashboard",
    },
    {
      to: "/manager-feedback",
      icon: <MessageSquareText className="w-5 h-5" />,
      label: "Manager Feedbacks",
      match: "/manager-feedback",
    },
    {
      to: "/student-management",
      icon: <Contact className="w-5 h-5" />,
      label: "Employee Management",
      match: "/student-management",
    },
    {
      to: "/employer-management",
      icon: <Factory className="w-5 h-5" />,
      label: "Employer Management",
      match: "/employer-management",
    },
    {
      to: "/supervisor-management",
      icon: <BriefcaseBusiness className="w-5 h-5" />,
      label: "Supervisor Management",
      match: "/supervisor-management",
    },
  ];

  // Track hovered item for tooltip
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <nav className={`flex flex-col gap-2 py-4 px-2 relative `}>
      {items.map((item, idx) => {
        const isActive = location.pathname === item.match;
        return (
          <div
            key={item.label}
            className={`relative ${compact ? "flex justify-center" : ""}`}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <Link
              to={item.to}
              className={`flex items-center gap-2 rounded-lg font-medium text-sm transition-all duration-200
                ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }
                ${
                  compact
                    ? "w-12 h-12 items-center justify-center" // square shape with rounded corners
                    : "py-4 justify-start"
                }
                mx-1
              `}
            >
              {/* Add left margin to icon when expanded */}
              {React.cloneElement(item.icon, {
                className: "w-6 h-6",
                style: !compact ? { marginLeft: "12px" } : undefined,
              })}
              {!compact && <span className="ml-2">{item.label}</span>}
            </Link>
            {compact && hoveredIdx === idx && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-white shadow-lg rounded px-3 py-1 text-sm font-medium text-gray-700 z-10 whitespace-nowrap border border-gray-200">
                {item.label}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

const MainLayout = ({ children }: MainLayoutProps) => {
  // const location = useLocation();
  const [user, setUser] = useState<{
    first_name?: string;
    last_name?: string;
    email?: string;
  } | null>(null);

  // Sidebar compact state
  const [sidebarCompact, setSidebarCompact] = useState(true); // collapsed by default

  useEffect(() => {
    let userInfo = null;
    // Try localStorage first (for consistency with logout)
    const localUser = localStorage.getItem("userInfo");
    if (localUser) {
      try {
        userInfo = JSON.parse(localUser);
      } catch {
        userInfo = null;
      }
    } else {
      // Try sessionStorage fallback
      const sessionUser = sessionStorage.getItem("userInfo");
      if (sessionUser) {
        try {
          userInfo = JSON.parse(sessionUser);
        } catch {
          userInfo = null;
        }
      } else {
        const userInfoCookie = Cookies.get("userinfo");
        if (userInfoCookie) {
          try {
            userInfo = JSON.parse(atob(userInfoCookie));
          } catch {
            userInfo = null;
          }
        }
      }
    }
    setUser(userInfo);
  }, []);
  console.log("User info:", user);
  const handleLogout = () => {
    // Clear stored user info
    localStorage.removeItem("userInfo");
    sessionStorage.removeItem("userInfo");
    setUser(null);

    // Redirect to Choreo logout
    const sessionHint = Cookies.get("session_hint");
    window.location.href = `/auth/logout${
      sessionHint ? `?session_hint=${sessionHint}` : ""
    }`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out
          ${sidebarCompact ? "w-16" : "w-64"}
          bg-gradient-to-b from-white to-gray-50 border-r border-gray-200`}
        onMouseEnter={() => {
          if (sidebarCompact) {
            setSidebarCompact(false);
          }
        }}
        onMouseLeave={() => {
          if (!sidebarCompact) {
            setSidebarCompact(true);
          }
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-2 border-b border-gray-200">
            <Link to="/" className="flex items-center justify-center w-full">
              <Logo className="h-16" />
              {!sidebarCompact && (
                <span className="ml-2 text-md font-medium text-gray-700 transition-none">
                  Employee Management Portal
                </span>
              )}
            </Link>
          </div>
          {/* Sidebar Navigation */}
          <Sidebar compact={sidebarCompact} />
          {/* User Profile at the bottom */}
          {!sidebarCompact && (
            <div className="mt-auto p-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.first_name?.[0]?.toUpperCase() ||
                        user?.email?.[0]?.toUpperCase() ||
                        "U"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user?.first_name && user.first_name.trim().length > 0
                        ? user.first_name +
                          (user?.last_name ? ` ${user.last_name}` : "")
                        : user?.email
                        ? user.email
                        : ""}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email || ""}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors "
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
          {sidebarCompact && (
            <div className="mt-auto p-2 border-t border-gray-200 flex flex-col items-center">
              {/* Show avatar instead of logout icon */}
              <div className="mb-2 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <span className="text-base font-semibold text-white">
                  {user?.first_name?.[0]?.toUpperCase() ||
                    user?.email?.[0]?.toUpperCase() ||
                    "U"}
                </span>
              </div>
              {sidebarCompact && <div className="w-full mt-auto" />}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`${
          sidebarCompact ? "pl-16" : "pl-64"
        } transition-all duration-300`}
      >
        <main className="p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
