import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { Users, Clock, Building2, LogIn, Globe, Facebook } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaMicrosoft } from "react-icons/fa";
console.log("Index page loaded");
const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Check if user info cookie exists (from fresh login)
        const userInfoCookie = Cookies.get("userinfo");

        if (userInfoCookie && !localStorage.getItem("userInfo")) {
          // Fresh login - decode cookie and store user info
          const userInfo = JSON.parse(atob(userInfoCookie));
          localStorage.setItem("userInfo", JSON.stringify(userInfo));

          // Clear the cookie as recommended
          Cookies.remove("userinfo", { path: "/" });

          setSignedIn(true);
          setUser(userInfo);
          console.log("User signed in:", userInfo);
        }
        // Check if user info exists in local storage (returning user)
        else if (localStorage.getItem("userInfo")) {
          const userInfo = JSON.parse(localStorage.getItem("userInfo")!);
          setSignedIn(true);
          setUser(userInfo);
          console.log("User restored from session:", userInfo);
        }
        // No authentication found
        else {
          console.log("User is not signed in");
          setSignedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error processing authentication:", error);
        // Only log error, do not clear userInfo here
        setSignedIn(false);
        setUser(null);
      }

      setIsAuthLoading(false);
    };

    initializeAuth();
  }, []);
  useEffect(() => {
    navigate("/");
  }, [navigate]);
  useEffect(() => {
    // Handle errors from Managed Authentication
    const urlParams = new URLSearchParams(window.location.search);
    const errorCode = urlParams.get("code");
    const errorMessage = urlParams.get("message");

    if (errorCode) {
      toast.error(
        <>
          <p className="text-[16px] font-bold text-slate-800">
            Something went wrong!
          </p>
          <p className="text-[13px] text-slate-400 mt-1">
            Error Code: {errorCode}
            <br />
            Error Description: {errorMessage}
          </p>
        </>
      );

      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleLogin = () => {
    setIsLoading(true);
    window.location.href = "/auth/login";
  };

  const handleLogout = () => {
    // Clear stored user info
    localStorage.removeItem("userInfo");
    setSignedIn(false);
    setUser(null);

    // Redirect to Choreo logout
    const sessionHint = Cookies.get("session_hint");
    window.location.href = `/auth/logout${
      sessionHint ? `?session_hint=${sessionHint}` : ""
    }`;
  };

  // Show loading state while checking authentication
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col">
      {/* Header with Sign In */}
      <header className="w-full py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-end">
          {signedIn ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-700">
                Welcome{" "}
                {user?.name || user?.given_name || user?.email || "User"}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 text-white font-semibold text-lg shadow-lg hover:from-blue-800 hover:to-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <LogIn className="mr-2 w-5 h-5" />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="inline-flex items-center px-6 py-3 rounded-xl bg-[#2F2F2F] hover:bg-[#1a1a1a] text-white font-bold text-lg shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5E5E5E] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FaMicrosoft className="mr-3 w-6 h-6" />
              {isLoading ? "Signing in..." : "Login with Microsoft"}
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-4 flex flex-col items-center">
            <img
              src="/SJSF-LOGO.webp"
              alt="SJSF Logo"
              className="h-36 w-auto mx-auto"
            />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome
            </h1>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-sm border border-blue-100/50 hover:shadow-md transition-shadow">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg w-fit mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Employee Management
              </h3>
              <p className="text-gray-600">
                Easily manage and track employee information, performance, and
                development.
              </p>
            </div>
            <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-xl shadow-sm border border-green-100/50 hover:shadow-md transition-shadow">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg w-fit mx-auto mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Time Management
              </h3>
              <p className="text-gray-600">
                Efficient check-in/check-out system with detailed time logs.
              </p>
            </div>
            <div className="bg-gradient-to-br from-white to-yellow-50 p-6 rounded-xl shadow-sm border border-yellow-100/50 hover:shadow-md transition-shadow">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg w-fit mx-auto mb-4">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Mood Analytics
              </h3>
              <p className="text-gray-600">
                Track employee well-being and engagement levels.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                About
              </h3>
              <p className="mt-4 text-gray-600">
                The Shiranee Joseph de Saram Foundation is a New Jersey
                501(c)(3) non-profit organization established to support those
                with special needs in Sri Lanka.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Quick Links
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    to="/dashboard"
                    className="text-gray-600 hover:text-blue-600 transition-colors inline-flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4" />
                    Our Website
                  </Link>
                </li>
                <li>
                  <Link
                    to="/student-management"
                    className="text-gray-600 hover:text-blue-600 transition-colors inline-flex items-center gap-2"
                  >
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Contact
              </h3>
              <ul className="mt-4 space-y-2">
                <li className="text-gray-600">Email: contact@sjdsf.org</li>
                <li className="text-gray-600">Phone: +1 6179597583</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-200">
            <p className="text-center text-gray-500">
              © {new Date().getFullYear()} SJDSF | The Shiranee Joseph de Saram
              Foundation
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
