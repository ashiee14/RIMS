import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import ViewerToast from "./ViewerToast";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNav = (path) => {
    navigate(`/${path === "home" ? "" : path}`);
  };

  return (
    <>
      <Navbar activePage={location.pathname} onNav={handleNav} />
      <Outlet />
      <ViewerToast />
    </>
  );
};

export default Layout;