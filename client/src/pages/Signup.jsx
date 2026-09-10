import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosInstance";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const onSubmitForm = async (event) => {
    event.preventDefault();
    try {
      setErrMsg("");
      setLoading(true);
      const response = await api.post("/auth/register", userDetails);
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
      setErrMsg(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <section className="signup-section">
        <h1 className="signup-head">Signup</h1>
        <form onSubmit={onSubmitForm} className="signup-form">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter name"
            title="Please Enter name"
            value={userDetails.name}
            onChange={(e) =>
              setUserDetails({ ...userDetails, name: e.target.value })
            }
            required
          />
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
          <button type="submit" disabled={loading} className="signup-button">
            {loading ? "Signing up..." : "Sign Up"}
          </button>
          <p className="form-already">
            Already have an account? <Link to="/login">Login</Link>
          </p>
          {errMsg && <p className="signup-error">{errMsg}</p>}
        </form>
      </section>
    </div>
  );
};

export default Signup;
