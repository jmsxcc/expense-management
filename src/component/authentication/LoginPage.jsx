import React, { useState, useEffect } from "react";
import { login, signup } from "../baseFunction/Authentication";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import toast from "react-hot-toast";

const LoginPage = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [signUpPage, setSignUpPage] = useState(false);

  useEffect(() => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  }, []);

  const btnSignIn = async (e) => {
    e.preventDefault();

    try {
      if (!username || !password) {
        return toast.error("Please fill in all the fields.");
      }

      const auth = { username, password };

      toast.promise(
        login(auth).then((res) => {
          if (res) {
            props.setUserActive(true);
            navigate("/");
            return res;
          }
        }),
        {
          loading: "Logging in...",
          success: (res) => `${res?.message}`,
          error: (err) => `Invalid username or password`,
        }
      );
    } catch (err) {
      return toast.error("Invalid username or password");
    }
  };

  const btnSignUp = async (e) => {
    e.preventDefault();

    try {
      if (!username || !password || !confirmPassword) {
        return toast.error("Please fill in all the fields.");
      }

      if (password !== confirmPassword) {
        return toast.error("Passwords do not match.");
      }

      const img = "https://i.pinimg.com/564x/93/77/74/937774e7d44142d538f31bf128d60607.jpg";
      const name = username;
      const auth = { username, password, name, img };

      toast.promise(
        signup(auth).then((res) => {
          if (res) {
            navigate("/");
            return res;
          }
        }),
        {
          loading: "signing up in...",
          success: (res) => `${res?.message}`,
          error: (err) => `Signup failed. Please try again.`,
        }
      );
    } catch (error) {
      return toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <div className="container-login">
      <div className="card-login">
        <div className="img-login">
          <img
            src="https://blog.darwinbox.com/hubfs/How%20To%20Create%20a%20Travel%20and%20Expense%20Policy%20%5BWith%20Templates%5D.jpg"
            alt="Login"
          />
        </div>

        <form className="box-login">
          <h1 className="text-center fw-bold">{signUpPage ? "Sign up" : "Sign in"}</h1>

          <div className="input-group flex-nowrap mt-4">
            <span className="input-group-text" id="username">
              <i className="fa-solid fa-user"></i>
            </span>
            <input
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              placeholder="Username"
              aria-describedby="username"
            />
          </div>

          <div className="input-group flex-nowrap mt-3">
            <span className="input-group-text" id="password">
              <i className="fa-solid fa-lock"></i>
            </span>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              placeholder="Password"
              aria-describedby="password"
            />
          </div>

          {signUpPage && (
            <div className="input-group flex-nowrap mt-3">
              <span className="input-group-text" id="confirmPassword">
                <i className="fa-solid fa-lock"></i>
              </span>
              <input
                className="form-control"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                placeholder="Confirm Password"
                aria-describedby="confirmPassword"
              />
            </div>
          )}

          <button
            className="btn btn-primary mt-2 w-100 mt-4"
            onClick={(e) => {
              signUpPage ? btnSignUp(e) : btnSignIn(e);
            }}
          >
            {signUpPage ? "Sign up" : "Sign in"}
          </button>

          <div className="text-center mt-4">
            {signUpPage ? (
              <span>
                Have an account?
                <a style={{ textDecoration: "underline", color: "blue", cursor: "pointer" }} onClick={() => setSignUpPage(false)}>
                  Sign in
                </a>
              </span>
            ) : (
              <span>
                Don't have an account?
                <a style={{ textDecoration: "underline", color: "blue", cursor: "pointer" }} onClick={() => setSignUpPage(true)}>
                  Sign up
                </a>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
