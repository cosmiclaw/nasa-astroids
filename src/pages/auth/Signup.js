import "./auth.css";

import * as React from "react";

import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../../firebase/config";

import Loader from "../../components/loader";

function Signup() {
  const navigate = useNavigate();

  const [displayName, setDisplayName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  const handleSignup = (e) => {
    e.preventDefault();

    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        updateProfile(userCredential.user, { displayName: displayName }).then(
          () => {
            setLoading(false);
            navigate("/");
          }
        );
      })
      .catch((error) => {
        setLoading(false);
        alert("Signup Failed: " + error.message);
      });
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
    <form onSubmit={handleSignup} className="form">
      <div className="input-group">
        <label>Display Name</label>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          type="text"
          required
          placeholder="Display Name"
        />
      </div>
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
        <button type="submit">Sign up</button>
      </div>
      <div className="signup-text">
        <p>Already have an account?</p>{" "}
        <Link to="/login">
          <span>Login</span>
        </Link>
      </div>
    </form>
  );
}

export default Signup;
