import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      console.log("Login successful:", data);

      // We'll use this token for authenticated requests
      localStorage.setItem("token", data.token);

      // For now, also store the email
      localStorage.setItem("userEmail", formData.email);

      navigate(from);

    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div>
      <h1>Login to MemoryLane</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit">
          Login
        </button>
      </form>
      <p>
  Don't have an account?{" "}
  <button type="button" onClick={() => navigate("/register")}>
    Register
  </button>
</p>
    </div>
  );
};