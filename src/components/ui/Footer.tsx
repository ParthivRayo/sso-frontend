// Footer.tsx

import { useState } from "react";
import "@/styles/header.css";

const Footer = () => {
  const [activePage, setActivePage] = useState("product"); // 'product', 'updates', or 'profile'

  return (
    <footer className="footer m-1 flex items-center justify-evenly bg-white p-4 text-xl">
      <button
        className={`font-bold ${activePage === "product" ? "text-black" : "text-gray-500"}`}
        onClick={() => setActivePage("product")}
      >
        Product
      </button>
      <button
        className={`font-bold ${activePage === "updates" ? "text-black" : "text-gray-500"}`}
        onClick={() => setActivePage("updates")}
      >
        Updates
      </button>
      <button
        className={`font-bold ${activePage === "profile" ? "text-black" : "text-gray-500"}`}
        onClick={() => setActivePage("profile")}
      >
        My Profile
      </button>
    </footer>
  );
};

export default Footer;
