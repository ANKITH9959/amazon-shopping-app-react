import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleNext = () => {
    if (!email || !password || !phone) {
      alert("Please fill all details");
      return;
    }

    // Save login info
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPhone", phone);

    alert("Login successful");

    // Go back to dashboard
    navigate("/");
  };

  return (
    <div className="box">
      <h2>Login Details</h2>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="tel"
        placeholder="Enter Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button onClick={handleNext}>
        Next
      </button>
    </div>
  );
}

export default Login;