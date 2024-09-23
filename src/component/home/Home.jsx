import React, { useEffect, useState } from "react";
import "./Home.css";
import Order from "../addOrder/Order";
import { numberWithCommas } from "../baseFunction/BaseFunction";

const Home = (props) => {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  useEffect(() => {
    const totalIncome = props.data.filter((item) => item.category.split(" ")[1] === "Income").reduce((prev, item) => prev + item.price, 0);
    const totalExpense = props.data.filter((item) => item.category.split(" ")[1] !== "Income").reduce((prev, item) => prev + item.price, 0);

    window.scrollTo(0, 0);
    setIncome(totalIncome);
    setExpense(totalExpense);
  }, [props.data]);

  return (
    <>
      <div className="total-balance-con my-4">
        <label className="text-title">Total Balance</label>
        <div className="text-center">
          <label className="fw-bold my-2" style={{ fontSize: "28px", color: "var(--color-white)" }}>
            ฿{numberWithCommas(income - expense)}
          </label>
        </div>

        <div className="row">
          <div className="col-6">
            <div className="total-balance-box">
              <i className="fa-solid fa-arrow-down text-success"></i>
              <div className="text-start fw-bold ms-2">
                <label style={{ fontSize: "12px", color: "var(--color-gray)" }}>Income</label>
                <br />
                <label style={{ fontSize: "14px", color: "var(--color-white)" }}>฿{numberWithCommas(income)}</label>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="total-balance-box justify-content-end">
              <i className="fa-solid fa-arrow-up text-danger"></i>
              <div className="text-start fw-bold ms-2">
                <label style={{ fontSize: "12px", color: "var(--color-gray)" }}>Expense</label>
                <br />
                <label style={{ fontSize: "14px", color: "var(--color-white)" }}>฿{numberWithCommas(expense)}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <label className="text-title">Upcoming</label>
      <Order data={props.data} />
    </>
  );
};

export default Home;
