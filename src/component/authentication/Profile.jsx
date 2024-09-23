import React, { useState, useEffect, useRef } from "react";
import { numberWithCommas } from "../baseFunction/BaseFunction";
import "./Profile.css";
import { updateUser, deleteUser, logout } from "../baseFunction/Authentication";
import Swal from "sweetalert2";
import { icon_income, icon_expense } from "../baseFunction/BaseFunction";
import toast from "react-hot-toast";

const Profile = (props) => {
  const [img, setImg] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const fileInputRef = useRef();
  const [name, setName] = useState("");
  const [income, setIncome] = useState("");
  const [expense, setExpense] = useState("");
  const [summary, setSummary] = useState([]);
  const [imgOption, setimgOption] = useState(false);

  useEffect(() => {
    const totalIncome = props.data.filter((e) => e.category.split(" ")[1] === "Income").reduce((prev, item) => prev + item.price, 0);
    const totalExpense = props.data.filter((e) => e.category.split(" ")[1] !== "Income").reduce((prev, item) => prev + item.price, 0);
    const totalFood = props.data.filter((e) => e.category.split(" ")[1] === "Food").reduce((prev, item) => prev + item.price, 0);
    const totalTravel = props.data.filter((e) => e.category.split(" ")[1] === "Travel").reduce((prev, item) => prev + item.price, 0);
    const totalShare = props.data.filter((e) => e.category.split(" ")[1] === "Share").reduce((prev, item) => prev + item.price, 0);
    const totalShopping = props.data.filter((e) => e.category.split(" ")[1] === "Shopping").reduce((prev, item) => prev + item.price, 0);
    const totalBill = props.data.filter((e) => e.category.split(" ")[1] === "Bill").reduce((prev, item) => prev + item.price, 0);

    const data = [
      { img: "https://img.icons8.com/?size=500&id=8guqxb0kI94W&format=png&color=000000", title: "Food", price: totalFood },
      { img: "https://img.icons8.com/?size=500&id=JxowWafYSEQ6&format=png&color=000000", title: "Travel", price: totalTravel },
      { img: "https://img.icons8.com/?size=500&id=92028&format=png&color=000000", title: "Share", price: totalShare },
      { img: "https://img.icons8.com/?size=500&id=8Na1VyvcBemC&format=png&color=000000", title: "Shopping", price: totalShopping },
      { img: "https://img.icons8.com/?size=500&id=ushmkLPUgXcE&format=png&color=000000", title: "Bill", price: totalBill },
    ];

    setIncome(totalIncome);
    setExpense(totalExpense);

    setSummary(data.sort((a, b) => b.price - a.price));

    if (user) {
      setImg(user.img);
      setName(user.name);
      props.setEdit(false);
    }
  }, [props.data]);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const ChangeProfile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Set the desired max width or height
          const maxWidth = 200;
          const maxHeight = 200;

          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);

          // Get resized image as a data URL
          const resizedDataUrl = canvas.toDataURL(file.type);

          setImg(resizedDataUrl);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const btnSave = async () => {
    Swal.fire({
      title: "Confirm save",
      text: "Do you want to save ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Save",
      reverseButtons: true,
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-secondary",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const data = {
            username: user.username,
            name: name,
            img: img,
          };

          toast.promise(
            updateUser(data).then((res) => {
              if (res) {
                props.setEdit(false);
                localStorage.setItem("user", JSON.stringify(data));
                return res;
              }
            }),
            {
              loading: "Saving...",
              success: (res) => `${res?.message}`,
              error: (err) => `${err?.message}`,
            }
          );
        } catch (err) {
          console.error("Failed to delete order:", err);
        }
      }
    });
  };

  const btnCancel = () => {
    props.setEdit(false);
    setName(user.name);
  };

  const btnDeleteAccount = async () => {
    Swal.fire({
      title: "Delete Account",
      html: `<div>Enter message: <span style="color: red;">Delete ${user.username}</span></div>`,
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Delete",
      showLoaderOnConfirm: true,
      reverseButtons: true,
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-secondary",
      },
      preConfirm: async (inputValue) => {
        try {
          if (`${inputValue}` === `Delete ${user.username}`) {
            await toast.promise(
              deleteUser(user.username).then((res) => {
                if (res) {
                  btnLogOut();
                  return res;
                }
              }),
              {
                loading: "Deleting...",
                success: (res) => `${res.message}`,
                error: (err) => `${err.error}`,
              }
            );
          } else {
            return toast.error("Invalid username");
          }
        } catch (err) {
          console.error("Failed to delete account:", err);
          toast.error("An error occurred while deleting the account.");
        }
      },
    });
  };

  const btnLogOut = async () => {
    try {
      const res = await logout();

      if (res) {
        props.setUserActive(false);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const chnageLinkImg = () => {
    Swal.fire({
      title: "Link",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      cancelButtonText: "No",
      confirmButtonText: "Yes",
      showLoaderOnConfirm: true,
      reverseButtons: true,
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-secondary",
      },
      preConfirm: async (login) => {
        setImg(login);
        setimgOption(false);
      },
    });
  };

  return (
    <>
      <div className="d-flex justify-content-center mt-4">
        <div className="position-relative">
          <div className="profile">
            <img src={img} alt="Profile" tabIndex={0} />
            <input id="file-upload" type="file" name="myImage" accept="image/*" className="d-none" onChange={ChangeProfile} ref={fileInputRef} />

            {props.edit ? (
              <div className="edit-image">
                <i className="fa-regular fa-pen-to-square" onClick={() => setimgOption((prev) => !prev)}></i>

                {imgOption && (
                  <>
                    <div className="edit-image-option">
                      <ul>
                        <li onClick={handleImageClick}>File</li>
                        <li onClick={chnageLinkImg}>Link</li>
                      </ul>
                    </div>

                    <div className="back-drop" onClick={() => setimgOption((prev) => !prev)}></div>
                  </>
                )}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      {!props.edit ? (
        <h2 className="text-center fw-bold my-4">{name}</h2>
      ) : (
        <input type="text" className="form-control my-4" value={name} onChange={(e) => setName(e.target.value)} />
      )}

      {props.edit ? (
        <>
          <button className="btn btn-primary mt-2 w-100" onClick={btnSave}>
            Save
          </button>
          <button className="btn btn-secondary mt-2 w-100" onClick={btnCancel}>
            Cancel
          </button>
          <button className="btn btn-danger mt-2 w-100" onClick={btnDeleteAccount}>
            Delete Account
          </button>
        </>
      ) : (
        <>
          <div className="row">
            <div className="col-6">
              <div className="spend-con">
                <div className="items-icon">
                  <img src={icon_income} alt="Income" />
                </div>
                <div className="text-start align-content-center">
                  <p className="spend-title">Income</p>
                  <p className="spend-desc">฿{numberWithCommas(income)}</p>
                </div>
              </div>
            </div>

            <div className="col-6">
              <div className="spend-con">
                <div className="items-icon">
                  <img src={icon_expense} alt="Expense" />
                </div>
                <div className="text-start align-content-center">
                  <p className="spend-title">Expense</p>
                  <p className="spend-desc">฿{numberWithCommas(expense)}</p>
                </div>
              </div>
            </div>
          </div>

          <h5 className="text-title">Expenses report</h5>

          {summary &&
            summary.map((item, i) => (
              <div className="items-con" key={i}>
                <div className="items-box1">
                  <div className="items-icon">
                    <img src={item.img} alt={item.title} />
                  </div>
                  <div>
                    <p className="items-title">{item.title}</p>
                  </div>
                </div>
                <div className="items-box2">
                  <p className="items-title">฿{numberWithCommas(item.price)}</p>
                </div>
              </div>
            ))}
        </>
      )}
    </>
  );
};

export default Profile;
