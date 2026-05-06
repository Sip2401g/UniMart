import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      login(data);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-page">
      <div className="auth-left">

        {/* Decorative background */}
        <div className="auth-deco">
          <div className="deco-circle deco-c1"></div>
          <div className="deco-circle deco-c2"></div>
          <div className="deco-circle deco-c3"></div>
          <div className="deco-grid"></div>
        </div>

        {/* Brand */}
        <div className="auth-left-brand">
          <span>Uni Mart</span>
        </div>

        {/* Copy */}
        <div className="auth-left-copy">
          <div className="auth-badge">Trusted by students across campuses</div>
          <h2>Buy and sell within your campus community</h2>
          <p>Connect with students at your college. Find great deals on textbooks, electronics, furniture and more.</p>
          <div className="auth-features">
            <div className="auth-feature-pill">Textbooks</div>
            <div className="auth-feature-pill">Electronics</div>
            <div className="auth-feature-pill">Furniture</div>
            <div className="auth-feature-pill">Clothing</div>
          </div>
        </div>

        {/* Stats */}
        <div className="auth-left-stats">
          <div className="stat-item"><p>2.4k</p><span>Students</span></div>
          <div className="stat-item"><p>800+</p><span>Listings</span></div>
          <div className="stat-item"><p>50+</p><span>Colleges</span></div>
        </div>

      </div>

      <div className="auth-right">
        <div className="auth-right-inner">
          <h3>Welcome back</h3>
          <p className="auth-sub">Sign in to your account to continue</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email address</label>
              <input type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="you@college.edu" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={form.password}
                onChange={handleChange} placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="auth-divider"><hr /><span>or</span><hr /></div>
          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;