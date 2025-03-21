import { Outlet } from "react-router-dom";
import Navbar from "../navBar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto py-6 px-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
