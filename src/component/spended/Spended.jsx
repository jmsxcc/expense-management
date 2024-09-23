import React, { useState, useEffect, useMemo, useCallback } from "react";
import BarChart from "../chart/BarChart";
import DoughnutChart from "../chart/DoughnutChart";
import "./Spended.css";
import Order from "../addOrder/Order";
import { numberWithCommas, icon_income, icon_expense } from "../baseFunction/BaseFunction";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const timeFrames = {
  weekly: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  monthly: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

const Spended = ({ data }) => {
  const [chartData, setChartData] = useState({ weekly: { income: [], expense: [] }, monthly: { income: [], expense: [] } });
  const [labels, setLabels] = useState(timeFrames.weekly);
  const [chartType, setChartType] = useState("weekly");
  const [totals, setTotals] = useState({ income: 0, expense: 0, food: 0, travel: 0, share: 0, shopping: 0, bill: 0 });
  const [date, setDate] = useState(moment().toDate());
  const [typeChart, setTypeChart] = useState("Bar");

  const filterDataByPeriod = useCallback(
    (startDate, endDate) => {
      return data.filter((item) => moment(item.date, "YYYY-MM-DD").isBetween(startDate, endDate, null, "[]"));
    },
    [data]
  );

  const calculateTotals = useCallback((filteredData, timeframe) => {
    return {
      income: timeframe.map((_, index) =>
        filteredData
          .filter((item) => moment(item.date).get(timeframe === timeFrames.weekly ? "weekday" : "month") === index && item.type === "Income")
          .reduce((sum, item) => sum + item.price, 0)
      ),
      expense: timeframe.map((_, index) =>
        filteredData
          .filter((item) => moment(item.date).get(timeframe === timeFrames.weekly ? "weekday" : "month") === index && item.type !== "Income")
          .reduce((sum, item) => sum + item.price, 0)
      ),
    };
  }, []);

  useEffect(() => {
    const startAndEndOfWeek = [moment(date).startOf("week"), moment(date).endOf("week")];
    const startAndEndOfMonth = [moment(date).startOf("month"), moment(date).endOf("month")];

    const filteredWeeklyData = filterDataByPeriod(startAndEndOfWeek[0], startAndEndOfWeek[1]);
    const filteredMonthlyData = filterDataByPeriod(startAndEndOfMonth[0], startAndEndOfMonth[1]);

    const newTotals = {
      income: data.filter((item) => item.category.split(" ")[1] === "Income").reduce((sum, item) => sum + item.price, 0),
      expense: data.filter((item) => item.category.split(" ")[1] !== "Income").reduce((sum, item) => sum + item.price, 0),
      food: filteredWeeklyData.filter((item) => item.category.split(" ")[1] === "Food").reduce((sum, item) => sum + item.price, 0),
      travel: filteredWeeklyData.filter((item) => item.category.split(" ")[1] === "Travel").reduce((sum, item) => sum + item.price, 0),
      share: filteredWeeklyData.filter((item) => item.category.split(" ")[1] === "Share").reduce((sum, item) => sum + item.price, 0),
      shopping: filteredWeeklyData.filter((e) => e.category.split(" ")[1] === "Shopping").reduce((prev, item) => prev + item.price, 0),
      bill: filteredWeeklyData.filter((e) => e.category.split(" ")[1] === "Bill").reduce((prev, item) => prev + item.price, 0),
    };

    window.scrollTo(0, 0);

    setTotals(newTotals);
    setChartData({
      weekly: calculateTotals(filteredWeeklyData, timeFrames.weekly),
      monthly: calculateTotals(filteredMonthlyData, timeFrames.monthly),
    });
  }, [data, date, filterDataByPeriod, calculateTotals]);

  const selectType = useCallback(
    (type) => {
      setLabels(timeFrames[type]);
      setChartType(type);
      const startAndEndOfPeriod =
        type === "weekly" ? [moment(date).startOf("week"), moment(date).endOf("week")] : [moment(date).startOf("month"), moment(date).endOf("month")];
      const filteredData = filterDataByPeriod(startAndEndOfPeriod[0], startAndEndOfPeriod[1]);

      setTotals((prevTotals) => ({
        ...prevTotals,
        food: filteredData.filter((e) => e.category.split(" ")[1] === "Food").reduce((prev, item) => prev + item.price, 0),
        travel: filteredData.filter((e) => e.category.split(" ")[1] === "Travel").reduce((prev, item) => prev + item.price, 0),
        share: filteredData.filter((e) => e.category.split(" ")[1] === "Share").reduce((prev, item) => prev + item.price, 0),
        shopping: filteredData.filter((e) => e.category.split(" ")[1] === "Shopping").reduce((prev, item) => prev + item.price, 0),
        bill: filteredData.filter((e) => e.category.split(" ")[1] === "Bill").reduce((prev, item) => prev + item.price, 0),
      }));
    },
    [date, filterDataByPeriod]
  );

  const currentChartData = useMemo(() => (chartType === "weekly" ? chartData.weekly : chartData.monthly), [chartType, chartData]);

  return (
    <>
      <div className="btn-group w-100 my-4" role="group" aria-label="Basic radio toggle button group">
        <input
          type="radio"
          className="btn-check"
          name="btnradio"
          id="btnradio1"
          autoComplete="off"
          value="weekly"
          onChange={(e) => selectType(e.target.value)}
          defaultChecked
        />
        <label className="btn btn-outline-secondary" htmlFor="btnradio1">
          Weekly
        </label>

        <input
          type="radio"
          className="btn-check"
          name="btnradio"
          id="btnradio2"
          autoComplete="off"
          value="monthly"
          onChange={(e) => selectType(e.target.value)}
        />
        <label className="btn btn-outline-secondary" htmlFor="btnradio2">
          Monthly
        </label>
      </div>

      <DatePicker
        selected={date}
        onChange={(date) => setDate(date)}
        dateFormat="dd/MM/yyyy"
        placeholderText="Select a date"
        className="form-control mb-2"
        id="txtDate"
      />

      <select className="form-select" id="dllBarType" onChange={(e) => setTypeChart(e.target.value)}>
        <option value="Bar">Bar Chart</option>
        <option value="Doughnut">Doughnut Chart</option>
      </select>

      {typeChart === "Bar" && (
        <div className="my-4">
          <BarChart labels={labels} income={currentChartData.income} expense={currentChartData.expense} />
        </div>
      )}

      {typeChart === "Doughnut" && (
        <div className="my-4">
          <DoughnutChart
            income={totals.income}
            food={totals.food}
            travel={totals.travel}
            share={totals.share}
            shopping={totals.shopping}
            bill={totals.bill}
          />
        </div>
      )}

      <div className="row">
        <div className="col-6">
          <div className="spend-con">
            <div className="items-icon">
              <img src={icon_income} alt="Income" />
            </div>
            <div className="text-start align-content-center">
              <p className="spend-title">Income</p>
              <p className="spend-desc">฿{numberWithCommas(totals.income)}</p>
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
              <p className="spend-desc">฿{numberWithCommas(totals.expense)}</p>
            </div>
          </div>
        </div>
      </div>

      <h5 className="text-title">Recent transactions</h5>
      <Order data={data} />
    </>
  );
};

export default Spended;
