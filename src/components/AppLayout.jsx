// Shared page structure. Every route that is a child of this layout route is
// drawn inside <Outlet />, between the Navbar and the Footer.
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function AppLayout() {
  const { pathname } = useLocation();

  // A new page should start at the top, like a real page load would.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Navbar />
      <div id="main-content" tabIndex={-1} className="main-wrap">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default AppLayout;
