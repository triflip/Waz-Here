import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const items = [
    { label: "Explore", icon: "🌍", path: "/waz-map" },
    { label: "Profile", icon: "👤", path: `/profile/${user?.id}` },
    { label: "", icon: "+", path: "/add-flag", isMain: true },
    { label: "", icon: "💡", path: "/saved" },
    { label: "Settings", icon: "⚙️", path: "/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-900 px-2 py-2 z-50">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map((item) =>
          item.isMain ? (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-12 h-12 bg-primary hover:bg-primary/80 rounded-xl rotate-45 flex items-center justify-center text-background shadow-[0_0_7px_rgba(19,236,73,0.4)] border-4 border-background transition-all duration-300"
            >
              <span className="-rotate-45 text-2xl font-black">
                {item.icon}
              </span>
            </button>
          ) : (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 px-3 py-1 group"
            >
              <span className="text-xl">{item.icon}</span>
              <span
                className={`text-xs transition-colors ${
                  isActive(item.path)
                    ? "text-primary"
                    : "text-gray-600 group-hover:text-gray-400"
                }`}
              >
                {item.label}
              </span>
            </button>
          ),
        )}
      </div>
    </nav>
  );
};

export default Navbar;
