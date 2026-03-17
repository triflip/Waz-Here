import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "./Navbar";

const NO_NAVBAR_ROUTES = ["/", "/login", "/register"];
const NO_DESKTOP_SIDEBAR_ROUTES = ["/waz-map"];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { user } = useAuth();

  const showNavbar = user && !NO_NAVBAR_ROUTES.includes(location.pathname);
  const showDesktopSidebar = showNavbar && !NO_DESKTOP_SIDEBAR_ROUTES.includes(location.pathname);

  return (
    <div className="min-h-screen bg-background md:flex">

      {showDesktopSidebar && (
        <div className="hidden md:block">
          <Navbar />
        </div>
      )}
      <main className={`
        flex-1
        ${showNavbar ? 'pb-20 md:pb-0' : ''}
        ${showDesktopSidebar ? 'md:ml-16' : ''}
      `}>
        {children}
      </main>

      {showNavbar && (
        <div className="md:hidden">
          <Navbar />
        </div>
      )}

    </div>
  );
};

export default Layout;