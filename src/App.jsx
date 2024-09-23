import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./component/navbar/Navbar";
import Home from "./component/home/Home";
import Spended from "./component/spended/Spended";
import AddOrder from "./component/addOrder/AddOrder";
import EditOrder from "./component/addOrder/EditOrder";
import LoginPage from "./component/authentication/LoginPage";
import Header from "./component/header/Header";
import Profile from "./component/authentication/Profile";
import ChangePassword from "./component/authentication/ChangePassword";
import { searchDataByUsername } from "./component/baseFunction/BaseFunction";
import { logout } from "./component/baseFunction/Authentication";
import "../src/App.css";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [userActive, setUserActive] = useState(!!token);
  const [header, setHeader] = useState("");
  const [edit, setEdit] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchIncome_Expense();
  }, [token]);

  const fetchIncome_Expense = async () => {
    setUserActive(!!token);
    setLoading(true);
    try {
      if (userActive) {
        const res = await searchDataByUsername(user?.username);
        setData(res.data);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUserActive(false);
        toast.error("Session expired. Please log in again.");
      } else {
        toast.promise(
          logout().then((res) => {
            if (res) {
              setUserActive(false);
              return res;
            }
          }),
          {
            loading: "Logouting...",
            success: (res) => `${res?.message}`,
            error: (err) => `${err?.message}`,
          }
        );
      }
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="loader">
          <p className="heading">Loading...</p>
          <div className="loading">
            <div className="load"></div>
            <div className="load"></div>
            <div className="load"></div>
            <div className="load"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="top-right" />

      {userActive && (
        <div
          className="position-fixed start-0 bottom-0 w-100"
          style={{
            backgroundColor: "var(--color-white)",
            padding: "1rem 0",
            borderRadius: "2rem 2rem 0 0",
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
          }}
        >
          <Navbar setHeader={setHeader} />
        </div>
      )}

      <div className={userActive ? "container p-4" : undefined} style={userActive ? { marginBottom: "4.5rem" } : undefined}>
        {userActive && <Header header={header} setUserActive={setUserActive} setEdit={setEdit} />}

        <Routes>
          <Route path="/login" element={userActive ? <Navigate to="/" /> : <LoginPage setUserActive={setUserActive} />} />
          <Route path="/" element={userActive ? <Home data={data} /> : <Navigate to="/login" />} />
          <Route path="/spended" element={userActive ? <Spended data={data} /> : <Navigate to="/login" />} />
          <Route path="/add-order" element={userActive ? <AddOrder data={data} setData={setData} /> : <Navigate to="/login" />} />
          <Route path="/edit-order" element={userActive ? <EditOrder setData={setData} /> : <Navigate to="/login" />} />
          <Route path="/change-password" element={userActive ? <ChangePassword setUserActive={setUserActive} /> : <Navigate to="/login" />} />
          <Route
            path="/profile"
            element={userActive ? <Profile data={data} setUserActive={setUserActive} edit={edit} setEdit={setEdit} /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
