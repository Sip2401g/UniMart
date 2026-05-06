import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Register = () => {
  const [form, setForm] = useState({
    name: "", email: "", password: "", college: "", phone: "", role: "student",
  });
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
      const { data } = await api.post("/auth/register", form);
      login(data);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-page">

      {/* LEFT PANEL */}
      <div className="auth-left">
        <div className="auth-deco">
          <div className="deco-circle deco-c1"></div>
          <div className="deco-circle deco-c2"></div>
          <div className="deco-circle deco-c3"></div>
          <div className="deco-grid"></div>
        </div>

        <div className="auth-left-brand">
          <span>Uni Mart</span>
        </div>

        <div className="auth-left-copy">
          <div className="auth-badge">Join your campus marketplace</div>
          <h2>Start buying and selling with your college community</h2>
          <p>Create a free account and connect with thousands of students nearby. List your items in under 2 minutes.</p>
          <div className="auth-features">
            <div className="auth-feature-pill">Free to join</div>
            <div className="auth-feature-pill">Secure and safe</div>
            <div className="auth-feature-pill">Easy listing</div>
            <div className="auth-feature-pill">Direct contact</div>
          </div>
        </div>

        <div className="auth-left-stats">
          <div className="stat-item"><p>2.4k</p><span>Students</span></div>
          <div className="stat-item"><p>800+</p><span>Listings</span></div>
          <div className="stat-item"><p>50+</p><span>Colleges</span></div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right register-right">

        {/* Decorative background behind form */}
        <div className="register-deco">
          <div className="reg-deco-circle reg-c1"></div>
          <div className="reg-deco-circle reg-c2"></div>
          <div className="reg-deco-circle reg-c3"></div>
          <div className="reg-deco-dots"></div>
        </div>

        <div className="auth-right-inner">
          <h3>Create your account</h3>
          <p className="auth-sub">Join thousands of students on Uni Mart</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={form.name}
                onChange={handleChange} placeholder="Shubham Gupta" required />
            </div>
            <div className="form-group">
              <label>College Email</label>
              <input type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="you@college.edu" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={form.password}
                onChange={handleChange} placeholder="min 6 characters" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>College Name</label>
                <input type="text" name="college" value={form.college}
                  onChange={handleChange} placeholder="MIT Pune" required />
              </div>
              <div className="form-group">
                <label>Phone (optional)</label>
                <input type="tel" name="phone" value={form.phone}
                  onChange={handleChange} placeholder="9xxxxxxxxx" />
              </div>
            </div>
            <div className="form-group">
              <label>Account Type</label>
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="student">Student</option>
                <option value="college_head">College Head (Admin)</option>
              </select>
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="auth-divider"><hr /><span>or</span><hr /></div>
          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Register;