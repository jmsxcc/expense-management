import React from "react";
import toast, { Toaster } from "react-hot-toast"; // Ensure you are using "react-hot-toast"

const Test = () => {
  const btnSuccess = () => toast.success("Success!");

  return (
    <>
      <div>
        <button onClick={btnSuccess}>Success</button> {/* Simplified the onClick handler */}
      </div>
    </>
  );
};

export default Test;
