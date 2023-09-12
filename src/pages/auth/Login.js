import "./auth.css";

import * as React from "react";

import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/config";

import Loader from "../../components/loader";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  const handleLogin = (e) => {
    e.preventDefault();

    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((_userCredential) => {
        navigate("/");
      })
      .catch((error) => {
        alert("Login Failed: " + error.message);
      })
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      }

      setLoading(false);
    });
  }, [navigate]);

  if (loading) return <Loader />;

  return (
    <form onSubmit={handleLogin} className="form">
      <div className="input-group">
        <label>Email Address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          placeholder="Email Address"
        />
      </div>
      <div className="input-group">
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          placeholder="Password"
        />
      </div>
      <div className="input-group">
        <button type="submit">Log in</button>
      </div>
      <div className="signup-text">
        <p>Don't have an account?</p>{" "}
        <Link to="/signup">
          <span>Sign Up</span>
        </Link>
      </div>
    </form>
  );
}

export default Login;
