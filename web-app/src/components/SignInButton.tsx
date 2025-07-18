import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

const MicrosoftLogo = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className="mr-3"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="9" height="9" fill="#F35325" />
    <rect x="13" y="2" width="9" height="9" fill="#81BC06" />
    <rect x="2" y="13" width="9" height="9" fill="#05A6F0" />
    <rect x="13" y="13" width="9" height="9" fill="#FFBA08" />
  </svg>
);

const SignInButton = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/dashboard");
  };

  return (
    <Button
      onClick={handleSignIn}
      className="flex items-center justify-center bg-white border border-gray-300 hover:border-blue-600 text-gray-800 px-8 py-3 rounded-md text-lg font-semibold transition-colors duration-200 shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
      style={{
        minWidth: 260,
        boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
      }}
    >
      <MicrosoftLogo />
      <span className="ml-1">Sign in with Microsoft</span>
    </Button>
  );
};

export default SignInButton;
