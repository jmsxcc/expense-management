import React, { useState, useEffect } from "react";
import { numberWithCommas } from "../baseFunction/BaseFunction";
import moment from "moment";
import { Link, useLocation } from "react-router-dom";
import "./Order.css";

const Order = (props) => {
  const [showScroll, setShowScroll] = useState(false);
  const [more, setMore] = useState(7); // Initial number of items shown
  const location = useLocation();
  const isAddOrder = location.pathname === "/add-order";
  const user = JSON.parse(localStorage.getItem("user"));
  const sortedData = props.data.sort((a, b) => new Date(b.date) - new Date(a.date));
  const filterDate = [...new Set(props.data.map((item) => moment(item?.date).format("YYYY-MM-DD")))];

  useEffect(() => {
    localStorage.removeItem("dataList");

    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const btnEdit = (id, icon, category, title, price, date) => {
    const dataList = {
      id: id,
      icon: icon,
      category: category,
      title: title,
      price: price,
      date: date,
      username: user?.username,
    };

    localStorage.setItem("dataList", JSON.stringify(dataList));
  };

  const btnScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const dateToFromNowDaily = (myDate) => {
    var fromNow = moment(myDate).fromNow();

    return moment(myDate).calendar(null, {
      lastWeek: "[Last] dddd",
      lastDay: "[Yesterday]",
      sameDay: "[Today]",
      nextDay: "[Tomorrow]",
      nextWeek: "dddd",
      sameElse: () => `[${fromNow}]`,
    });
  };

  const totalPriceByDate = (date) => {
    const income = sortedData
      .filter((e) => moment(e.date, "YYYY-MM-DD").format("YYYY-MM-DD") === date && e.category.split(" ")[1] === "Income")
      .reduce((prev, current) => prev + current.price, 0);

    const expense = sortedData
      .filter((e) => moment(e.date, "YYYY-MM-DD").format("YYYY-MM-DD") === date && e.category.split(" ")[1] !== "Income")
      .reduce((prev, current) => prev + current.price, 0);

    return income - expense;
  };

  return (
    <>
      {filterDate &&
        filterDate.slice(0, more).map((date, index) => (
          <div style={{ marginTop: index > 0 ? "2rem" : "1rem" }} key={index}>
            <div className="d-flex justify-content-between">
              <span className="order-txt-date">{moment(date).format("DD/MM/YYYY")}</span>
              <span className="order-txt-price">Total: ฿{numberWithCommas(totalPriceByDate(date))}</span>
            </div>

            {sortedData &&
              sortedData
                .filter((fd) => moment(fd.date, "YYYY-MM-DD").format("YYYY-MM-DD") === date)
                .map((items, i) =>
                  isAddOrder ? (
                    <Link
                      to="/edit-order"
                      key={i}
                      onClick={() => btnEdit(items?._id, items?.icon, items?.category, items?.title, items?.price, items?.date)}
                      style={{ textDecoration: "none" }}
                    >
                      <div className="items-con">
                        <div className="items-box1">
                          <div className="items-icon">
                            <img src={items?.icon} alt={items?.title} />
                          </div>
                          <div style={{ width: "150px" }}>
                            <p className="items-title">{items?.title}</p>
                            <p className="items-desc">{items?.category}</p>
                          </div>
                        </div>
                        <div className="items-box2">
                          {items?.category.split(" ")[1] === "Income" ? (
                            <p className="items-title text-success">+฿{numberWithCommas(items?.price)}</p>
                          ) : (
                            <p className="items-title text-danger">-฿{numberWithCommas(items?.price)}</p>
                          )}
                          <p className="items-desc">{dateToFromNowDaily(items?.date)}</p>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="items-con" key={i}>
                      <div className="items-box1">
                        <div className="items-icon">
                          <img src={items?.icon} alt={items?.title} />
                        </div>
                        <div style={{ width: "150px" }}>
                          <p className="items-title">{items?.title}</p>
                          <p className="items-desc">{items?.category}</p>
                        </div>
                      </div>
                      <div className="items-box2">
                        {items?.category.split(" ")[1] === "Income" ? (
                          <p className="items-title text-success">+฿{numberWithCommas(items?.price)}</p>
                        ) : (
                          <p className="items-title text-danger">-฿{numberWithCommas(items?.price)}</p>
                        )}
                        <p className="items-desc">{dateToFromNowDaily(items?.date)}</p>
                      </div>
                    </div>
                  )
                )}
          </div>
        ))}

      {filterDate.length > 7 && (
        <div className="text-center">
          <b onClick={() => setMore((prev) => (prev === filterDate.length ? 7 : filterDate.length))}>
            {more === filterDate.length ? (
              <>
                Show Less <i className="fa-solid fa-angle-up"></i>
              </>
            ) : (
              <>
                More <i className="fa-solid fa-angle-down"></i>
              </>
            )}
          </b>
        </div>
      )}

      <div className="scroll-top" onClick={btnScrollTop} style={{ display: showScroll ? "block" : "none" }}>
        <i className="fa-solid fa-angles-up"></i>
      </div>
    </>
  );
};

export default Order;
