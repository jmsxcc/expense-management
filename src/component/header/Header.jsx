import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import { logout } from "../baseFunction/Authentication";
import toast from "react-hot-toast";

const Header = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const isProfile = location.pathname === "/profile";
  const isChangePassword = location.pathname === "/change-password";
  const [setting, setSetting] = useState(false);

  const btnLogOut = async () => {
    try {
      toast.promise(
        logout().then((res) => {
          if (res) {
            props.setUserActive(false);
            return res;
          }
        }),
        {
          loading: "Logouting...",
          success: (res) => `${res?.message}`,
          error: (err) => `${err?.message}`,
        }
      );
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const btnOptionSetting = (toggle) => {
    setSetting(toggle);
  };

  return (
    <div className="d-flex justify-content-between align-items-center">
      <div>
        <h4 className="fw-bold">{props.header}</h4>
        <div className="header-line"></div>
      </div>

      {!isProfile && !isChangePassword ? (
        <div className="icon-profile" onClick={() => navigate("/profile")}>
          <img src={user?.img} alt="" />
        </div>
      ) : (
        <div className="icon-setting">
          <i className="fa-solid fa-gear" onClick={() => btnOptionSetting((prev) => !prev)}></i>

          {setting && (
            <>
              <div className="option-setting">
                <ul>
                  {isChangePassword ? (
                    <li onClick={() => navigate("/profile")}>Profile</li>
                  ) : (
                    <>
                      <li
                        onClick={() => {
                          props.setEdit(true), btnOptionSetting((prev) => !prev);
                        }}
                      >
                        Setting
                      </li>
                      <li
                        onClick={() => {
                          navigate("/change-password"), btnOptionSetting((prev) => !prev);
                        }}
                      >
                        Change Password
                      </li>
                    </>
                  )}

                  <li onClick={() => btnLogOut()}>Log out</li>
                </ul>
              </div>
              <div className="back-drop" onClick={() => btnOptionSetting((prev) => !prev)}></div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
