import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = (props) => {
  const [highlightedIndex, setHighlightedIndex] = useState(null);

  const data = {
    labels: props.labels,
    datasets: [
      {
        label: "Income",
        data: props.income,
        backgroundColor: (context) => {
          const index = context.dataIndex;
          return index === highlightedIndex ? "rgba(75, 192, 192, 0.6)" : "rgba(56, 142, 60, 0.6)";
        },
        borderWidth: 1,
        borderRadius: 10,
        maxBarThickness: 10,
      },
      {
        label: "Spend",
        data: props.expense,
        backgroundColor: (context) => {
          const index = context.dataIndex;
          return index === highlightedIndex ? "rgba(75, 192, 192, 0.6)" : "rgba(255, 99, 132, 0.6)";
        },
        borderWidth: 1,
        borderRadius: 10,
        maxBarThickness: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
      title: {
        display: false,
        text: "Monthly Sales Data",
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },

    onClick: (e, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        setHighlightedIndex(index);
      }
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
