import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const initializeGoogle = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: "979965796474-uojacq73meebj0uvb58n42325a184pp1.apps.googleusercontent.com",
          callback: handleGoogleLoginResponse
        });
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-button"),
          { theme: "outline", size: "large", width: "100%" }
        );
      } else {
        setTimeout(initializeGoogle, 100);
      }
    };
    initializeGoogle();
  }, []);

  const handleGoogleLoginResponse = async (googleResponse) => {
    try {
      const idToken = googleResponse.credential;
      const response = await fetch(
        "http://localhost:5000/api/auth/login-google",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        }
      );

      const data = await response.json();

      console.log("GOOGLE LOGIN RESPONSE", data);

      if (data.success) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        if (data.user.role === "ADMIN") {
          navigate("/admin");
        } else if (data.user.role === "STAFF") {
          navigate("/kitchen");
        } else {
          navigate("/home");
        }
      } else {
        alert(data.message || "Google Authentication Failed");
      }
    } catch (error) {
      console.error(error);
      alert("Server Connection Failed during Google Sign-in");
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please enter Username and Password");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      console.log("LOGIN RESPONSE");
      console.log(data);

      if (data.success) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        if (data.user.role === "ADMIN") {
          navigate("/admin");
        } else if (data.user.role === "STAFF") {
          navigate("/kitchen");
        } else {
          navigate("/home");
        }
      } else {
        alert(
          data.message || "Invalid Credentials"
        );
      }
    } catch (error) {
      console.error(error);
      alert("Server Connection Failed");
    }
  };

  return (
    <div className="login-page">
      <div className="main-card">

        {/* HEADER */}
        <div className="department-header">
          <img
            src="/images/images.png"
            alt="Government Logo"
            className="dept-logo"
          />

          <div className="dept-title">
            <h1>
              Office of the Principal Accountant General (A&E), W.B.
            </h1>

            <p>
              Treasury Buildings, Kolkata - 700001
            </p>
          </div>

          <img
            src="/images/IA&AS_Logo.png"
            alt="IA&AS Logo"
            className="dept-logo"
          />
        </div>

        {/* CONTENT */}
        <div className="content-area">

          <div className="login-card">

            <h2>Employee Login</h2>

            <p className="login-subtitle">
              eCanteen Food Coupon & Ordering System
            </p>

            <div className="form-group">
              <label>Username</label>

              <input
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
              />
            </div>

            <button
              className="login-btn"
              onClick={handleLogin}
            >
              Login
            </button>

            <div className="login-divider">OR</div>

            <div id="google-signin-button" style={{ display: "flex", justifyContent: "center" }}></div>

            <div className="forgot-password">
              <span
                onClick={() =>
                  navigate("/forgot-password")
                }
              >
                Forgot Password?
              </span>
            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className="login-footer">
          © 2026 eCanteen | Office Canteen Management System
        </div>

      </div>
    </div>
  );
}

export default Login;