import React, { useState } from "react";
import { changePassword } from "../baseFunction/Authentication";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const ChangePassword = (props) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const btnSave = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error("Please fill in all the fields.");
    }

    Swal.fire({
      title: "Confirm save",
      text: "Do you want to save ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0d6efd",
      cancelButtonColor: "#rgb(139 139 139)",
      confirmButtonText: "Save",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (currentPassword === newPassword) {
            return toast.error("Passwords same current password.");
          } else if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match.");
          }

          const data = {
            currentPassword: currentPassword,
            newPassword: newPassword,
          };

          toast.promise(
            changePassword(data).then((res) => {
              if (res) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                props.setUserActive(false);
                return res;
              }
            }),
            {
              loading: "Saving...",
              success: (res) => `${res?.message}`,
              error: (err) => `Current password is incorrect`,
            }
          );
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  return (
    <>
      <form className="mt-4">
        <label className="form-label" htmlFor="currentPassword">
          Current Password
        </label>
        <input
          type="password"
          className="form-control"
          id="currentPassword"
          value={currentPassword}
          autoComplete="current-password"
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <label className="form-label mt-2" htmlFor="newPassword">
          New Password
        </label>
        <input
          type="password"
          className="form-control"
          id="newPassword"
          value={newPassword}
          autoComplete="new-password"
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <label className="form-label mt-2" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <input
          type="password"
          className="form-control"
          id="confirmPassword"
          value={confirmPassword}
          autoComplete="new-password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <div className="row mt-4">
          <div className="col-6">
            <button className="btn btn-secondary w-100" onClick={() => navigate("/profile")}>
              Cancel
            </button>
          </div>

          <div className="col-6">
            <button className="btn btn-primary w-100" onClick={btnSave}>
              Save
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default ChangePassword;
