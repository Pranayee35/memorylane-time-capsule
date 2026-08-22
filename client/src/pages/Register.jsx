import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
export const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }
      
      console.log("Registration successful:", data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", formData.email);
      navigate(from);

    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div>
      <h1>Create your MemoryLane account</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
        />

        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />

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
          Register
        </button>
      </form>
      <p>
  Already have an account?{" "}
  <button type="button" onClick={() => navigate("/login")}>
    Login
  </button>
</p>
    </div>
  );
};