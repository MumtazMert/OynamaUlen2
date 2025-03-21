import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { supabase } from "../../lib/supabase";

const Navbar = () => {
  const location = useLocation();
  const { user, clearUser } = useAuthStore();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    clearUser();
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              OYYYYNAMA ULEN
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === "/"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/my-games"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === "/my-games"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              My Games
            </Link>
            <div className="relative ml-3">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-2">
                  {user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
