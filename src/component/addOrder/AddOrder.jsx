import React, { useEffect, useState } from "react";
import Order from "../addOrder/Order";
import moment from "moment";
import { searchCategory, addOrder } from "../baseFunction/BaseFunction";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";

const AddOrder = (props) => {
  const [icon, setIcon] = useState({ value: "", name: "" });
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCategory();
    setDate(moment().format("YYYY-MM-DD HH:mm:ss"));
  }, []);

  const fetchCategory = async () => {
    const allCategory = await searchCategory();
    setCategory(allCategory);
  };

  const btnSave = async () => {
    try {
      if (!icon?.value || !title || !price || !date) {
        return toast.error("Please fill in all the fields.");
      }

      const itemData = {
        icon: icon?.value,
        category: icon?.name,
        title: title,
        price: parseInt(price),
        date: moment(date).format("YYYY-MM-DD HH:mm:ss"),
        username: user.username,
      };

      toast.promise(
        addOrder(itemData).then((res) => {
          if (res) {
            props.setData((prev) => [...prev, res.data]);
            return res;
          }
        }),
        {
          loading: "Saving...",
          success: (res) => `${res?.message}`,
          error: (err) => `${err?.message}`,
        }
      );

      btnClear();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const btnClear = () => {
    setIcon({ value: "", name: "" });
    setTitle("");
    setPrice("");
    setDate(moment().format("YYYY-MM-DD HH:mm:ss"));
  };

  return (
    <>
      <div className="my-4">
        <select
          className="form-select mb-2"
          id="addCategory"
          value={icon.value}
          onChange={(e) => {
            const selectedItem = category.find((item) => item.value === e.target.value);
            setIcon({ value: e.target.value, name: selectedItem ? selectedItem.name : "" });
          }}
        >
          <option value="">Category</option>
          {category.map((items, i) => (
            <option value={items?.value} key={i}>
              {items?.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          className="form-control mb-2"
          id="txtTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          aria-label="Title"
        />

        <input
          type="number"
          className="form-control mb-2"
          id="txtPrice"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          aria-label="Price"
        />

        <DatePicker
          selected={date}
          onChange={(e) => setDate(e)}
          dateFormat="dd/MM/YYYY"
          placeholderText="Select a date"
          className="form-control mb-2"
          id="txtDate"
        />

        <div className="row mt-2">
          <div className="col-6">
            <button className="btn btn-secondary w-100" onClick={btnClear}>
              Clear
            </button>
          </div>

          <div className="col-6">
            <button className="btn btn-primary w-100" onClick={btnSave}>
              Save
            </button>
          </div>
        </div>
      </div>

      <h5 className="text-title">Upcoming</h5>

      <Order data={props.data} />
    </>
  );
};

export default AddOrder;
