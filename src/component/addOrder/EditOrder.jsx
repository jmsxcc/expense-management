import React, { useEffect, useState } from "react";
import { searchCategory, updateOrder } from "../baseFunction/BaseFunction";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { deleteOrder } from "../baseFunction/BaseFunction";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const EditOrder = (props) => {
  const [icon, setIcon] = useState({ value: "", name: "" });
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const items = JSON.parse(localStorage.getItem("dataList"));
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (items) {
      setIcon({ value: items?.icon || "", name: items?.category || "" });
      setTitle(items?.title || "");
      setPrice(items?.price || "");
      setDate(moment(items?.date).format("YYYY-MM-DD HH:mm:ss"));
    }
    fetchCategory();
    setDate(moment(items?.date).format("YYYY-MM-DD HH:mm:ss"));
  }, []);

  const fetchCategory = async () => {
    try {
      const allCategory = await searchCategory();
      setCategory(allCategory);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const btnUpdate = async () => {
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
        const dataList = {
          icon: icon?.value,
          category: icon?.name,
          price: price,
          title: title,
          date: moment(date).format("YYYY-MM-DD HH:mm:ss"),
        };

        try {
          toast.promise(
            updateOrder(items?.id, dataList).then((res) => {
              if (res) {
                props.setData((prevItems) =>
                  prevItems.map((item) =>
                    item._id === items?.id ? { ...item, icon: icon?.value, category: icon?.name, title, price: parseInt(price), date } : item
                  )
                );
                navigate("/add-order");
                return res;
              }
            }),
            {
              loading: "Saving...",
              success: (res) => `${res.message}`,
              error: (err) => `${err.error}`,
            }
          );
        } catch (error) {
          console.error("Failed to update order:", err);
        }
      }
    });
  };

  const btnClear = () => {
    if (items) {
      setIcon({ value: items?.icon || "", name: items?.getegory || "" });
      setTitle(items?.title || "");
      setPrice(items?.price || "");
      setDate(items?.date || "");
    } else {
      setIcon({ value: "", name: "" });
      setTitle("");
      setPrice("");
      setDate("");
    }
  };

  const btnDeleteOrder = (id) => {
    Swal.fire({
      title: "Confirm delete",
      text: "Do you want to delete ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Delete",
      reverseButtons: true,
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-secondary",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        props.setData((prevItems) => prevItems.filter((d) => d?._id !== id));

        try {
          toast.promise(
            deleteOrder(id).then((res) => {
              if (res) {
                navigate("/add-order");
                return res;
              }
            }),
            {
              loading: "Deleting...",
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

  return (
    <>
      <div className="my-4">
        <select
          className="form-select mb-2"
          id="txtCategory"
          value={icon?.value}
          onChange={(e) => {
            const selectedItem = category.find((item) => item?.value === e.target.value);
            setIcon({ value: e.target.value, name: selectedItem?.name || "" });
          }}
        >
          <option value="">Category</option>
          {category.map((item, i) => (
            <option value={item?.value} key={i}>
              {item?.name}
            </option>
          ))}
        </select>

        <input type="text" className="form-control mb-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" id="txtTitle" />

        <input
          type="number"
          className="form-control mb-2"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          id="txtPrice"
        />

        <DatePicker
          selected={date}
          onChange={(e) => setDate(e)}
          dateFormat="dd/MM/YYYY"
          placeholderText="Select a date"
          className="form-control mb-2"
          id="txtDate"
        />

        <div className="d-flex justify-content-between">
          <div>
            <button className="btn btn-danger" onClick={() => btnDeleteOrder(items?.id)}>
              Delete
            </button>
          </div>
          <div>
            <button className="btn btn-secondary me-3" onClick={btnClear}>
              Clear
            </button>
            <button className="btn btn-primary" onClick={btnUpdate}>
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditOrder;
