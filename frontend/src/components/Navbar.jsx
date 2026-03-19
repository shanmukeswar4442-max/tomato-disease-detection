import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../utils/api";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const isLoggedIn = !!token;

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("full_name");
      navigate("/login");
    }
  };

  return (
    <nav className="bg-green-700 text-white px-6 py-4">
      <div className="flex justify-between items-center">

        <NavLink to="/" className="text-xl font-bold">
          🍅 Tomato Care
        </NavLink>

        <div className="hidden md:flex gap-6 items-center">
          {isLoggedIn ? (
            <>
              <NavLink
                to="/predict"
                className={({ isActive }) =>
                  isActive
                    ? "bg-white text-green-700 px-4 py-1 rounded-full font-bold"
                    : "hover:text-green-200"
                }
              >
                Predict
              </NavLink>
              <NavLink
                to="/history"
                className={({ isActive }) =>
                  isActive
                    ? "bg-white text-green-700 px-4 py-1 rounded-full font-bold"
                    : "hover:text-green-200"
                }
              >
                History
              </NavLink>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? "bg-white text-green-700 px-4 py-1 rounded-full font-bold"
                    : "hover:text-green-200"
                }
              >
                Dashboard
              </NavLink>
              <span className="text-green-200 text-sm">
                👤 {username}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-1 rounded-full font-bold hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? "bg-white text-green-700 px-4 py-1 rounded-full font-bold"
                    : "hover:text-green-200"
                }
              >
                Login
              </NavLink>
              <NavLink
  to="/register"
  className={({ isActive }) =>
    isActive
      ? "bg-white text-green-700 px-4 py-1 rounded-full font-bold"
      : "border border-white text-white px-4 py-1 rounded-full font-bold hover:bg-green-600"
  }
>
  Register
</NavLink>
            </>
          )}
        </div>

        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

      </div>

      {menuOpen && (
        <div className="md:hidden flex flex-col gap-3 mt-4 pb-2">
          {isLoggedIn ? (
            <>
              <span className="text-green-200 text-sm text-center">
                👤 {username}
              </span>
              <NavLink
                to="/predict"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "bg-white text-green-700 px-4 py-2 rounded-xl font-bold text-center"
                    : "hover:text-green-200 text-center py-2"
                }
              >
                Predict
              </NavLink>
              <NavLink
                to="/history"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "bg-white text-green-700 px-4 py-2 rounded-xl font-bold text-center"
                    : "hover:text-green-200 text-center py-2"
                }
              >
                History
              </NavLink>
              <NavLink
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "bg-white text-green-700 px-4 py-2 rounded-xl font-bold text-center"
                    : "hover:text-green-200 text-center py-2"
                }
              >
                Dashboard
              </NavLink>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold text-center hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "bg-white text-green-700 px-4 py-2 rounded-xl font-bold text-center"
                    : "hover:text-green-200 text-center py-2"
                }
              >
                Login
              </NavLink>
              <NavLink
  to="/register"
  onClick={() => setMenuOpen(false)}
  className={({ isActive }) =>
    isActive
      ? "bg-white text-green-700 px-4 py-2 rounded-xl font-bold text-center"
      : "border border-white text-white px-4 py-2 rounded-xl font-bold text-center hover:bg-green-600"
  }
>
  Register
</NavLink>   </>
          )}
        </div>
      )}

    </nav>
  );
}

export default Navbar;
