import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import api from "../api/axiosInstance";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const onSubmitForm = async (event) => {
    event.preventDefault();
    try {
      setErrMsg("");
      setLoading(true);
      const response = await api.post("/auth/login", userDetails);
      const { token, user } = response?.data;
      Cookies.set("jwt_token", token, { expires: 7 });
      Cookies.set("user", JSON.stringify(user), { expires: 7 });
      navigate("/feed", { replace: true });
    } catch (err) {
      console.error(err);
      setErrMsg(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <section className="login-section">
        <h1 className="login-head">Login</h1>
        <form onSubmit={onSubmitForm} className="login-form">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter Email"
            title="Please enter valid email address"
            value={userDetails.email}
            onChange={(e) =>
              setUserDetails({ ...userDetails, email: e.target.value })
            }
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter Password"
            value={userDetails.password}
            onChange={(e) =>
              setUserDetails({ ...userDetails, password: e.target.value })
            }
            required
            minLength={8}
            title="Password must be at least 8 characters"
          />
          <button type="submit" disabled={loading} className="login-button">
            {loading ? "Logging..." : "Login"}
          </button>
          <p className="no-signup">
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
          {errMsg && <p className="login-error">{errMsg}</p>}
        </form>
      </section>
    </div>
  );
};

export default Login;
