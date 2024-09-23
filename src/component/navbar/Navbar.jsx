import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = (props) => {
  const location = useLocation();
  const isHomeActive = location.pathname === "/";
  const isSpendedActive = location.pathname === "/spended";
  const isAddORderActive = location.pathname === "/add-order";
  const isEditOrderActive = location.pathname === "/edit-order";
  const isLoginActive = location.pathname === "/login" || location.pathname === "/signup";
  const isProfileActive = location.pathname === "/profile";
  const isChangePassword = location.pathname === "/change-password";

  const [title, setTitle] = useState("");

  useEffect(() => {
    let newTitle = "";

    if (isHomeActive) {
      newTitle = "Home";
    } else if (isSpendedActive) {
      newTitle = "Spended";
    } else if (isAddORderActive) {
      newTitle = "Add order";
    } else if (isEditOrderActive) {
      newTitle = "Edit order";
    } else if (isProfileActive) {
      newTitle = "Profile";
    } else if (isChangePassword) {
      newTitle = "Change Password";
    }

    setTitle(newTitle);
    props.setHeader(newTitle);
  }, [isHomeActive, isSpendedActive, isAddORderActive, isEditOrderActive, isLoginActive, isProfileActive, isChangePassword]);

  return (
    <div className="d-flex justify-content-around">
      <Link to="/" className={isHomeActive ? "nav-icon-change" : "nav-icon"}>
        <i className="fa-solid fa-house"></i>
      </Link>

      <Link to="/add-order" className="add-order">
        <i className="fa-solid fa-plus"></i>
      </Link>

      <Link to="/spended" className={isSpendedActive ? "nav-icon-change" : "nav-icon"}>
        <i className="fa-solid fa-chart-pie"></i>
      </Link>
    </div>
  );
};

export default Navbar;
